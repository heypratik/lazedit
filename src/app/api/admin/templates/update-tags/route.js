// src/app/api/templates/delete/route.js

import { NextResponse } from "next/server";
import Templates from "../../../../../../models/Templates";

export async function POST(request) {
  try {
    const { templateId, brandTags, campaignTypeTags, industryTags } =
      await request.json();

    // Check if templateId is provided
    if (!templateId) {
      return NextResponse.json(
        { message: "Template ID is required." },
        { status: 400 }
      );
    }

    // Update the template with the new tags
    const updatedTemplate = await Templates.update(
      {
        brandTags: brandTags,
        campaignTypeTag: campaignTypeTags,
        industryTags: industryTags,
      },
      {
        where: { id: templateId },
      }
    );

    return NextResponse.json({
      message: "Template Updated successfully.",
      status: 200,
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json({
      message: "An error occurred while updating the template.",
      status: 500,
    });
  }
}
