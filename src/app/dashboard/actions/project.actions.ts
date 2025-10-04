"use server";

import { db } from "../../../db/drizzle";
import { projects, user, organizations } from "../../../db/schema";
import { eq, and, desc, count } from "drizzle-orm";
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
      created_at: new Date(),
      updated_at: new Date(),
    };

    const response = await db.insert(projects).values(project).returning();

    if (response && response.length > 0) {
      return response[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getProjectById(id: any) {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (project && project.length > 0) {
      return project[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getProjects(
  orgId: any,
  userId: any,
  page: any,
  limit: any
) {
  try {
    const offset = page * limit;

    const [projectResults, totalResult] = await Promise.all([
      db
        .select()
        .from(projects)
        .where(
          and(eq(projects.organization_id, orgId), eq(projects.user_id, userId))
        )
        .limit(limit)
        .offset(offset)
        .orderBy(desc(projects.created_at)),

      db
        .select({ count: count() })
        .from(projects)
        .where(
          and(eq(projects.organization_id, orgId), eq(projects.user_id, userId))
        ),
    ]);

    const total = totalResult[0].count;

    const result = {
      rows: projectResults,
      count: total,
    };

    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

// Paginated All Templates
export async function getAllTemplates(page: any, limit: any) {
  try {
    const offset = page * limit;

    const [projectResults, totalResult] = await Promise.all([
      db
        .select()
        .from(projects)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(projects.created_at)),

      db.select({ count: count() }).from(projects),
    ]);

    const total = totalResult[0].count;

    const result = {
      rows: projectResults,
      count: total,
    };

    if (result) {
      console.log(result);
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function duplicateTemplate(
  orgId: any,
  user_id: any,
  projectId: any
) {
  try {
    const originalProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!originalProject || originalProject.length === 0) {
      return null;
    }

    // Remove unique identifiers and add new storeId
    const { id, created_at, updated_at, ...projectData } = originalProject[0];

    // Create new project with the provided storeId
    const newProject = await db
      .insert(projects)
      .values({
        ...projectData,
        id: uuid(),
        organization_id: orgId,
        user_id: user_id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    if (newProject && newProject.length > 0) {
      return newProject[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function duplicateProject(projectId: any) {
  try {
    const originalProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!originalProject || originalProject.length === 0) {
      return null;
    }

    // Remove unique identifiers and add new storeId
    const { id, created_at, updated_at, ...projectData } = originalProject[0];

    // Create new project with the provided storeId
    const newProject = await db
      .insert(projects)
      .values({
        ...projectData,
        id: uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    if (newProject && newProject.length > 0) {
      return newProject[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProject(projectId: any) {
  try {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, projectId))
      .returning();

    if (result && result.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getOrganizationByUserId(userId: any) {
  try {
    const result = await db
      .select({
        organization: organizations,
      })
      .from(organizations)
      .where(eq(organizations.user_id, userId))
      .limit(1);

    if (!result || result.length === 0) {
      // Create a new organization for the user
      const newOrg = await db
        .insert(organizations)
        .values({
          name: "Default Organization",
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      if (newOrg && newOrg.length > 0) {
        return newOrg[0];
      } else {
        throw new Error("Failed to create organization for user");
      }
    }

    return result[0].organization;
  } catch (error) {
    console.error("Error fetching/creating organization:", error);
    throw error;
  }
}
