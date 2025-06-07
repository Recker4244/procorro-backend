const Router = require("express").Router();
const userController = require("../controllers/user");
const { verifyJWT } = require("../middlewares/auth");

Router.get("/", verifyJWT, userController.getAllUsers);
Router.get("/:id", verifyJWT, userController.getUser);
Router.post("/", userController.createUser);
Router.put("/:id", verifyJWT, userController.editUser);
Router.post("/login", userController.loginUser);
module.exports = Router;
