const db = require("../models");

console.log("Object.keys(db):", Object.keys(db));

const getAllCompanies= async () => {
  const companies= await db.Company.findAll();
  return companies;
};

const createCompany = async (name, address, gst, company_type) => {
  const newCompany = await db.Company.create({name, address, gst, company_type});
  return newCompany;
}

module.exports =
  {getAllCompanies,
  createCompany}
;
