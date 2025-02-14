import { NextResponse } from "next/server";
import Store from "../../../../../../../models/Store";
import Users from "../../../../../../../models/Users";
import Product from "../../../../../../../models/Products";
import { Op } from "sequelize";

function generateStarSvg(rating) {
  const starWidth = 24;
  const starSpacing = 4;
  const totalWidth = (starWidth + starSpacing) * 5;
  const height = starWidth;

  const svgContent = `data:image/svg+xml,${encodeURIComponent(`
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="${totalWidth}" 
      height="${height}" 
      viewBox="0 0 ${totalWidth} ${height}"
    >
      ${Array.from({ length: 5 }, (_, index) => {
        const starFill = Math.max(0, Math.min(1, rating - index));
        const x = index * (starWidth + starSpacing);

        return `
          <defs>
            <linearGradient id="star${index}">
              <stop offset="${starFill * 100}%" style="stop-color:#FFD700"/>
              <stop offset="${starFill * 100}%" style="stop-color:#E5E7EB"/>
            </linearGradient>
          </defs>
          <path
            transform="translate(${x}, 0)"
            d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"
            fill="url(#star${index})"
          />
        `;
      }).join("")}
    </svg>
  `)}`;

  return svgContent;
}

export async function GET(req, { params }) {
  const { slug } = await params;

  const { searchParams } = new URL(req.url);
  const shopifyStoreId = slug[0];
  const page = parseInt(searchParams.get("current_page") || "1");
  const limit = parseInt(searchParams.get("per_page") || "10");

  const allReviews = await fetch(
    `https://mybranz.site/review/list?encrypted=855c1861d6ed27d35e0efd6ae6153016&shop=${shopifyStoreId}&page=${page}&limit=${limit}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );

  const reviews = await allReviews.json();

  const formattedProducts = reviews.reviews.map((review) => ({
    id: review.id,
    name: review.User.name,
    "my-text-1": review.reviewDescription,
    "my-text-2": review.User.name,
    image: generateStarSvg(review.rating),
    "my-text-3": review.reviewTitle,
  }));

  const response = new Response(
    JSON.stringify({
      success: true,
      data: formattedProducts,
      current_page: page,
      per_page: limit,
      from: (page - 1) * limit + 1,
      to: (page - 1) * limit + formattedProducts.length,
      last_page: reviews.pageInfo.hasNextPage ? page + 1 : page,
      total_records: reviews.pageInfo.hasNextPage
        ? limit * page + 9
        : limit * page,
    }),
    { status: 200 }
  );

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

export async function OPTIONS() {
  const response = new Response(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
