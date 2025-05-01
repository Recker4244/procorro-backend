const HttpErrors = require("../../errors/httpErrors");
const companyService = require("../services/company");

const getAllCompanies = async (req, res) => {
  try {
    const userData = await companyService.getAllCompanies();
    res.status(200).json(userData);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const createCompany = async (req, res) => {
  try {
    const { name, address, gst, company_type } = req.body;
    const newUser = await companyService.createCompany(
      name,
      address,
      gst,
      company_type
    );
    res.status(201).json(newUser);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const editCompany = async (req, res) => {
  try {
    const id = req.params.company_id;
    const { name, address, gst, company_type } = req.body;
    const newUser = await companyService.editCompany(
      id,
      name,
      address,
      gst,
      company_type
    );  
    res.status(200).json(newUser);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = { getAllCompanies, createCompany, editCompany };
