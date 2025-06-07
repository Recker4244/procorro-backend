const orderService = require("../services/order");
const HttpErrors = require("../../errors/httpErrors");
const PDFDocument = require("pdfkit");

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const company_id = req.user.company_id;
    const company_type = req.user.company_type;
    const order = await orderService.createOrder(company_id, company_type, orderData);
    res.status(201).json({ id: order.id });
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.company_id;
    const company_type = req.user.company_type;
    const order = await orderService.getOrder(company_id, id, company_type);
    res.status(200).json(order);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getOrders = async (req, res) => {
  try {
    const { page, size } = req.query;
    const company_id = req.user.company_id;
    const company_type = req.user.company_type;
    if (company_type === "Supplier") {
      const orders = await orderService.getOrdersForSupplier(company_id, page, size);
      res.status(200).json(orders);
    } else {
      const orders = await orderService.getOrders(company_id, page, size);
      res.status(200).json(orders);
    }
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.company_id;
    const company_type = req.user.company_type;
    const orderData = req.body;
    const updatedOrder = await orderService.updateOrder(company_id, company_type, id, orderData);
    res.status(200).json(updatedOrder);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.company_id;
    const company_type = req.user.company_type;
    await orderService.deleteOrder(company_id, company_type, id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const addTrackingEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const company_id = req.user.company_id;
    const company_type = req.user.company_type;
    const event = await orderService.addTrackingEvent(company_id,  company_type, id, status, remarks);
    res.status(201).json(event);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

// GET /order/:id/tracking — Get all tracking events for an order
const getTrackingEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.company_id;
    const company_type = req.user.company_type;
    const events = await orderService.getTrackingEvents(company_id, company_type, id);
    res.status(200).json(events);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
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

  const primaryColor = "#E75B2C"; // Orange
  const blackColor = "#000000";

  // Add header
  doc
    .fontSize(20)
    .fillColor(primaryColor)
    .text("PURCHASE ORDER", 400, 50, { align: "right" })
    .fontSize(10)
    .fillColor(blackColor)
    .text("Purchase Order - PO-001", 400, 70, { align: "right" });

  // Address Section
  doc
    .fontSize(12)
    .fillColor(primaryColor)
    .text("Address", 50, 50)
    .fillColor(blackColor)
    .fontSize(10)
    .text("Jeff J Ritchie", 50, 70)
    .text("Sacramento", 50, 85)
    .text("CA 95815", 50, 100);

  // Delivery Address Box
  doc
    .roundedRect(50, 140, 250, 70, 5)
    .strokeColor(primaryColor)
    .lineWidth(1)
    .stroke()
    .fillColor(primaryColor)
    .fontSize(12)
    .text("Deliver To:", 60, 150)
    .fillColor(blackColor)
    .fontSize(10)
    .text("Warehouse 1", 60, 170)
    .text("7485 Drew Court", 60, 185)
    .text("White City", 60, 200)
    .text("KS 66872", 60, 215);

  // Order Date and Delivery Date
  doc
    .fillColor(primaryColor)
    .fontSize(12)
    .text("Order date", 400, 140)
    .fillColor(blackColor)
    .text("20/10/2020", 400, 155)
    .fillColor(primaryColor)
    .text("Delivery date", 400, 180)
    .fillColor(blackColor)
    .text("20/10/2020", 400, 195);

  // Table Header
  const tableTop = 260;
  const columnWidths = [50, 250, 50, 80, 80]; // Widths for each column
  let y = tableTop;

  doc
    .fillColor(primaryColor)
    .fontSize(10)
    .text("SR.NO", 50, y, { width: columnWidths[0], align: "center" })
    .text("Item Description", 100, y, { width: columnWidths[1], align: "left" })
    .text("Qty", 350, y, { width: columnWidths[2], align: "center" })
    .text("Rate", 400, y, { width: columnWidths[3], align: "right" })
    .text("Amount", 480, y, { width: columnWidths[4], align: "right" });

  y += 20;

  doc
    .moveTo(50, y)
    .lineTo(550, y)
    .strokeColor(primaryColor)
    .lineWidth(1)
    .stroke();
  y += 10;

  // Table Rows
  const items = [
    {
      no: "1",
      desc: "Ream of Paper",
      qty: "1",
      rate: "$50.00",
      amount: "$50.00",
    },
    { no: "2", desc: "Desk", qty: "1", rate: "$100.00", amount: "$100.00" },
    { no: "3", desc: "Chair", qty: "1", rate: "$120.00", amount: "$120.00" },
  ];

  doc.fillColor(blackColor).fontSize(10);
  items.forEach((item) => {
    doc
      .text(item.no, 50, y, { width: columnWidths[0], align: "center" })
      .text(item.desc, 100, y, { width: columnWidths[1], align: "left" })
      .text(item.qty, 350, y, { width: columnWidths[2], align: "center" })
      .text(item.rate, 400, y, { width: columnWidths[3], align: "right" })
      .text(item.amount, 480, y, { width: columnWidths[4], align: "right" });

    y += 20;
  });

  doc.moveTo(50, y).lineTo(550, y).strokeColor(primaryColor).stroke();
  y += 10;

  // Total Amount Section
  doc
    .fillColor(primaryColor)
    .fontSize(12)
    .text("Total", 400, y, { width: columnWidths[3], align: "right" })
    .fillColor(blackColor)
    .fontSize(10)
    .text("$270.00", 480, y, { width: columnWidths[4], align: "right" });

  // Notes Section
  y += 50;
  doc.fillColor(primaryColor).fontSize(12).text("Notes", 50, y);
  doc.end();
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  addTrackingEvent,
  getTrackingEvents,
  generatePurchaseOrder,
};
