import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import crypto from "crypto-js";

const CHUNK_SIZE = 9000; // Maximum profiles per request

const fetchData = async (clusterId, clusterName, storeId) => {
  try {
    let arr = [];
    let currentPage = 1;
    let totalPages = Infinity;

    while (currentPage <= totalPages) {
      const response = await fetch(
        `https://ai.mybranzapi.link/v1/clusterEmails?storeId=${storeId}&clusterId=${clusterId}&page=${currentPage}&perPage=500`
      );
      const data = await response.json();
      totalPages = data.pagination.total_pages;
      arr.push(...data.data);
      currentPage = data.pagination.currentPage + 1;
      totalPages = data.pagination.totalPages;
    }

    return arr;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Helper function to chunk array into smaller pieces
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Helper function to format profile data for Klaviyo
const formatProfileData = (emailObj) => {
  try {
    const tags = JSON.parse(emailObj.tags);

    return {
      type: "profile",
      attributes: {
        email: emailObj.email,
        phone_number: emailObj.phone,
        first_name: emailObj.displayName?.split(" ")[0] || "",
        last_name: emailObj.displayName?.split(" ").slice(1).join(" ") || "",
        location: {
          address1: emailObj.defaultAddress?.address1 || "",
          city: emailObj.defaultAddress?.city || "",
          country: emailObj.defaultAddress?.country || "",
          region: emailObj.defaultAddress?.province || "",
          zip: emailObj.defaultAddress?.provinceCode || "",
          timezone: emailObj.defaultAddress?.timeZone || "",
        },
        properties: {
          gender: emailObj.gender || "",
          tags: tags,
        },
      },
    };
  } catch (error) {
    console.error("Error formatting profile:", error);
    // Return basic profile if there's an error parsing additional data
    return {
      type: "profile",
      attributes: {
        email: emailObj.email,
      },
    };
  }
};

const createList = async (apiKey, clusterName) => {
  const response = await fetch("https://a.klaviyo.com/api/lists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      revision: "2025-01-15",
    },
    body: JSON.stringify({
      data: {
        type: "list",
        attributes: {
          name: clusterName,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.data.id;
};

const importProfilesToList = async (apiKey, profiles, listId) => {
  const response = await fetch(
    "https://a.klaviyo.com/api/profile-bulk-import-jobs",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        revision: "2025-01-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile-bulk-import-job",
          attributes: {
            profiles: {
              data: profiles,
            },
          },
          relationships: {
            lists: {
              data: [
                {
                  type: "list",
                  id: listId,
                },
              ],
            },
          },
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
};

export async function POST(req) {
  const { clusterId, clusterName, storeId } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const authHeader = req.headers.get("Authorization");
  const authNonce = req.headers.get("Xauth");
  const token = authHeader;

  const bytes = crypto.AES.decrypt(token, process.env.NEXT_PUBLIC_SECRET);
  const decryptedText = bytes.toString(crypto.enc.Utf8);
  const [receivedNonce, apiKey] = decryptedText.split(":");

  if (receivedNonce !== authNonce) {
    return res
      .status(400)
      .json({ message: "Nonce mismatch or replay detected" });
  }

  try {
    // Fetch and find selected cluster
    const profileData = await fetchData(clusterId, clusterName, storeId);

    // Create a new list
    const listId = await createList(apiKey, clusterName);

    // Format all profiles
    const formattedProfiles = profileData.map(formatProfileData);

    // Split profiles into chunks
    const profileChunks = chunkArray(formattedProfiles, CHUNK_SIZE);

    // Process each chunk
    const importResults = [];
    for (const chunk of profileChunks) {
      const result = await importProfilesToList(apiKey, chunk, listId);
      importResults.push(result);
    }

    return new Response(
      JSON.stringify({
        success: true,
        listId,
        totalProfiles: profileData.length,
        chunks: importResults.length,
        importResults,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
