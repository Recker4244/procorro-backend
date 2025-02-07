const Router = require('express').Router();
const getAllUsers = require('../controllers/userController');

Router.get('/', getAllUsers);

module.exports = Router;