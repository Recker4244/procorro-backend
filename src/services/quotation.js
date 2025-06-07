const db = require("../models");
const HttpErrors = require("../../errors/httpErrors");

// CREATE QUOTATION WITH QUOTATION ITEMS
const createQuotation = async (company_id, quotationData) => {
  const company = await db.Company.findOne({ where: { id: company_id } });
  if (!company) throw new HttpErrors("Company not found", 400);
  const supplierName = company.name;
  const {
    rfqId,
    // deliveryTimeWeeks,
    // paymentTerms,
    // status,
    quotationItems // Array of { rfqItemId, price, totalCost, ... }
  } = quotationData;

  if (!Array.isArray(quotationItems) || quotationItems.length === 0) {
    throw new HttpErrors("quotationItems array is required", 400);
  }

  // Optional: Validate RFQ exists
  const rfq = await db.Rfq.findOne({ where: { id: rfqId } });
  if (!rfq) {
    throw new HttpErrors("RFQ not found", 400);
  }
  // Optional: Validate all RFQItems exist
  for (const item of quotationItems) {
    const rfqItem = await db.RfqItem.findOne({ where: { id: item.rfqItemId } });
    if (!rfqItem) {
      throw new HttpErrors(`RFQ Item ${item.rfqItemId} not found`, 400);
    }
    if (rfqItem.status !== "Open") {
      throw new HttpErrors(`Quotations are not allowed for item ${item.rfqItemId} (status: ${rfqItem.status})`, 400);
    }
    // Optionally calculate totalCost if not provided
    if (!item.totalCost) {
      item.totalCost = parseFloat(item.price) * parseFloat(rfqItem.quantity);
    }
  }

  try {
    // Create the Quotation
    const quotation = await db.Quotation.create(
      {
        rfqId: quotationData.rfqId,
        company_id: company_id,
        supplierName,
        deliveryTimeWeeks: quotationData.deliveryTimeWeeks,
        paymentTerms: quotationData.paymentTerms,
        status: "Submitted",
        quotationItems: quotationData.quotationItems
      },
      {
        include: [{ model: db.QuotationItem, as: "quotationItems" }]
      }
    );
    return quotation;
  } catch (error) {
    console.error("Create quotation error:", error);
    throw new HttpErrors("Internal server error", 500);
  }
};

// GET SINGLE QUOTATION WITH ITEMS
const getQuotation = async (id) => {
  try {
    const quotation = await db.Quotation.findOne({
      where: { id },
      include: [{ model: db.QuotationItem, as: "quotationItems" }]
    });
    if (!quotation) {
      throw new HttpErrors("Quotation not found", 404);
    }
    return quotation;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

// GET ALL QUOTATIONS WITH ITEMS
const getQuotations = async () => {
  try {
    const quotations = await db.Quotation.findAll({
      include: [{ model: db.QuotationItem, as: "quotationItems" }]
    });
    return quotations;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

// UPDATE QUOTATION AND ITS ITEMS
const updateQuotation = async (id, company_id, quotationData) => {
  const company = await db.Company.findOne({ where: { id: company_id } });
  if (!company) throw new HttpErrors("Company not found", 400);
  // const supplierName = company.name;
  try {
    const quotation = await db.Quotation.findOne({ where: { id } });
    if (!quotation) {
      throw new HttpErrors("Quotation not found", 404);
    }
    if (quotation.company_id !== company_id) {
      throw new HttpErrors("Unauthorized: You can only update your own quotations", 403);
    }
    // Update main quotation fields
    await db.Quotation.update(quotationData, { where: { id } });

    // If updating items, handle them separately
    if (quotationData.quotationItems) {
      // For simplicity, delete old items and add new ones
      await db.QuotationItem.destroy({ where: { quotationId: id } });
      for (const item of quotationData.quotationItems) {
        await db.QuotationItem.create({ ...item, quotationId: id });
      }
    }

    // Return updated quotation with items
    return await db.Quotation.findOne({
      where: { id },
      include: [{ model: db.QuotationItem, as: "quotationItems" }]
    });
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

// DELETE QUOTATION AND ITS ITEMS
const deleteQuotation = async (id, company_id) => {
  const company = await db.Company.findOne({ where: { id: company_id } });
  if (!company) throw new HttpErrors("Company not found", 400);
  const supplierName = company.name;
  try {
    const quotation = await db.Quotation.findOne({ where: { id } });
    if (!quotation) {
      throw new HttpErrors("Quotation not found", 404);
    }
    if (quotation.supplierName !== supplierName) {
      throw new HttpErrors("Unauthorized: You can only delete your own quotations", 403);
    }
    await db.QuotationItem.destroy({ where: { quotationId: id } });
    await db.Quotation.destroy({ where: { id } });
    return { message: "Quotation deleted successfully" };
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

module.exports = {
  createQuotation,
  getQuotation,
  getQuotations,
  updateQuotation,
  deleteQuotation
};
