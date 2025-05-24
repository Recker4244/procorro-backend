const Router = require("express").Router();
const quotationController = require("../controllers/quotation");

Router.get("/", quotationController.getQuotations);
Router.get("/:id", quotationController.getQuotation);
Router.post("/", quotationController.createQuotation);
Router.put("/:id", quotationController.updateQuotation);
Router.delete("/:id", quotationController.deleteQuotation);

module.exports = Router;
