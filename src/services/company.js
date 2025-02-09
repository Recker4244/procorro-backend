const db = require("../models");
const httpErrors = require("http-errors");

const getAllCompanies = async () => {
  const companies = await db.Company.findAll();
  return companies;
};

const createCompany = async (name, address, gst, company_type) => {
  const newCompany = await db.Company.create({
    name,
    address,
    gst,
    company_type,
  });
  return newCompany;
};

const editCompany = async (id, name, address, gst, company_type) => {
  const company = await db.Company.findOne({ where: { id: id } });
  if (!company) {
    throw new httpErrors("Company not found", 404);
  }
  const newCompany = await db.Company.update(
    {
      name,
      address,
      gst,
      company_type,
    },
    { where: { id: id } }
  );
  console.log("reached");
  return newCompany;
};
module.exports = { getAllCompanies, createCompany, editCompany };
