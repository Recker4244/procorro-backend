const quotationService = require("../services/quotation");
const HttpErrors = require("../../errors/httpErrors");

const createQuotation = async (req, res) => {
  try {
    const quotationData = req.body;
    const quotation = await quotationService.createQuotation(quotationData);
    res.status(201).json(quotation);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode || 500).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await quotationService.getQuotation(id);
    res.status(200).json(quotation);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode || 500).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getQuotations = async (req, res) => {
  try {
    const quotations = await quotationService.getQuotations();
    res.status(200).json(quotations);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode || 500).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotationData = req.body;
    const updatedQuotation = await quotationService.updateQuotation(id, quotationData);
    res.status(200).json(updatedQuotation);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode || 500).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    await quotationService.deleteQuotation(id);
    res.status(200).json({ message: "Quotation deleted successfully" });
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode || 500).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = {
  createQuotation,
  getQuotation,
  getQuotations,
  updateQuotation,
  deleteQuotation,
};
