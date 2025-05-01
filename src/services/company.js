const db = require("../models");
const HttpErrors = require("../../errors/httpErrors");

const getAllCompanies = async () => {
  const companies = await db.Company.findAll();
  return companies;
};

const createCompany = async (name, address, gst, company_type) => {
  const company = await db.Company.findOne({
    where: { gst: gst },
  });
  if (company) {
    throw new HttpErrors("Company already registered", 400);
  }
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
    throw new HttpErrors("Company not found", 404);
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
