import {getImages} from "../../../lib/s3";
export async function POST(req, res) {

    const ress = await getImages();

    return new Response(JSON.stringify(ress), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}