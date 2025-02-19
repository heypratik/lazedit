import Editor from "./editor"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

async function getStore(userId: any) {
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

export default async function Page() {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  const store = await getStore(session?.user?.id);
  
  return (
    <Editor store={store}/>
  );
}
