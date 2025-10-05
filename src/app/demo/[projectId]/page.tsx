import EditorProjectIdPage from "@/app/dashboard/[projectId]/editor";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getOrganizationByUserId } from "@/app/dashboard/actions/project.actions";

export default async function Page({
    params,
}: {
    params: {
        projectId: string;
    };
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth");
    }

    let org = await getOrganizationByUserId(session?.user?.id);

    return <EditorProjectIdPage organization={org} params={params} />;
}
