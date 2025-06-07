const Router = require("express").Router();
const quotationController = require("../controllers/quotation");
const { verifyJWT, requireCompanyType } = require("../middlewares/auth");

Router.get("/", verifyJWT, quotationController.getQuotations);
Router.get("/:id", verifyJWT, quotationController.getQuotation);
Router.post("/", verifyJWT, requireCompanyType("Supplier"), quotationController.createQuotation);
Router.put("/:id", verifyJWT, requireCompanyType("Supplier"), quotationController.updateQuotation);
Router.delete("/:id", verifyJWT, requireCompanyType("Supplier"), quotationController.deleteQuotation);

module.exports = Router;
