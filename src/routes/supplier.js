const Router = require("express").Router();
const supplierController = require("../controllers/supplier");

Router.get("/", supplierController.getSuppliers);
Router.get("/:id", supplierController.getSupplier);
Router.post("/", supplierController.createSupplier);
Router.put("/:id", supplierController.updateSupplier);
Router.delete("/:id", supplierController.deleteSupplier);

module.exports = Router;
