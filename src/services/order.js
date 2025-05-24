const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const HttpErrors = require("../../errors/httpErrors");

const createOrder = async (orderData) => {
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
      }

      return order;
    });

    return result;
  } catch (error) {
    console.error("Create Order error:", error);
    throw new HttpErrors("Internal server error", 500);
  }
};

const getOrder = async (id) => {
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
                  attributes: ['supplierName']
                }
              ]
            }
          ]
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

const getOrders = async (page, size) => {
  try {
    page--;
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    const orders = await db.Order.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: db.OrderItem,
          as: 'order_items',
        }
      ]
    });
    return orders;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

const updateOrder = async (id, orderData) => {
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

const deleteOrder = async (id) => {
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
const addTrackingEvent = async (orderId, status, remarks = null) => {
  try {
    const event = await db.OrderTrackingEvent.create({
      id: uuidv4(),
      order_id: orderId,
      status,
      remarks,
      timestamp: new Date(),
    });
    return event;
  } catch (error) {
    console.error("addTrackingEvent error:", error);
    throw new HttpErrors("Failed to add tracking event", 500);
  }
};

// GET all tracking events for an order
const getTrackingEvents = async (orderId) => {
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

module.exports = { createOrder, getOrder, getOrders, updateOrder, deleteOrder, addTrackingEvent, getTrackingEvents };
