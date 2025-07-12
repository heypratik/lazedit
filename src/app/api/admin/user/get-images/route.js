import { NextResponse } from "next/server";
import { Op } from "sequelize";
const { Image } = require("../../../../../../models");
import { getSignedUrlCf } from "../../../../../lib/s3";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // http://localhost:3000/api/admin/user/get-images?organization=8&search=l&page=2&limit=5
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("organization");
    const search = searchParams.get("search") || ""; // Search term for `filename`
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 results per page

    if (!orgId) {
      return NextResponse.json(
        { error: "orgId query parameter is required" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Fetch the data with Sequelize
    const { rows: images, count: total } = await Image.findAndCountAll({
      where: {
        organization_id: orgId,
        filename: {
          [Op.like]: `%${search}%`,
        },
      },
      limit,
      offset,
      order: [["created_at", "DESC"]], // Order by creation date (most recent first)
    });

    // Generate signed URLs for each image
    const imagesWithSignedUrls = await Promise.all(
      images.map(async (image) => {
        const signedUrl = await getSignedUrlCf(
          image.mediaObjectKey,
          orgId,
          "10years" // Set your desired expiration option here
        );
        return {
          ...image.toJSON(), // Convert Sequelize model instance to plain object
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
