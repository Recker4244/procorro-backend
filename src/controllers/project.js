const projectService = require("../services/project");
const HttpErrors = require("../../errors/httpErrors");

const createProject = async (req, res) => {
  try {
    const projectData = req.body;
    const company_id = req.user.company_id; // Extract from JWT
    const project = await projectService.createProject(company_id, projectData);
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
    const company_id = req.user.company_id;
    const project = await projectService.getProject(company_id, id);
    res.status(200).json(project);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getProjects = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const projects = await projectService.getProjects(company_id);
    res.status(200).json(projects);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.company_id;
    const projectData = req.body;
    const updatedProject = await projectService.updateProject(company_id, id, projectData);
    res.status(200).json(updatedProject);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.company_id;
    await projectService.deleteProject(company_id, id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
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
