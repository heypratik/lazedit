import { NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export const dynamic = "force-dynamic";
export const fetchCache = 'default-no-store';

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt in request." },
        { status: 400 }
      );
    }

    const input = {
      cfg: 3.5,
      steps: 28,
      prompt: prompt,
      aspect_ratio: "3:2",
      output_format: "webp",
      output_quality: 90,
      negative_prompt: "",
      prompt_strength: 0.85
    };

    const output = await replicate.run("stability-ai/stable-diffusion-3", { input });

    let imgUrl;

    for (const [index, item] of Object.entries(output)) {
      console.log(`${index}: ${item}`);
      imgUrl = `${item}`;
    }

    return NextResponse.json({ data: imgUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while generating image." },
      { status: 500 }
    );
  }
}
