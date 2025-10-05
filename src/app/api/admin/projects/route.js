import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const fetchCache = 'default-no-store'


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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
