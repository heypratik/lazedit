import { NextResponse } from "next/server";
import Store from "../../../../../../../models/Store";
import Users from "../../../../../../../models/Users";
import Product from "../../../../../../../models/Products";
import { Op } from "sequelize";

export async function GET(req, { params }) {
  const { slug } = await params;

  const { searchParams } = new URL(req.url);
  const userId = slug[0]; // Default to 3 if not provided
  const page = parseInt(searchParams.get("current_page") || "1");
  const limit = parseInt(searchParams.get("per_page") || "10");
  const search = searchParams.get("search") || "";

  // Based on userId find store

  const store = await Store.findOne({
    where: {
      userId,
    },
  });

  const user = await Users.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  if (user?.shopifyStoreId && user?.shopifyStoreId !== "") {
    const res = await fetch(
      `https://mybranz-emails-c6d36ebadf33.herokuapp.com/product/list?shop=${user?.shopifyStoreId}&limit=${limit}&pageNumber=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    //   {
    //     "id": 3942,
    //     "storeId": 43,
    //     "shopifyId": "8994208809242",
    //     "title": "“POSHA” ASH BLONDE GLUE LESS UNIT 26”",
    //     "description": "RAW VIETNAMESE SINGLE DONOR BLONDE POV: THIS UNIT IS NOT AVAILABLE ON HAND FOR IMMEDIATE SHIPPING OR STORE PICKUP. THERES A PROCESSING TIME FRAME OF 1-3 WEEKS AFTER ORDER IS PLACED AND CONFIRMED. NOTE, WEEKENDS AND HOLIDAYS ARE NOT INCLUDED. THANK YOU FOR YOUR BUSINESS. ; Raw Vietnamese Single Donor Bundles LENGTH: 26” (layered ) LACE; HD 6x6 Glue less DENSITY; (400g Bundles)COLOR; Ombré Ash BlondeSTYLE; Bouncy Body Waves LayeredCAP SIZE; Medium 22-22.5Custom Machine Made Dome Mesh Cap..Can be bleach and re-colored. CAN BE MADE IN DIFFERENT SIZES ( Small 21) ( Medium 22, 22-5) ( Large 23) ( X-Large 24)",
    //     "totalInventory": 0,
    //     "totalVariants": 1,
    //     "status": "ACTIVE",
    //     "productType": "",
    //     "priceRangeV2": {
    //         "maxVariantPrice": {
    //             "amount": "1299.0",
    //             "currencyCode": "USD"
    //         },
    //         "minVariantPrice": {
    //             "amount": "1299.0",
    //             "currencyCode": "USD"
    //         }
    //     },
    //     "featuredImage": {
    //         "url": "https://cdn.shopify.com/s/files/1/0780/3361/7178/files/2287FD4B-B2FC-461F-BD49-5C8B6F355315.jpg?v=1718220783"
    //     },
    //     "onlineStoreUrl": "https://yellowtagbyvike.com/products/bebe-ash-blonde-glue-less-unit-26",
    //     "onlineStorePreviewUrl": "https://yellowtagbyvike.com/products/bebe-ash-blonde-glue-less-unit-26"
    // },

    const formattedProducts = data.data.map((product) => ({
      id: product.id,
      name: product.title,
      description: product.description,
      url: product.onlineStoreUrl,
      img_url:
        product?.featuredImage?.url ||
        "https://g-wezvrmxxcg9.vusercontent.net/placeholder.svg",
      product_feed_id: "DFF",
      price_with_vat: product.priceRangeV2.minVariantPrice.amount,
      currency: product.priceRangeV2.minVariantPrice.currencyCode,
    }));

    const response = new Response(
      JSON.stringify({
        success: true,
        data: formattedProducts,
        current_page: page,
        per_page: limit,
        from: (page - 1) * limit + 1, //
        to: (page - 1) * limit + data.data.length,
        last_page: data.last_page,
        total_records: data.total_records,
      }),
      { status: 200 }
    );

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    console.log(response);

    return response;
  }

  const storeId = store.id;

  // Base query options
  let queryOptions = {
    where: {
      storeId,
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
    offset: (page - 1) * limit,
    limit: limit, // Limit to the number of products per page
    order: [["id", "ASC"]], // Order by 'id' ASC for basic pagination
  };

  // Fetch products for the store with pagination and search
  let products = await Product.findAll(queryOptions);

  if (!products.length) {
    return NextResponse.json({ error: "No products found" }, { status: 404 });
  }

  // Map over products to format the response similar to Shopify
  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    url: product.link,
    img_url:
      product.image || "https://g-wezvrmxxcg9.vusercontent.net/placeholder.svg",
    product_feed_id: "DFF",
    price_with_vat: product.price.toString(),
    currency: "USD",
  }));

  // Pagination logic
  const totalProducts = await Product.count({
    where: {
      storeId,
    },
  });

  const totalPages = Math.ceil(totalProducts / limit);

  // Construct response with CORS headers
  const response = new Response(
    JSON.stringify({
      success: true,
      data: formattedProducts,
      current_page: page,
      per_page: limit,
      from: (page - 1) * limit + 1, //
      to: (page - 1) * limit + products.length,
      last_page: totalPages,
      total_records: totalProducts,
    }),
    { status: 200 }
  );

  // Add CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  const response = new Response(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
