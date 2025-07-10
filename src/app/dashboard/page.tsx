import Editor from "./editor"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getOrganizationByUserId } from "@/app/onboarding/actions/onboarding";

export default async function Page() {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  const org = await getOrganizationByUserId(session.user.id);
  
  return (
    <Editor organization={org} userId={session.user.id}/>
  );
}
