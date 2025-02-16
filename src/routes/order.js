const Router = require("express").Router();
const orderController = require("../controllers/order");

Router.get("/", orderController.getOrders);
Router.post("/", orderController.createOrder);
Router.put("/:id", orderController.updateOrder);
Router.get("/generate_purchase_order", orderController.generatePurchaseOrder);

module.exports = Router;
