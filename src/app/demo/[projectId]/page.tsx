import EditorProjectIdPage from "@/app/dashboard/[projectId]/editor";

export default async function Page({
    params,
}: {
    params: {
        projectId: string;
    };
}) {

    let org = {
        id: 3,
        name: 'Default Organization',
        user_id: 'Lg4EgP1v6wRoRggFo2Hb0Ot2cob3rJxF',
        created_at: '2025 - 10-04T11: 39: 23.316Z',
        updated_at: '2025 - 10-04T11: 39: 23.316Z'
    }

    return <EditorProjectIdPage organization={org} params={params} />;
}