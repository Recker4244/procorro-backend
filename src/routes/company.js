const Router = require('express').Router();
const companyController = require('../controllers/company');

Router.get('/', companyController.getAllCompanies);
Router.post('/', companyController.createCompany);
Router.put('/:company_id', companyController.editCompany);

module.exports = Router;