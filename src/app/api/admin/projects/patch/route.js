import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export async function PATCH(request) {
  try {
    const { id, json, width, height } = await request.json();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Missing project id in request." },
        { status: 400 }
      );
    }

    // Validate JSON if provided
    if (json !== undefined && json !== null) {
      try {
        JSON.parse(json);
      } catch (parseError) {
        return NextResponse.json(
          { error: "Invalid JSON format." },
          { status: 400 }
        );
      }
    }

    // Prepare update data - only include fields that are provided
    const updateData = {};
    if (json !== undefined) updateData.json = json;
    if (width !== undefined) updateData.width = width;
    if (height !== undefined) updateData.height = height;

    // Update the project using Drizzle
    const updateResult = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Project updated successfully",
      data: updateResult[0]
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
