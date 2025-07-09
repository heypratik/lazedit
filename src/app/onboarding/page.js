import Onboarding from "./onboarding";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getOrganizationByUserId } from "./actions/onboarding";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  const organization = await getOrganizationByUserId(session?.user?.id);

  return <Onboarding session={session} organization={organization} />;
}
