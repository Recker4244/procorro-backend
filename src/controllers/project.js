const projectService = require("../services/project");
const HttpErrors = require("../../errors/httpErrors");

const createProject = async (req, res) => {
  try {
    const projectData = req.body;
    const project = await projectService.createProject(projectData);
    res.status(201).json(project);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProject(id);
    res.status(200).json(project);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.code).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects();
    res.status(200).json(projects);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.code).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const projectData = req.body;
    const updatedProject = await projectService.updateProject(id, projectData);
    res.status(200).json(updatedProject);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.code).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await projectService.deleteProject(id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.code).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = {
  createProject,
  getProject,
  getProjects,
  updateProject,
  deleteProject
};
