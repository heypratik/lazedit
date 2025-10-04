import React from "react";
import Billing from "./billing";
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

function constructUserBilling(userObj) {
  let obj = {};
  const {
    stripeCustomerId = null,
    stripePlanEndsAt = null,
    email = null,
    id = null,
    updated_at = null,
    created_at = null,
    name = null,
  } = userObj;

  obj = {
    stripeCustomerId: stripeCustomerId,
    stripePlanEndsAt: stripePlanEndsAt,
    // isActiveUser: new Date(stripePlanEndsAt).getTime() > Date.now(),
    isActiveUser: false,
    email: email,
    id: id,
    updated_at: updated_at,
    created_at: created_at,
    name: name,
  };

  return obj;
}

async function Page() {
  const session = null
  if (!session) {
    redirect("/auth");
  }

  return <Billing session={session} user={null} />;
}

export default Page;