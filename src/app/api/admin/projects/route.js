import { NextResponse } from "next/server";
import { db } from "../../../../db/drizzle";
import { projects } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-no-store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId in request." },
        { status: 400 }
      );
    }

    // Fetch the project using Drizzle
    const projectResults = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (projectResults.length === 0) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const project = projectResults[0];

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching project." },
      { status: 500 }
    );
  }
}
