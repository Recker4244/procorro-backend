const Router = require("express").Router();
const rfqController = require("../controllers/rfq");
const { verifyJWT } = require("../middlewares/auth");

Router.get('/rfq/:rfqId', verifyJWT, rfqController.getRFQComparison);

Router.get("/", verifyJWT, rfqController.getRfqs);
Router.get("/:id", verifyJWT, rfqController.getRfq);
Router.post("/", verifyJWT, rfqController.createRfq);
Router.put("/:id", verifyJWT, rfqController.updateRfq);
Router.delete("/:id", verifyJWT, rfqController.deleteRfq);

module.exports = Router;
