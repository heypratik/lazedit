import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { images } from "@/db/schema";
import { ilike, desc, count, eq, and } from "drizzle-orm";
import { getSignedUrlCf } from "@/lib/s3";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// http://localhost:3000/api/admin/user/get-images?organization=8&search=l&page=2&limit=5

export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("organization");
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);


  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (orgId == 3) {
    session = {
      user: {
        id: "Lg4EgP1v6wRoRggFo2Hb0Ot2cob3rJxF",
        email: "demo@gmail.com",
        name: "Demo",
      },
    }
  }

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    if (!orgId) {
      return NextResponse.json(
        { error: "orgId query parameter is required" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    const whereConditions = [eq(images.organization_id, parseInt(orgId)), eq(images.user_id, session.user.id)];
    if (search) {
      whereConditions.push(ilike(images.filename, `%${search}%`));
    }

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

    const imagesWithSignedUrls = await Promise.all(
      imageResults.map(async (image) => {
        const signedUrl = await getSignedUrlCf(
          image.mediaObjectKey,
          orgId,
          "10years"
        );
        return {
          ...image,
          signedUrl,
        };
      })
    );

    return NextResponse.json({
      data: imagesWithSignedUrls,
      pagination: {
        total,
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
