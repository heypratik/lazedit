import { NextResponse } from "next/server";
import Project from "../../../../../../models/Projects";

export async function PATCH(request) {
  try {
    const { id, json, width, height } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing project id in request." },
        { status: 400 }
      );
    }

    const updateProject = await Project.update(
      { json, width, height },
      { where: { id } }
    );

    if (!updateProject) {
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
