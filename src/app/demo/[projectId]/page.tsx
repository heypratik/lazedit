import EditorProjectIdPage from "@/app/dashboard/[projectId]/editor";

export default async function Page({
    params,
}: {
    params: {
        projectId: string;
    };
}) {

    let org = "da9b1b83-97a7-4e92-b4b5-1ff29342d5f1" // connected to demo account

    return <EditorProjectIdPage organization={org} params={params} />;
}