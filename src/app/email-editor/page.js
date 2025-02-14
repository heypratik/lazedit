import React from "react";
import Dashboard from "./editor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
// Write code to get User from database & see if plan is active

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

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }
  const store = await getStore(session?.user?.id);
  const user = await getUser(session?.user?.id);


  return (
    <>
      <Dashboard session={session} store={store} user={user} />
    </>
  );
}

export default Page;
