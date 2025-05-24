const Router = require("express").Router();
const rfqController = require("../controllers/rfq");

Router.get('/rfq/:rfqId', rfqController.getRFQComparison);

Router.get("/", rfqController.getRfqs);
Router.get("/:id", rfqController.getRfq);
Router.post("/", rfqController.createRfq);
Router.put("/:id", rfqController.updateRfq);
Router.delete("/:id", rfqController.deleteRfq);

module.exports = Router;
