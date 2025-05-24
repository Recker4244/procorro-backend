const db = require("../models");
const { validate: isUuid } = require("uuid");
const HttpErrors = require("../../errors/httpErrors");

// Create a new supplier
const createSupplier = async (supplierData) => {
  try {
    const supplier = await db.Supplier.create(supplierData);
    return supplier;
  } catch (error) {
    console.log(error);
    throw new HttpErrors("Internal server error", 500);
  }
};

// Get a supplier by ID
const getSupplier = async (id) => {
  if (!isUuid(id)) {
    throw new HttpErrors("Invalid supplier ID format", 400);
  }

  try {
    const supplier = await db.Supplier.findOne({ where: { id } });
    if (!supplier) {
      throw new HttpErrors("Supplier not found", 404);
    }
    return supplier;
  } catch (error) {
    console.log(error);
    throw new HttpErrors("Internal server error", 500);
  }
};

// Get all suppliers
const getSuppliers = async () => {
  try {
    const suppliers = await db.Supplier.findAll();
    return suppliers;
  } catch (error) {
    console.log(error);
    throw new HttpErrors("Internal server error", 500);
  }
};

// Update a supplier
const updateSupplier = async (id, supplierData) => {
  if (!isUuid(id)) {
    throw new HttpErrors("Invalid supplier ID format", 400);
  }

  try {
    const supplier = await db.Supplier.findOne({ where: { id } });
    if (!supplier) {
      throw new HttpErrors("Supplier not found", 404);
    }

    await db.Supplier.update(supplierData, { where: { id } });
    const updatedSupplier = await db.Supplier.findOne({ where: { id } });
    return updatedSupplier;
  } catch (error) {
    console.log(error);
    throw new HttpErrors("Internal server error", 500);
  }
};

// Delete a supplier
const deleteSupplier = async (id) => {
  if (!isUuid(id)) {
    throw new HttpErrors("Invalid supplier ID format", 400);
  }

  try {
    const supplier = await db.Supplier.findOne({ where: { id } });
    if (!supplier) {
      throw new HttpErrors("Supplier not found", 404);
    }

    await db.Supplier.destroy({ where: { id } });
    return { message: "Supplier deleted successfully" };
  } catch (error) {
    console.log(error);
    throw new HttpErrors("Internal server error", 500);
  }
};

module.exports = {
  createSupplier,
  getSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
};
