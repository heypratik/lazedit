import React from "react";
import Calendar from "./calendar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust path as needed
import { redirect } from "next/navigation";

async function getUser(userId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/auth/get-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      }
    );

    const data = await response.json();

    return data.user;
  } catch (error) {
    console.error(error);
  } finally {
  }
}

async function getStore(userId) {
  if (!userId) {
    return null;
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/settings/get`,
    {
      method: "POST",
      body: JSON.stringify({ userId }),
    }
  );
  const data = await response.json();
  return data.store;
}

async function getEvents(user, store, plan) {
  let storeID = null;
  if (
    user.shopifyStoreId !== null &&
    user.shopifyStoreId !== "" &&
    user.shopifyStoreId !== undefined
  ) {
    storeID = user.shopifyStoreId;
  } else {
    storeID = store.id;
  }

  try {
    const response = await fetch(
      `https://dev.mybranzapi.link/v1/get_calendar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Added this to specify the expected response type
        },
        body: JSON.stringify({
          country: store.location ? store.location : "USA",
          year: `${new Date().getFullYear()}-${new Date().toLocaleString(
            "default",
            { month: "short" }
          )}`,
          planType: `${plan.planName}`,
          storeId: String(storeID),
        }),
      }
    );

    // Check for errors in the response
    if (!response.ok) {
      throw new Error(`Error! Status: ${response.status}`);
    }

    const data = await response.json();
    const campaignArray = Object.values(data)[0];
    return Object.values(campaignArray)[0];
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

async function getPlan(user) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/user/get-plan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch plan");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching plan data:", error);
  }
}

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }

  const user = await getUser(session?.user?.id);
  const store = await getStore(session?.user?.id ? session.user.id : null);
  const plan = await getPlan(user);
  // const eventss = await getEvents(user, store, plan);
  const eventss = [
    {
      "Campaign Type": "Sale Start",
      Date: "2025-01-01",
      Description:
        "Start the new year with exceptional savings on our premium collection",
      "Example Content":
        "New Year, New Deals! Kickstart 2025 with exclusive offers",
      "Strategy Title": "January Kickoff Sale",
      Type: "Promotional",
    },
    {
      "Campaign Type": "Weekend Special",
      Date: "2025-01-11",
      Description: "Weekend-exclusive deals to brighten your January",
      "Example Content":
        "Your weekend just got better! Shop special weekend-only deals",
      "Strategy Title": "Weekend Wonder Sale",
      Type: "Promotional",
    },
    {
      "Campaign Type": "Mid-week Flash",
      Date: "2025-01-15",
      Description: "24-hour flash sale to boost mid-week engagement",
      "Example Content": "Mid-week pick-me-up! Flash deals for 24 hours only",
      "Strategy Title": "Wednesday Flash Sale",
      Type: "Promotional",
    },
    {
      "Campaign Type": "Value Campaign",
      Date: "2025-01-18",
      Description: "Highlighting product quality and customer benefits",
      "Example Content":
        "Quality meets value - Discover why customers choose us",
      "Strategy Title": "Value Spotlight Week",
      Type: "Brand Building",
    },
    {
      "Campaign Type": "Payday Sale",
      Date: "2025-01-25",
      Description: "Special offers aligned with monthly payday",
      "Example Content":
        "Payday treats await! Reward yourself with our exclusive deals",
      "Strategy Title": "Payday Rewards",
      Type: "Promotional",
    },
    {
      "Campaign Type": "Month End",
      Date: "2025-01-31",
      Description: "Final chance for January savings",
      "Example Content": "Last call for January deals! Don't miss out",
      "Strategy Title": "January Finale Sale",
      Type: "Promotional",
    },
  ];

  return (
    <>
      <Calendar
        session={session}
        store={store}
        eventss={eventss}
        user={user}
        plan={plan}
      />
    </>
  );
}

export default Page;
