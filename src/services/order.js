const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const HttpErrors = require("../../errors/httpErrors");

const createOrder = async (orderData) => {
  try {
    orderData.id = uuidv4();
    const orderDetails = await db.Order.create(orderData);
    return orderDetails;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

const getOrder = async (id) => {
  try {
    const order = await db.Order.findOne({ where: { id: id } });
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

module.exports = { createOrder, getOrder, getOrders, updateOrder, deleteOrder };
