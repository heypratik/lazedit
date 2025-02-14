import { NextResponse } from "next/server";
import { Op } from "sequelize";
import Templates from "../../../../../../models/Templates";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "";

    // Decode the sortBy parameter first
    const decodedSortBy = decodeURIComponent(sortBy);

    // Parse the decoded string into an array of tags
    const tags = decodedSortBy.split(",").filter((tag) => tag.trim() !== "");

    // Pagination offset
    const offset = (page - 1) * limit;

    // Build the query for filtering templates
    const where = {};

    if (tags.length) {
      where[Op.or] = [
        { brandTags: { [Op.overlap]: tags } },
        { campaignTypeTag: { [Op.overlap]: tags } },
        { industryTags: { [Op.overlap]: tags } },
      ];
    }

    if (search) {
      where[Op.or] = [
        ...(where[Op.or] || []),
        { brandTags: { [Op.contains]: [search] } },
        { campaignTypeTag: { [Op.contains]: [search] } },
        { industryTags: { [Op.contains]: [search] } },
      ];
    }

    // Fetch all tags from the database
    const allTemplates = await Templates.findAll({
      attributes: ["brandTags", "campaignTypeTag", "industryTags"],
    });

    // Extract unique tags for each category
    const brandTags = Array.from(
      new Set(allTemplates.flatMap((template) => template.brandTags || []))
    );
    const campaignTypeTags = Array.from(
      new Set(
        allTemplates.flatMap((template) => template.campaignTypeTag || [])
      )
    );
    const industryTags = Array.from(
      new Set(allTemplates.flatMap((template) => template.industryTags || []))
    );

    // Fetch paginated templates
    const paginatedTemplates = await Templates.findAndCountAll({
      where,
      limit,
      offset,
    });

    // Format templates with combined tags
    const formattedTemplates = paginatedTemplates.rows.map((template) => ({
      ...template.toJSON(),
      tags: [
        ...(template.brandTags || []),
        ...(template.campaignTypeTag || []),
        ...(template.industryTags || []),
      ],
    }));

    // Return the tags and paginated templates
    return NextResponse.json(
      {
        brandTags,
        campaignTypeTags,
        industryTags,
        total: paginatedTemplates.count,
        page,
        limit,
        totalPages: Math.ceil(paginatedTemplates.count / limit),
        templates: formattedTemplates,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching templates." },
      { status: 500 }
    );
  }
}
