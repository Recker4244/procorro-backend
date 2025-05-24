const supplierService = require("../services/supplier");
const HttpErrors = require("../../errors/httpErrors");

const createSupplier = async (req, res) => {
  try {
    const supplierData = req.body;
    const supplier = await supplierService.createSupplier(supplierData);
    res.status(201).json(supplier);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await supplierService.getSupplier(id);
    res.status(200).json(supplier);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getSuppliers();
    res.status(200).json(suppliers);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplierData = req.body;
    const updatedSupplier = await supplierService.updateSupplier(id, supplierData);
    res.status(200).json(updatedSupplier);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    await supplierService.deleteSupplier(id);
    res.status(200).json({ message: "Supplier deleted successfully" });
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
  createSupplier,
  getSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
};
