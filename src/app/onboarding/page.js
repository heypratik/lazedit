import Onboarding from "./onboarding";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getStoreByUserId } from "./actions/onboarding";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  const store = await getStoreByUserId(session?.user?.id);

  return <Onboarding session={session} store={store} />;
}
