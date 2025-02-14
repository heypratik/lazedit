import { NextResponse } from "next/server";
import Store from "../../../../../../models/Store";
import Product from "../../../../../../models/Products";
import { Op } from "sequelize";

export async function POST(req, { params }) {
  const { slug } = await params;

  // Bulk Upload Products for a Store
  if (slug.length === 1 && slug[0] === "bulk-upload-products") {
    const { storeId, products } = await req.json();

    // Check if the store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Loop through each product and create or update them
    const createdProducts = [];
    for (const productData of products) {
      const { name, description, price, image, link, sku, active } =
        productData;

      const existingProduct = await Product.findOne({
        where: { name, storeId },
      });

      if (existingProduct) {
        // Update existing product
        const updatedProduct = await existingProduct.update({
          name,
          description,
          price,
          image,
          link,
          active,
        });
        createdProducts.push(updatedProduct);
      } else {
        // Create new product
        const newProduct = await Product.create({
          storeId,
          name,
          description,
          price,
          image,
          link,
          sku,
          active,
        });
        createdProducts.push(newProduct);
      }
    }

    return NextResponse.json(
      { message: "Products uploaded successfully", products: createdProducts },
      { status: 201 }
    );
  }

  // Update a Specific Product by ID
  if (slug.length === 2 && slug[0] === "update-product") {
    const productId = slug[1];
    const productUpdates = await req.json();

    // Find the product by ID
    const product = await Product.findByPk(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update the product with new values
    const updatedProduct = await product.update(productUpdates);

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  }

  // Get Paginated Products for a Store
  if (slug.length === 1 && slug[0] === "get-products") {
    const {
      storeId,
      cursor = null,
      direction = "next",
      limit = 10,
    } = await req.json();

    // Base query options
    let queryOptions = {
      where: { storeId },
      limit: limit + 1, // Fetch one extra to determine if there's a next/previous page
      order: [["id", direction === "next" ? "ASC" : "DESC"]], // Order by 'id'
    };

    // If a cursor is provided, decode it and fetch products after/before the cursor based on direction
    if (cursor) {
      let decodedCursor;

      try {
        const decodedBuffer = Buffer.from(cursor, "base64");
        decodedCursor = JSON.parse(decodedBuffer.toString());
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid cursor provided" },
          { status: 400 }
        );
      }

      const lastId = decodedCursor.last_id;

      if (typeof lastId === "number") {
        queryOptions.where.id =
          direction === "next"
            ? { [Op.gt]: lastId } // Fetch products with id > cursor for 'next'
            : { [Op.lt]: lastId }; // Fetch products with id < cursor for 'previous'
      } else {
        return NextResponse.json(
          { error: "Invalid cursor format" },
          { status: 400 }
        );
      }
    }

    // Fetch paginated products for the store
    let products = await Product.findAll(queryOptions);

    // Check if we have a next/previous page
    const hasMore = products.length > limit;

    if (hasMore) {
      products =
        direction === "next" ? products.slice(0, -1) : products.slice(1);
    }

    if (!products.length) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    // Map over products to format the response similar to Shopify
    const formattedProducts = products.map((product) => ({
      node: {
        id: product.id,
        title: product.name,
        featuredImage: {
          url:
            product.image ||
            "https://g-wezvrmxxcg9.vusercontent.net/placeholder.svg", // Default image if not available
        },
        description: product.description,
        productType: product.sku, // Assuming 'sku' can be treated as product type
        onlineStoreUrl: product.link,
        onlineStorePreviewUrl: product.link,
        priceRangeV2: {
          minVariantPrice: {
            amount: product.price.toString(),
            currencyCode: "USD", // Assuming currency is USD
          },
          maxVariantPrice: {
            amount: product.price.toString(),
            currencyCode: "USD",
          },
        },
        totalInventory: 100, // Assuming a static inventory count or you can add this to the model
        totalVariants: 1, // Assuming one variant per product; adjust if needed
        status: product.active ? "ACTIVE" : "INACTIVE",
        images: {
          edges: [
            {
              node: {
                url:
                  product.image ||
                  "https://g-wezvrmxxcg9.vusercontent.net/placeholder.svg",
                width: 1000, // Assuming fixed dimensions or fetch dynamically
                height: 1250,
              },
            },
          ],
        },
      },
    }));

    // Pagination logic
    const startCursor = products.length ? products[0].id : null;
    const endCursor = products.length ? products[products.length - 1].id : null;

    // Determine hasNextPage and hasPreviousPage
    const hasNextPage = direction === "next" && hasMore;
    const hasPreviousPage = direction === "previous" && hasMore;

    return NextResponse.json(
      {
        products: formattedProducts,
        pageInfo: {
          hasPreviousPage,
          hasNextPage,
          startCursor: startCursor
            ? Buffer.from(`{"last_id":${startCursor}}`).toString("base64")
            : null,
          endCursor: endCursor
            ? Buffer.from(`{"last_id":${endCursor}}`).toString("base64")
            : null,
        },
      },
      { status: 200 }
    );
  }

  if (slug.length === 1 && slug[0] === "get-products-cu") {
    const { storeId, page = 1, limit = 10, search = "" } = await req.json();

    // Base query options
    let queryOptions = {
      where: {
        storeId,
        name: {
          [Op.like]: `%${search}%`, // Search by product name
        },
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
      node: {
        id: product.id,
        title: product.name,
        featuredImage: {
          url:
            product.image ||
            "https://g-wezvrmxxcg9.vusercontent.net/placeholder.svg", // Default image if not available
        },
        description: product.description,
        productType: product.sku, // Assuming 'sku' can be treated as product type
        onlineStoreUrl: product.link,
        onlineStorePreviewUrl: product.link,
        priceRangeV2: {
          minVariantPrice: {
            amount: product.price.toString(),
            currencyCode: "USD", // Assuming currency is USD
          },
          maxVariantPrice: {
            amount: product.price.toString(),
            currencyCode: "USD",
          },
        },
        totalInventory: 100, // Assuming a static inventory count or you can add this to the model
        totalVariants: 1, // Assuming one variant per product; adjust if needed
        status: product.active ? "ACTIVE" : "INACTIVE",
        images: {
          edges: [
            {
              node: {
                url:
                  product.image ||
                  "https://g-wezvrmxxcg9.vusercontent.net/placeholder.svg",
                width: 1000, // Assuming fixed dimensions or fetch dynamically
                height: 1250,
              },
            },
          ],
        },
      },
    }));

    // Pagination logic
    const totalProducts = await Product.count({
      where: {
        storeId,
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json(
      {
        products: formattedProducts,
        pageInfo: {
          currentPage: page,
          totalPages: totalPages,
        },
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
}
