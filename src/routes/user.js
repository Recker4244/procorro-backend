const Router = require('express').Router();
const userController = require('../controllers/user');

Router.get('/', userController.getAllUsers);
Router.post('/', userController.createUser);

module.exports = Router;