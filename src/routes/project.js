const Router = require("express").Router();
const projectController = require("../controllers/project");

Router.get("/", projectController.getProjects);
Router.post("/", projectController.createProject);
Router.put("/:id", projectController.updateProject);

module.exports = Router;
