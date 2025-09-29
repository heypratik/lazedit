import Editor from "./editor";
import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getOrganizationByUserId } from "@/app/dashboard/actions/project.actions";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  console.log(session);

  if (!session) {
    redirect("/auth");
  }

  const org = await getOrganizationByUserId(session.user.id);

  return <Editor organization={org} userId={session.user.id} />;
}
