import { NextResponse } from "next/server";
import { Op } from "sequelize";
import Image from "../../../../../../models/Image"; // Adjust the path if your models are stored elsewhere.
import { getSignedUrlCf } from "../../../../../lib/s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Store from "../../../../../../models/Store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  //   const session = await getServerSession(authOptions);

  const session = {
    user: {
      id: 38,
      name: "Admin",
      email: "sellercentre@charmingvogue.info",
      shopifyStoreId:
        "07fe17be21a59e331f5ef679dc3a62018001e3f9afd3c90b94e9c8daa0fd1d917b4d0b0c49b3092cb232cc0b86668247a76a89c77d50731360f73bcfa2690df3",
      stripeCustomerId: "cus_RlClFpGarH2Kk9 ",
      stripePlanEndsAt: null,
      userType: null,
      onboarded: true,
      settingsCompleted: true,
      created_at: "2024-11-06T23:13:47.058Z",
      updated_at: "2024-12-22T09:15:57.268Z",
    },
  };

  // Find Store
  const store = await Store.findOne({
    where: { userId: session.user.id },
  });

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || ""; // Search term for `filename`
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 results per page

    const offset = (page - 1) * limit;

    // Fetch the data with Sequelize
    const { rows: images, count: total } = await Image.findAndCountAll({
      where: {
        storeId: store.id,
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
          store.id,
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

  return NextResponse.json({ message: session });
}

// export async function GET(request) {
//   // http://localhost:3000/api/admin/user/get-all-images?storeId=8&search=l&page=2&limit=5
//   try {
//     const { searchParams } = new URL(request.url);
//     // const storeId = searchParams.get("storeId");
//     const search = searchParams.get("search") || ""; // Search term for `filename`
//     const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
//     const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 results per page

//     if (!storeId) {
//       return NextResponse.json(
//         { error: "storeId query parameter is required" },
//         { status: 400 }
//       );
//     }

//     const offset = (page - 1) * limit;

//     // Fetch the data with Sequelize
//     const { rows: images, count: total } = await Image.findAndCountAll({
//       where: {
//         storeId,
//         filename: {
//           [Op.like]: `%${search}%`,
//         },
//       },
//       limit,
//       offset,
//       order: [["created_at", "DESC"]], // Order by creation date (most recent first)
//     });

//     // Generate signed URLs for each image
//     const imagesWithSignedUrls = await Promise.all(
//       images.map(async (image) => {
//         const signedUrl = await getSignedUrlCf(
//           image.mediaObjectKey,
//           storeId,
//           "10years" // Set your desired expiration option here
//         );
//         return {
//           ...image.toJSON(), // Convert Sequelize model instance to plain object
//           signedUrl, // Attach the signed URL
//         };
//       })
//     );

//     return NextResponse.json({
//       data: imagesWithSignedUrls,
//       pagination: {
//         total, // Total number of images
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "An error occurred while fetching images." },
//       { status: 500 }
//     );
//   }
// }
