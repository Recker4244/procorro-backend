const db = require("../models");
const { validate: isUuid } = require("uuid");
const HttpErrors = require("../../errors/httpErrors");

const createRfq = async (company_id, rfqData) => {
  if (!isUuid(rfqData.projectId)) {
    throw new HttpErrors("Invalid project ID format", 400);
  }

  const project = await db.Project.findOne({ where: { id: rfqData.projectId } });
  if (!project) {
    throw new HttpErrors("Project ID does not exist", 400);
  }
  if (project.company_id !== company_id) {
    throw new HttpErrors("Unauthorized: Project does not belong to your company", 403);
  }
  rfqData.status = "Submitted";
  try {
    const result = await db.sequelize.transaction(async (t) => {
      const rfq = await db.Rfq.create(rfqData, { transaction: t });
      // If items are included in the request, create them as well
      if (rfqData.items && rfqData.items.length > 0) {
        const items = rfqData.items.map((item) => ({
          ...item,
          rfqId: rfq.id, // Associate the item with the created RFQ
        }));
        // Insert all RfqItems associated with the RFQ
        await db.RfqItem.bulkCreate(items, { transaction: t });
      }
      return rfq;
    });

    return result;
  } catch (error) {
    console.error("Create RFQ error:", error);
    throw new HttpErrors("Internal server error", 500);
  }
};

const getRfq = async (company_id, id) => {
  try {
    const rfq = await db.Rfq.findOne({
      where: { id },
      include: [
        {
          model: db.RfqItem,
          as: 'items', // Ensure this matches your model association
          attributes: ['id', 'type', 'quantity', 'unit', 'notes', 'status'],
        },
        {
          model: db.Project,
          as: 'project',
          attributes: ['company_id']
        }
      ],
    });
    if (!rfq) {
      throw new HttpErrors("RFQ not found", 404);
    }
    if (rfq.project.company_id !== company_id) {
      throw new HttpErrors("Unauthorized: RFQ does not belong to your company", 403);
    }
    return rfq;
  } catch (error) {
    console.error("Get RFQ error:", error);
    throw new HttpErrors("Internal server error", 500);
  }
};


const getRfqs = async (company_id, company_type) => {
  try {
    let rfqs;
    if (company_type === "Supplier") {
      rfqs = await db.Rfq.findAll({
        where: { status: "Submitted" },
        include: [
          {
            model: db.Project,
            as: 'project',
            attributes: ['project_name', 'company_id'],
            include: [
              {
                model: db.Company,
                as: 'company',
                attributes: ['name'],
              }
            ]
          },
          {
            model: db.RfqItem,
            as: 'items',
            attributes: ['id', 'type', 'quantity', 'unit', 'status'],
            include: [
              {
                model: db.QuotationItem,
                as: 'quotationItems',
                attributes: ['id', 'quotationId'],
                include: [
                  {
                    model: db.Quotation,
                    as: 'quotation',
                    attributes: ['id'],
                  },
                ],
              },
            ],
          }
        ],
      });
    } else {
      rfqs = await db.Rfq.findAll({
        include: [
          {
            model: db.Project,
            as: 'project',
            attributes: ['project_name', 'company_id'],
            where: { company_id }
          },
          {
            model: db.RfqItem,
            as: 'items',
            attributes: ['id', 'type', 'quantity', 'unit', 'status'],
            include: [
              {
                model: db.QuotationItem,
                as: 'quotationItems',
                attributes: ['id', 'quotationId'],
                include: [
                  {
                    model: db.Quotation,
                    as: 'quotation',
                    attributes: ['id'],
                  },
                ],
              },
            ],
          }
        ],
      });
    }

    const enrichedRfqs = rfqs.map(rfq => {
      const totalItems = rfq.items ? rfq.items.length : 0;
      const totalQuotations = rfq.items.reduce((sum, item) => sum + (item.quotationItems ? item.quotationItems.length : 0), 0);

      return {
        id: rfq.id,
        title: rfq.title,
        deliveryLocation: rfq.deliveryLocation,
        preferredDeliveryDate: rfq.preferredDeliveryDate,
        status: rfq.status,
        createdAt: rfq.createdAt,
        projectName: rfq.project?.project_name,
        companyName: rfq.project?.company?.name,
        totalItems,
        totalQuotations,
        items: rfq.items.map(item => ({
          id: item.id,
          type: item.type,
          quantity: item.quantity,
          unit: item.unit,
          status:item.status
        })),
      };
    });

    return enrichedRfqs;
  } catch (error) {
    console.error("Get RFQs error:", error);
    throw new HttpErrors("Internal server error", 500);
  }
};

const updateRfq = async (company_id, id, rfqData) => {
  try {
    const rfq = await db.Rfq.findOne({
      where: { id },
      include: [{
        model: db.Project,
        as: 'project',
        attributes: ['company_id']
      }]
    });
    if (!rfq) {
      throw new HttpErrors("RFQ not found", 404);
    }
    if (rfq.project.company_id !== company_id) {
      throw new HttpErrors("Unauthorized: RFQ does not belong to your company", 403);
    }
    await db.Rfq.update(rfqData, { where: { id } });
    const updatedRfq = await db.Rfq.findOne({ where: { id } });
    return updatedRfq;
  } catch (error) {
    console.error("Update RFQ error:", error);
    throw new HttpErrors("Internal server error", 500);
  }
};

const deleteRfq = async (company_id, id) => {
  try {
    const rfq = await db.Rfq.findOne({
      where: { id },
      include: [{
        model: db.Project,
        as: 'project',
        attributes: ['company_id']
      }]
    });
    if (!rfq) {
      throw new HttpErrors("RFQ not found", 404);
    }
    if (rfq.project.company_id !== company_id) {
      throw new HttpErrors("Unauthorized: RFQ does not belong to your company", 403);
    }
    await db.Rfq.destroy({ where: { id } });
    return { message: "RFQ deleted successfully" };
  } catch (error) {
    console.error("Delete RFQ error:", error);
    throw new HttpErrors("Internal server error", 500);
  }
};
const getRFQComparison = async (company_id, rfqId) => {
  try {
    // Fetch RFQ details with items and quotations
    const rfq = await db.Rfq.findOne({
      where: { id: rfqId },
      include: [
        {
          model: db.Project,
          as: 'project',
          attributes: [
            "project_name",
            "project_location",
            "siteInchargeName",
            "siteInchargeNumber",
            "company_id"
          ],
        },
        {
          model: db.RfqItem,
          as: "items",
          include: [
          {
            model: db.QuotationItem,
            as: "quotationItems",
            include: [
              {
                model: db.Quotation,
                as: "quotation",
              },
            ],
          },
          ],
        },
      ],
    });

    if (!rfq) {
      throw new HttpErrors("RFQ not found", 404);
    }
    if (rfq.project.company_id !== company_id) {
      throw new HttpErrors("Unauthorized: RFQ does not belong to your company", 403);
    }
    return rfq;
  } catch (error) {
    console.error('Error fetching RFQ comparison:', error);
    throw new HttpErrors("Internal server error", 500);
  }
};

module.exports = { createRfq, getRfq, getRfqs, updateRfq, deleteRfq, getRFQComparison };
