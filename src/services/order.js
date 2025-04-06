const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const HttpErrors = require("../../errors/httpErrors");
const items = [
  {
    code: "12",
    description: "Item 1",
    quantity: 2,
    rate: 100,
    amount: 200,
  },
  {
    code: "12",
    description: "Item 2",
    quantity: 3,
    rate: 50,
    amount: 150,
  },
  {
    code: "33",
    description: "Item 3",
    quantity: 1,
    rate: 200,
    amount: 200,
  },
  {
    code: "42",
    description: "Item 4",
    quantity: 2,
    rate: 100,
    amount: 200,
  },
  {
    code: "33",
    description: "Item 4",
    quantity: 2,
    rate: 100,
    amount: 200,
  },
];

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

const generatePurchaseOrder = (doc) => {
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("DRAFT PURCHASE ORDER", { align: "center" });
  doc.moveDown(1);
  doc
    .fontSize(12)
    .font("Helvetica")
    .text("G R Infraprojects Ltd.", { align: "center" });
  doc.text(
    "Registered Office: Revenue Block No. 223, Old Survey No. 384/1, 384/2 Paiki and 384/3, Khata No. 464, Kochariya, Ahmedabad, Gujarat - 382220, India",
    {
      align: "center",
      width: 500,
    }
  );
  doc.text("Email: info@grinfra.com | Ph: +91-124-6435000", {
    align: "center",
  });
  doc.moveDown(1);

  // Grid Layout for Vendor, PO Details, Billing & Delivery Addresses
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Purchase Order Details", { underline: true });
  doc.moveDown(0.5);

  const columnWidth = 250;
  doc.fontSize(10).font("Helvetica-Bold");
  doc
    .text("Vendor Details:", { continued: true })
    .text("Purchase Order Details:", 320);
  doc.fontSize(10).font("Helvetica");
  doc
    .text("Vendor Code: 2276", { continued: true })
    .text("PO No: 3600071122", 320);
  doc
    .text("GSTN No: 36AACCS8680H1ZZ", { continued: true })
    .text("Date: 16.10.2018", 320);
  doc
    .text("M/s SAGAR CEMENTS LIMITED", { continued: true })
    .text("PR No: 130043112", 320);
  doc.text(
    "3rd Floor, Plot No.111, Road No.10, Jubilee Hills, Hyderabad, India",
    50,
    doc.y,
    { width: columnWidth }
  );
  doc.moveDown(1);

  doc.fontSize(10).font("Helvetica-Bold");
  doc
    .text("Billing Address:", { continued: true })
    .text("Delivery Address:", 320);
  doc.fontSize(10).font("Helvetica");
  doc
    .text("G R Infraprojects Ltd.", { continued: true })
    .text("G R Infraprojects Ltd.", 320);
  doc.text(
    "First Floor, H No. 5-113, 5th Ward, SBI Building, Devarapalli Mandal, Devarapalli, West Godawari, AP - 534313, India",
    50,
    doc.y,
    { width: columnWidth }
  );
  doc.text("Bandapuram, West Godawari, Andhra Pradesh, India", 320, doc.y, {
    width: columnWidth,
  });
  doc.moveDown(1);

  // Table Header
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Order Details:", { underline: true });
  doc.moveDown(0.5);

  const tableTop = doc.y;
  doc.fontSize(10).font("Helvetica-Bold");
  doc
    .text("SNo", 50, tableTop)
    .text("Item Code", 100, tableTop)
    .text("Description", 180, tableTop, { width: 150 })
    .text("Quantity", 350, tableTop)
    .text("Rate", 420, tableTop)
    .text("Amount", 500, tableTop);
  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  let y = tableTop + 20;
  doc.fontSize(10).font("Helvetica");
  items.forEach((item, index) => {
    doc
      .text(`${index + 1}`, 50, y)
      .text(item.code, 100, y)
      .text(item.description, 180, y, { width: 150, align: "justify" })
      .text(item.quantity, 350, y)
      .text(item.rate, 420, y)
      .text(item.amount, 500, y);
    y = doc.y + 5; // Adjust for dynamic line breaks
  });

  doc
    .moveTo(50, y + 5)
    .lineTo(550, y + 5)
    .stroke();
  doc.moveDown(1);

  // Total Amount Section
  const totalAmount = items.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`Total Order Value: Rs. ${totalAmount.toFixed(2)}`, {
      align: "right",
    });
  doc.text(
    "Amount in words: Forty Seven Lakh Thirty Nine Thousand Nine Hundred Ninety Four Only",
    { width: 500, align: "justify" }
  );
  doc.moveDown(1);

  // Terms & Conditions
  doc.fontSize(12).font("Helvetica-Bold").text("Terms & Conditions:", {
    underline: true,
    align: "left",
    width: 500,
  });
  doc.moveDown(0.5);
  doc.fontSize(10).font("Helvetica");
  doc.text("1. Price Basis: FOR Project Site.", 50, doc.y, { width: 500 });
  doc.text(
    "2. Transportation/Freight Charges: To be borne by Supplier.",
    50,
    doc.y,
    { width: 500 }
  );
  doc.text("3. IGST @ 28% as mentioned above.", 50, doc.y, { width: 500 });
  doc.moveDown(1);

  // Signature Section
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("For G R INFRAPROJECTS LTD.", { align: "left" });
  doc.text("Authorized Signatory", { align: "left" });
  return;
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  generatePurchaseOrder,
};
