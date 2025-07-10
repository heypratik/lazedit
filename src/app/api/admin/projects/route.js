import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
const { Project } = require("../../../../../models");

export const dynamic = "force-dynamic";

export async function GET(request) {
  // const session = await getServerSession(request, authOptions);

  // console.log(session);
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId in request." },
        { status: 400 }
      );
    }

    const project = await Project.findByPk(projectId);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching images." },
      { status: 500 }
    );
  }
}
