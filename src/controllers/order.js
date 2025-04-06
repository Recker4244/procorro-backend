const orderService = require("../services/order");
const httpErrors = require("http-errors");
const PDFDocument = require("pdfkit");

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const order = await orderService.createOrder(orderData);
    res.status(201).json(order);
  } catch (err) {
    if (err instanceof httpErrors) {
      res.status(err.code).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrder(id);
    res.status(200).json(order);
  } catch (err) {
    if (err instanceof httpErrors) {
      res.status(err.code).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getOrders = async (req, res) => {
  try {
    const { page, size } = req.query;
    const orders = await orderService.getOrders(page, size);
    res.status(200).json(orders);
  } catch (err) {
    if (err instanceof httpErrors) {
      res.status(err.code).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = req.body;
    const updatedOrder = await orderService.updateOrder(id, orderData);
    res.status(200).json(updatedOrder);
  } catch (err) {
    if (err instanceof httpErrors) {
      res.status(err.code).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrder(id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    if (err instanceof httpErrors) {
      res.status(err.code).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const generatePurchaseOrder = async (req, res) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  // eslint-disable-next-line quotes
  res.setHeader("Content-Disposition", 'attachment; filename="download.pdf"');
  doc.pipe(res);
  orderService.generatePurchaseOrder(doc);
  console.log("done");

  doc.end();
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  generatePurchaseOrder,
};
