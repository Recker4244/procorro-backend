const db = require("../models");
const { validate: isUuid } = require('uuid');
const HttpErrors = require("../../errors/httpErrors");

const createProject = async (company_id, projectData) => {
  if (!isUuid(company_id)) {
    throw new HttpErrors("Invalid company ID format", 400);
  }
  const company = await db.Company.findOne({
    where: { id: company_id },
  });
  if (!company) {
    throw new HttpErrors("Company ID does not exist", 400);
  }
  try {
    projectData.company_id = company_id;
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

const getProject = async (company_id, id) => {
  try {
    const project = await db.Project.findOne({
      where: { id, company_id },
      include: [
        {
          model: db.Rfq,
          as: 'rfqs',
          attributes: ['id', 'title', 'status', 'createdAt', 'preferredDeliveryDate'],
        }
      ]
    });
    if (!project) {
      throw new HttpErrors("Project not found", 404);
    }
    return project;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

const getProjects = async (company_id) => {
  try{
    const projects = await db.Project.findAll({ where: { company_id } });
    return projects;
  } catch (error){
    throw new HttpErrors("Internal server error", 500);
  }
};

const updateProject = async (company_id ,id, projectData) => {
  try {
    const project = await db.Project.findOne({ where: { id, company_id } });
    if (!project) {
      throw new HttpErrors("Project not found", 404);
    }
    await db.Project.update(projectData, { where: { id, company_id } });
    const updatedProject = await db.Project.findOne({ where: { id, company_id } });
    return updatedProject;
  } catch (error) {
    throw new HttpErrors("Internal server error", 500);
  }
};

const deleteProject = async (company_id, id) => {
  try {
    const project = await db.Project.findOne({ where: { id, company_id } });
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
