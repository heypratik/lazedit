"use server"

// @ts-ignore
import Projects from "../../../../models/Projects"
import { uuid } from "uuidv4";

export async function createProject(storeId: any) {
    try {
        const project = {
            id: uuid(),
            name: "Untitled project",
            json: "",
            width: 900,
            height: 1200,
            storeId: storeId
        }   

        const response = await Projects.create(project)

        if (response) {
            return response.dataValues
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
    }
}

export async function getProjectById(id: any) {
    try {
        const project = await await Projects.findByPk(id);

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
export async function getProjects(storeId: any, page: any, limit: any) {
    try {
        const projects = await Projects.findAndCountAll({
            where: {
                storeId: storeId,
                isTemplate: false
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
    }
}

// Paginated All Templates
export async function getAllTemplates(page: any, limit: any) {
    try {
        const projects = await Projects.findAndCountAll({
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

export async function duplicateTemplate(storeId: any, projectId: any) {
    try {
        const originalProject = await Projects.findByPk(projectId, {
            raw: true
        });

        if (!originalProject) {
            return null;
        }

        // Remove unique identifiers and add new storeId
        const { id, createdAt, updatedAt, isTemplate, ...projectData } = originalProject;
        
        // Create new project with the provided storeId
        const newProject = await Projects.create({
            ...projectData,
            id: uuid(),
            isTemplate: false,
            storeId: storeId
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
        const originalProject = await Projects.findByPk(projectId, {
            raw: true
        });

        if (!originalProject) {
            return null;
        }

        // Remove unique identifiers and add new storeId
        const { id, createdAt, updatedAt, isTemplate, ...projectData } = originalProject;
        
        // Create new project with the provided storeId
        const newProject = await Projects.create({
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
        const project = await Projects.findByPk(projectId);

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