const Router = require("express").Router();
const orderController = require("../controllers/order");

Router.get("/", orderController.getOrders);
Router.get("/:id", orderController.getOrder);
Router.post("/", orderController.createOrder);
Router.put("/:id", orderController.updateOrder);
Router.post("/:id/status", orderController.addTrackingEvent);
Router.get("/:id/tracking", orderController.getTrackingEvents);
Router.get("/generate_purchase_order", orderController.generatePurchaseOrder);

module.exports = Router;
