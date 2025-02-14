import axios from "axios";

const SHOPIFY_SHOP =
  "04f876638f71345fb1844c3a8245c9f206bc5fbb23a547fbf8a67e5f90b88f1931e487b44ab3f432e118379db9911ae4";
// const BASE_URL = `https://admin.shopify.com/store/${SHOPIFY_SHOP}/apps/content-calendar-1/`;
const BASE_URL = `https://mybranz-emails-c6d36ebadf33.herokuapp.com/`;

export const fetchStoreSettings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}settingInfo`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending reviews:", error);
    throw error;
  }
};

export const fetchFromDB = async (
  storeId,
  cursor = null,
  direction = "next",
  limit = 10
) => {
  // Create the request payload to match your API structure
  const body = {
    storeId,
    limit,
    cursor,
    direction,
  };

  // API call to your paginated products endpoint
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/product/get-products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  // Check if the response is successful
  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.error, status: response.status };
  }

  // Parse the response data
  const data = await response.json();

  // Check if there are products returned
  if (!data.products || !data.products.length) {
    return { error: "No products found", status: 404 };
  }

  // Return the products and the new cursor information for pagination
  return data;
};

export const fetchFromDBCu = async (
  storeId,
  page = 1,
  limit = 10,
  search = ""
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/product/get-products-cu`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storeId, page, limit, search }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};

export const fetchProducts = async (
  shopifyStoreId,
  cursor = null,
  direction = "next",
  searchQuery = ""
) => {
  try {
    let url = `https://mybranz-emails-c6d36ebadf33.herokuapp.com/app/products?shop=${shopifyStoreId}`;
    // Append cursor and direction to the request URL for pagination
    if (cursor && direction === "next") {
      url += `&endCursor=${cursor}`;
    } else if (cursor && direction === "previous") {
      url += `&startCursor=${cursor}`;
    }

    // Append search query to the URL if it exists
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};

export const fetchAssetsList = async (
  shopifyStoreId,
  cursor = null,
  direction = "next",
  search = ""
) => {
  try {
    let url = `https://mybranz-emails-c6d36ebadf33.herokuapp.com/file/list?shop=${shopifyStoreId}&search=${search}`;

    // Append cursor and direction to the request URL for pagination
    if (cursor && direction === "next") {
      url += `&endCursor=${cursor}`;
    } else if (cursor && direction === "previous") {
      url += `&startCursor=${cursor}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching assets list:", error);
    throw error;
  }
};
