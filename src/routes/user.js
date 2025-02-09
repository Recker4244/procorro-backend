const Router = require("express").Router();
const userController = require("../controllers/user");

Router.get("/", userController.getAllUsers);
Router.post("/", userController.createUser);
Router.put("/:id", userController.editUser);

module.exports = Router;
