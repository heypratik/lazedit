import React from "react";
import Dashboard from "./dashboard";
import Error from "./error";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
// Write code to get User from database & see if plan is active

async function getStore(userId) {
  if (!userId) {
    return null;
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/settings/get`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch store");
    }

    const data = await response.json();
    return data.store;
  } catch (error) {
    console.error("Error fetching store:", error);
    return null;
  }
}

async function getMetrics(key) {
  try {
    const res = await fetch(`https://a.klaviyo.com/api/metrics/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        revision: "2024-07-15",
        Authorization: `Klaviyo-API-Key ${key}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch metrics");
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

const now = new Date();
const last30Days = new Date(now.setDate(now.getDate() - 30)).toISOString();

async function getCampaigns(key) {
  try {
    const response = await fetch(
      `https://a.klaviyo.com/api/campaigns?filter=greater-or-equal(created_at,${last30Days})&filter=equals(messages.channel,'email')`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          revision: "2024-07-15",
          Authorization: `Klaviyo-API-Key ${key}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch metrics");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

function filterRecentObjects(objects) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  return objects.filter((obj) => {
    const createdAt = new Date(obj.attributes.created_at);
    return createdAt >= thirtyDaysAgo && createdAt <= now;
  });
}

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }
  const store = await getStore(session?.user?.id);

  if (store.klaviyoKey) {
    try {
      const servermetrics = await getMetrics(store.klaviyoKey);
      const serverCampaigns = await getCampaigns(store.klaviyoKey);
      const filteredCampaigns = filterRecentObjects(serverCampaigns);

      return (
        <>
          <Dashboard
            session={session}
            servermetrics={servermetrics}
            serverCampaigns={filteredCampaigns}
            store={store}
          />
        </>
      );
    } catch (error) {
      return <Error />;
    }
  } else {
    return <Error />;
  }
}

export default Page;
