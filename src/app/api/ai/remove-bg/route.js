import { NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";

export const dynamic = "force-dynamic";
export const fetchCache = 'default-no-store';

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Missing image in request." },
        { status: 400 }
      );
    }

    const input = {
      image: image
    };

    const output = await replicate.run("cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003", { input });

    // @ts-ignore
    const res = output.url();

    return NextResponse.json({ data: res });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while removing background." },
      { status: 500 }
    );
  }
}
