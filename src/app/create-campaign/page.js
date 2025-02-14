import React from "react";
import EmailBuildingWrapper from "../email-building/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust path as needed
import { redirect } from "next/navigation";

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

async function getCurrentCampaign(userId) {
  if (!userId) {
    return null;
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/calendar/getcurrentcampaign`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ userId }),
    }
  );

  const data = await response.json();

  if (data.error) {
    return null;
  }

  return data;
}

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }
  const currentCampaign = await getCurrentCampaign(
    session?.user?.id ? session.user.id : null
  );
  const store = await getStore(session?.user?.id ? session.user.id : null);

  const campaign = currentCampaign?.store?.startCreateCampaign || null;

  return (
    <>
      <EmailBuildingWrapper
        session={session}
        store={store}
        campaign={campaign}
      />
    </>
  );
}

export default Page;
