const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const HttpErrors = require("../../errors/httpErrors");

async function orderBelongsToCompany(orderId, company_id, company_type) {
  const order = await db.Order.findOne({
    where: { id: orderId },
    include: [
      {
        model: db.OrderItem,
        as: "order_items",
        include: [
          {
            model: db.QuotationItem,
            as: "quotationItem",
            include: [
              {
                model: db.Quotation,
                as: "quotation",
                attributes: ["company_id"],
                include: [
                  {
                    model: db.Rfq,
                    as: "rfq",
                    include: [
                      {
                        model: db.Project,
                        as: "project",
                        attributes: ["company_id"]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  if (!order) return false;

  return order.order_items.some(orderItem => {
    const quotation = orderItem.quotationItem?.quotation;
    const supplierCompanyId = quotation?.company_id;
    const buyerCompanyId = quotation?.rfq?.project?.company_id;

    if (company_type === "Supplier") {
      return supplierCompanyId === company_id;
    } else if (company_type === "Buyer") {
      return buyerCompanyId === company_id;
    }
    return false;
  });
}

const createOrder = async (company_id, company_type, orderData) => {
  if (company_type !== "Buyer") {
    throw new HttpErrors("Only buyers can create orders", 403);
  }
  const firstQuotationItem = await db.QuotationItem.findOne({
    where: { id: orderData.items[0].quotation_item_id },
    include: [{
      model: db.Quotation,
      as: "quotation",
      include: [{ model: db.Rfq, as: "rfq" }]
    }]
  });
  if (!firstQuotationItem) {
    throw new HttpErrors("Invalid quotation item", 400);
  }
  const rfqId = firstQuotationItem.quotation.rfq.id;

  const openItems = await db.RfqItem.count({
    where: { rfqId, status: "Open" }
  });
  if (openItems === 0) {
    throw new HttpErrors("All items for this RFQ have already been ordered. No further orders can be placed.", 400);
  }
  if (orderData.items && orderData.items.length > 0) {
    for (const item of orderData.items) {
      const quotationItem = await db.QuotationItem.findOne({
        where: { id: item.quotation_item_id },
        include: [{
          model: db.Quotation,
          as: "quotation",
          include: [{
            model: db.Rfq,
            as: "rfq",
            include: [{
              model: db.Project,
              as: "project",
              attributes: ["company_id"]
            }]
          }]
        }]
      });
      if (
        !quotationItem ||
        !quotationItem.quotation ||
        !quotationItem.quotation.rfq ||
        !quotationItem.quotation.rfq.project ||
        quotationItem.quotation.rfq.project.company_id !== company_id
      ) {
        throw new HttpErrors("Unauthorized: One or more items do not belong to your company", 403);
      }
      // Check RFQ item status
      const rfqItem = await db.RfqItem.findOne({ where: { id: item.rfqItemId } });
      if (!rfqItem || rfqItem.status !== "Open") {
        throw new HttpErrors("One or more items are not available for ordering", 400);
      }
    }
  }
  try {
    // Start transaction for atomic operation
    const result = await db.sequelize.transaction(async (transaction) => {
      // Generate a new UUID for the order
      const orderId = uuidv4();
      
      // Separate items from order fields
      const { items, ...orderFields } = orderData;

      // Create the Order
      const order = await db.Order.create(
        { ...orderFields, id: orderId },
        { transaction }
      );

      // Create OrderItems if provided
      if (items && Array.isArray(items) && items.length > 0) {
        const orderItems = items.map((item) => ({
          ...item,
          id: uuidv4(),
          order_id: orderId, // Foreign key association
        }));
        await db.OrderItem.bulkCreate(orderItems, { transaction });
        const orderedRfqItemIds = items.map(item => item.rfqItemId);
        await db.RfqItem.update(
          { status: "Ordered" }, // or "Submitted"
          { where: { id: orderedRfqItemIds }, transaction }
        );
      }
      await db.OrderTrackingEvent.create({
        id: uuidv4(),
        order_id: orderId,
        status: "Order Placed",
        remarks: null,
        timestamp: new Date(),
      }, { transaction });
      return order;
    });

    return result;
  } catch (error) {
    console.error("Create Order error:", error);
    throw new HttpErrors("Internal server error", 500);
  }
};

const getOrder = async (company_id, id, company_type) => {
  const authorized = await orderBelongsToCompany(id, company_id, company_type);
  if (!authorized) throw new HttpErrors("Unauthorized or order not found", 403);
  try {
    const order = await db.Order.findOne({
      where: { id: id },
      include: [
        {
          model: db.OrderItem,
          as: 'order_items',
          include: [
            {
              model: db.QuotationItem,
              as: 'quotationItem',
              include: [
                {
                  model: db.Quotation,
                  as: 'quotation',
                  attributes: ['supplierName', 'company_id']
                }
              ]
            }
          ]
        },
        {
          model: db.OrderTrackingEvent,
          as: 'tracking_events',
          required: false,
          order: [['timestamp', 'ASC']],
        }
      ]
    });
    if (!order) {
      throw new HttpErrors("Order not found", 404);
    }
    return order;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

const getOrders = async (company_id, page, size) => {
  try {
    page--;
    const limit = size ? +size : 3;
    // eslint-disable-next-line no-unused-vars
    const offset = page ? page * limit : 0;
    const orders = await db.Order.findAndCountAll({
      // offset: offset,
      // limit: limit,
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: db.OrderItem,
          as: 'order_items',
          include: [
            {
              model: db.QuotationItem,
              as: 'quotationItem',
              include: [
                {
                  model: db.Quotation,
                  as: 'quotation',
                  include: [
                    {
                      model: db.Rfq,
                      as: 'rfq',
                      include: [
                        {
                          model: db.Project,
                          as: 'project',
                          attributes: ['company_id'],
                          where: { company_id }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    return orders;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

const getOrdersForSupplier = async (company_id, page = 1, size = 10) => {
  page--;
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  const orders = await db.Order.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [["updatedAt", "DESC"]],
    distinct: true,
    subQuery: false,
    include: [
      {
        model: db.OrderItem,
        as: 'order_items',
        required: true,
        include: [
          {
            model: db.QuotationItem,
            as: 'quotationItem',
            required: true,
            include: [
              {
                model: db.Quotation,
                as: 'quotation',
                required: true,
                where: { company_id },
              }
            ]
          }
        ]
      },
      {
        model: db.OrderTrackingEvent,
        as: 'tracking_events',
        required: true,
        order: [['timestamp', 'DESC']]
      }
    ]
  });

  // Filter orders in JS where the latest tracking event is "Order Placed"
  const placedOrders = orders.rows.filter(order => {
    const events = order.tracking_events || [];
    if (!events.length) return false;
    const latestEvent = events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    return latestEvent.status === "Order Placed";
  });

  const allowedStatuses = ["Order Confirmed", "Order Shipped", "In Transit"];
  const confirmedOrders = orders.rows.filter(order => {
    const events = order.tracking_events || [];
    if (!events.length) return false;
    const latestEvent = events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    return allowedStatuses.includes(latestEvent.status);
  });

  return {
    toBeAccepted: placedOrders,
    accepted: confirmedOrders,
    count: {
      toBeAccepted: placedOrders.length,
      accepted: confirmedOrders.length
    }
  };
};

const updateOrder = async (company_id, company_type, id, orderData) => {
  const authorized = await orderBelongsToCompany(id, company_id, company_type);
  if (!authorized) throw new HttpErrors("Unauthorized or order not found", 403);
  try {
    const order = await db.Order.findOne({ where: { id: id } });
    if (!order) {
      throw new HttpErrors("Order not found", 404);
    }
    await db.Order.update(orderData, { where: { id: id } });
    const updatedOrder = await db.Order.findOne({ where: { id: id } });
    return updatedOrder;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

const deleteOrder = async (company_id, company_type, id) => {
  const authorized = await orderBelongsToCompany(id, company_id, company_type);
  if (!authorized) throw new HttpErrors("Unauthorized or order not found", 403);
  try {
    const order = await db.Order.findOne({ where: { id: id } });
    if (!order) {
      throw new HttpErrors("Order not found", 404);
    }
    await db.Order.destroy({ where: { id: id } });
    return { message: "Order deleted successfully" };
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};


// CREATE tracking event
const addTrackingEvent = async (company_id, company_type, orderId, status, remarks = null) => {
  const authorized = await orderBelongsToCompany(orderId, company_id, company_type);
  if (!authorized) throw new HttpErrors("Unauthorized or order not found", 403);

  if (company_type === "Buyer" && status !== "Order Placed") {
    throw new HttpErrors("Buyers can only create 'Order Placed' tracking events", 403);
  }
  if (company_type === "Supplier" && status === "Order Placed") {
    throw new HttpErrors("Suppliers cannot create 'Order Placed' tracking events", 403);
  }

  try {
    const event = await db.OrderTrackingEvent.create({
      id: uuidv4(),
      order_id: orderId,
      status,
      remarks,
      timestamp: new Date(),
    });

    if (status === "Order Confirmed") {
      const order = await db.Order.findOne({
        where: { id: orderId },
        include: [{
          model: db.OrderItem,
          as: "order_items",
          include: [{
            model: db.QuotationItem,
            as: "quotationItem",
            include: [{
              model: db.Quotation,
              as: "quotation",
              include: [{
                model: db.Rfq,
                as: "rfq"
              }]
            }]
          }]
        }]
      });

      const rfqId = order.order_items[0].quotationItem.quotation.rfq.id;
      // const rfqItemIds = order.order_items.map(
      //   item => item.quotationItem.rfqItemId
      // );

      // await db.RfqItem.update(
      //   { status: "Ordered" },
      //   { where: { id: rfqItemIds } }
      // );

      const allItems = await db.RfqItem.findAll({ where: { rfqId } });
      const allOrdered = allItems.every(item => item.status === "Ordered");

      if (allOrdered) {
        await db.Rfq.update(
          { status: "Closed" },
          { where: { id: rfqId } }
        );
      }
    }
    if (status === "Order Rejected") {
      const order = await db.Order.findOne({
        where: { id: orderId },
        include: [{
          model: db.OrderItem,
          as: "order_items",
          include: [{
            model: db.QuotationItem,
            as: "quotationItem"
          }]
        }]
      });

      const rfqItemIds = order.order_items.map(
        item => item.quotationItem.rfqItemId
      );

      // Set involved RFQ items back to "Open"
      await db.RfqItem.update(
        { status: "Open" },
        { where: { id: rfqItemIds } }
      );
    }

    return event;
  } catch (error) {
    console.error("addTrackingEvent error:", error);
    throw new HttpErrors("Failed to add tracking event", 500);
  }
};

// GET all tracking events for an order
const getTrackingEvents = async (company_id, company_type, orderId) => {
  const authorized = await orderBelongsToCompany(orderId, company_id, company_type);
  if (!authorized) throw new HttpErrors("Unauthorized or order not found", 403);
  try {
    const events = await db.OrderTrackingEvent.findAll({
      where: { order_id: orderId },
      order: [["timestamp", "ASC"]],
    });
    return events;
  } catch (error) {
    throw new HttpErrors("Failed to fetch tracking events", 500);
  }
};

module.exports = { createOrder, getOrder, getOrders, getOrdersForSupplier, updateOrder, deleteOrder, addTrackingEvent, getTrackingEvents };
