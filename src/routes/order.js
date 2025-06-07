const Router = require("express").Router();
const orderController = require("../controllers/order");
const { verifyJWT, requireCompanyType } = require("../middlewares/auth");

Router.get("/", verifyJWT, orderController.getOrders);
Router.get("/:id", verifyJWT, orderController.getOrder);
Router.post("/", verifyJWT, requireCompanyType("Buyer"), orderController.createOrder);
Router.put("/:id", verifyJWT, requireCompanyType("Buyer"), orderController.updateOrder);
Router.post("/:id/status", verifyJWT, requireCompanyType("Supplier"), orderController.addTrackingEvent);
Router.get("/:id/tracking", verifyJWT, orderController.getTrackingEvents);
Router.get("/generate_purchase_order", orderController.generatePurchaseOrder);

module.exports = Router;
