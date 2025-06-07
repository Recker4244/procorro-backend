const rfqService = require("../services/rfq");
const HttpErrors = require("../../errors/httpErrors");

const createRfq = async (req, res) => {
  try {
    const rfqData = req.body;
    const company_id = req.user.company_id;
    const rfq = await rfqService.createRfq(company_id, rfqData);
    res.status(201).json(rfq);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getRfq = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.company_id;
    const rfq = await rfqService.getRfq(company_id, id);
    res.status(200).json(rfq);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getRfqs = async (req, res) => {
  const company_id = req.user.company_id;
  const company_type = req.user.company_type;
  try {
    const rfqs = await rfqService.getRfqs(company_id, company_type);
    res.status(200).json(rfqs);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getRFQComparison = async(req,res) => {
  try {
    const rfqId = req.params.rfqId;
    const company_id = req.user.company_id;
    const rfqComparison = await rfqService.getRFQComparison(company_id, rfqId);
    res.status(200).json(rfqComparison);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

const updateRfq = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.company_id;
    const rfqData = req.body;
    const updatedRfq = await rfqService.updateRfq(company_id, id, rfqData);
    res.status(200).json(updatedRfq);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const deleteRfq = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.company_id;
    await rfqService.deleteRfq(company_id, id);
    res.status(200).json({ message: "RFQ deleted successfully" });
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = {
  createRfq,
  getRfq,
  getRfqs,
  updateRfq,
  deleteRfq,
  getRFQComparison
};
