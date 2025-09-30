import { NextResponse } from "next/server";
import { db } from "../../../../../db/drizzle";
import { projects } from "../../../../../db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request) {
  try {
    const { id, json, width, height } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing project id in request." },
        { status: 400 }
      );
    }

    // Update the project using Drizzle
    const updateResult = await db
      .update(projects)
      .set({ json, width, height })
      .where(eq(projects.id, id))
      .returning();

    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Project updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
