const Router = require("express").Router();
const projectController = require("../controllers/project");
const { verifyJWT } = require("../middlewares/auth");

Router.get("/", verifyJWT, projectController.getProjects);
Router.get("/:id", verifyJWT, projectController.getProject);
Router.post("/", verifyJWT, projectController.createProject);
Router.put("/:id", verifyJWT, projectController.updateProject);

module.exports = Router;
