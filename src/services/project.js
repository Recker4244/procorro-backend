const db = require("../models");
const { validate: isUuid } = require('uuid');
const HttpErrors = require("../../errors/httpErrors");

const createProject = async (projectData) => {
  if (!isUuid(projectData.company_id)) {
    throw new HttpErrors("Invalid company ID format", 400);
  }
  const company = await db.Company.findOne({
    where: { id: projectData.company_id },
  });
  if (!company) {
    throw new HttpErrors("Company ID does not exist", 400);
  }
  try {
    if(projectData.workType === "Government"){
      projectData.governmentDepartmentName = projectData.workTypeSpecific;
    }
    else if(projectData.workType === "Private"){
      projectData.privateDepartmentClient = projectData.workTypeSpecific;
    }
    delete projectData.workTypeSpecific;
    const projectDetails = await db.Project.create(projectData);
    return projectDetails;
  } catch (error) {
    console.error("Create project error:", error);
    throw new HttpErrors("Internal server error", 500);
  }
};

const getProject = async (id) => {
  try {
    const project = await db.Project.findOne({ where: { id: id } });
    if (!project) {
      throw new HttpErrors("Project not found", 404);
    }
    return project;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

const getProjects = async () => {
  try{
    const projects = await db.Project.findAll();
    return projects;
  } catch (error){
    throw new HttpErrors("Internal server error", 500);
  }
};

const updateProject = async (id, projectData) => {
  try {
    const project = await db.Project.findOne({ where: { id: id } });
    if (!project) {
      throw new HttpErrors("Project not found", 404);
    }
    await db.Project.update(projectData, { where: { id: id } });
    const updatedProject = await db.Project.findOne({ where: { id: id } });
    return updatedProject;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

const deleteProject = async (id) => {
  try {
    const project = await db.Project.findOne({ where: { id: id } });
    if (!project) {
      throw new HttpErrors("Project not found", 404);
    }
    await db.Project.destroy({ where: { id: id } });
    return { message: "Project deleted successfully" };
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

module.exports = { createProject, getProject, getProjects, updateProject, deleteProject };
