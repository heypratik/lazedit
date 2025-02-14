import React from "react";
import Calendar from "./calendar";
import Error from "./error";
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
  // console.log("user", user);
  // console.log("store", store);
  // console.log("plan", plan);
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

  let planName = plan.planName;

  if (!planName) {
    if (plan.plan.amount / 100 < 300) {
      planName = "Essential";
    } else {
      planName = "Engage";
    }
  }

  console.log("PLANNAME", planName);

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
          planType: planName,
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
    throw new Error("Error fetching events");
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

  try {
    const user = await getUser(session?.user?.id);
    const store = await getStore(session?.user?.id ? session.user.id : null);
    const plan = await getPlan(user);

    console.log("PLANSSS", plan.plan);
    const eventss = await getEvents(user, store, plan);

    console.log("EVENTSSS", eventss);

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
  } catch (error) {
    console.error("Error fetching data:", error);
    return <Error />;
  }
}

export default Page;
