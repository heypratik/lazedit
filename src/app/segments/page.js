import React from "react";
import Segments from "./table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { createDecipheriv } from "crypto";

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

function decryptString(encryptedString) {
  const decipher = createDecipheriv(
    "aes-256-cbc",
    "2b7fac7fd69c14428852bc6ee54530a0",
    Buffer.alloc(16)
  );
  let decrypted = decipher.update(encryptedString, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return JSON.parse(decrypted);
}

async function Page() {
  const session = await getServerSession(authOptions);
  let storeId = 0;
  const store = await getStore(session?.user?.id);

  if (!session) {
    redirect("/auth");
  }

  if (session?.user?.shopifyStoreId == null) {
    storeId = store.id;
  } else {
    storeId = decryptString(session.user.shopifyStoreId).id;
  }

  return (
    <>
      <Segments session={session} storeId={storeId} store={store} />
    </>
  );
}

export default Page;
