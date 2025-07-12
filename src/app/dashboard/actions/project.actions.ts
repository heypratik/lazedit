"use server"

// @ts-ignore
const {Project} = require("../../../../models")

import { uuid } from "uuidv4";

export async function createProject(orgId: any, userId: any) {
    console.log("Creating project for orgId:", orgId, "and userId:", userId);
    try {
        const project = {
            id: uuid(),
            name: "Untitled project",
            json: "",
            width: 900,
            height: 1200,
            organization_id: orgId,
            user_id: userId,
        }   

        const response = await Project.create(project)

        if (response) {
            return response.dataValues
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function getProjectById(id: any) {
    try {
        const project = await await Project.findByPk(id);

        if (project) {
            return project.dataValues
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
    }
}

// Paginated All Projects based on storeId
export async function getProjects(orgId: any, userId: any, page: any, limit: any) {
    try {
        const projects = await Project.findAndCountAll({
            where: {
                organization_id: orgId,
                user_id: userId
            },
            limit: limit,
            offset: page * limit
        })

        if (projects) {
            return projects
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

// Paginated All Templates
export async function getAllTemplates(page: any, limit: any) {
    try {
        const projects = await Project.findAndCountAll({
            where: {
                isTemplate: true
            },
            limit: limit,
            offset: page * limit
        })

        if (projects) {
            console.log(projects)
            return projects
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
    }
}

export async function duplicateTemplate(orgId: any, user_id: any, projectId: any) {
    try {
        const originalProject = await Project.findByPk(projectId, {
            raw: true
        });

        if (!originalProject) {
            return null;
        }

        // Remove unique identifiers and add new storeId
        const { id, createdAt, updatedAt, ...projectData } = originalProject;
        
        // Create new project with the provided storeId
        const newProject = await Project.create({
            ...projectData,
            id: uuid(),
            organization_id: orgId,
            user_id: user_id,
        });

        if (newProject) {
            return newProject.dataValues;
        } else {
            return null;
        }

    } catch (error) {
        console.log(error);
    }
}

export async function duplicateProject(projectId: any) {
    try {
        const originalProject = await Project.findByPk(projectId, {
            raw: true
        });

        if (!originalProject) {
            return null;
        }

        // Remove unique identifiers and add new storeId
        const { id, createdAt, updatedAt, isTemplate, ...projectData } = originalProject;
        
        // Create new project with the provided storeId
        const newProject = await Project.create({
            ...projectData,
            id: uuid(),
            isTemplate: false,
        });

        if (newProject) {
            return newProject.dataValues;
        } else {
            return null;
        }

    } catch (error) {
        console.log(error);
    }
}

export async function deleteProject(projectId: any) {
    try {
        const project = await Project.findByPk(projectId);

        if (project) {
            await project.destroy();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}