import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { images } from "@/db/schema";
import { ilike, desc, count, eq, and } from "drizzle-orm";
import { getSignedUrlCf } from "@/lib/s3";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getOrganizationByUserId } from "@/app/dashboard/actions/project.actions";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get organization for the user
  const organization = await getOrganizationByUserId(session.user.id);

  if (!organization) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || ""; // Search term for `filename`
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 results per page

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [eq(images.organization_id, organization.id)];
    if (search) {
      whereConditions.push(ilike(images.filename, `%${search}%`));
    }

    // Fetch the data with Drizzle
    const [imageResults, totalResult] = await Promise.all([
      db
        .select()
        .from(images)
        .where(and(...whereConditions))
        .orderBy(desc(images.created_at))
        .limit(limit)
        .offset(offset),

      db
        .select({ count: count() })
        .from(images)
        .where(and(...whereConditions)),
    ]);

    const total = totalResult[0].count;

    // Generate signed URLs for each image
    const imagesWithSignedUrls = await Promise.all(
      imageResults.map(async (image) => {
        const signedUrl = await getSignedUrlCf(
          image.mediaObjectKey,
          organization.id,
          "10years" // Set your desired expiration option here
        );
        return {
          ...image, // Drizzle already returns plain objects
          signedUrl, // Attach the signed URL
        };
      })
    );

    return NextResponse.json({
      data: imagesWithSignedUrls,
      pagination: {
        total, // Total number of images
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching images." },
      { status: 500 }
    );
  }
}
