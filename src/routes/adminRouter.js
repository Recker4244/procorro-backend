const Router = require("express").Router();
const adminController = require("../controllers/adminController");

Router.route("/users")
  .post(adminController.createUser)
  .get(adminController.getUsers)
  .put(adminController.updateUser);

Router.route("/users/:username").get(adminController.getUser);

module.exports = Router;
