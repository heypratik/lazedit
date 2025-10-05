import { NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";

export const dynamic = "force-dynamic";
export const fetchCache = 'default-no-store';

export async function POST(request) {
  try {
    const { prompt, input_image, output_format = "jpg", num_inference_steps = 30 } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt in request." },
        { status: 400 }
      );
    }

    if (!input_image) {
      return NextResponse.json(
        { error: "Missing input_image in request." },
        { status: 400 }
      );
    }

    // Validate output_format
    if (!["jpg", "png", "webp"].includes(output_format)) {
      return NextResponse.json(
        { error: "Invalid output_format. Must be jpg, png, or webp." },
        { status: 400 }
      );
    }

    // Validate num_inference_steps
    if (num_inference_steps < 1 || num_inference_steps > 50) {
      return NextResponse.json(
        { error: "num_inference_steps must be between 1 and 50." },
        { status: 400 }
      );
    }

    const input = {
      prompt: prompt,
      input_image: input_image,
      output_format: output_format,
      num_inference_steps: num_inference_steps
    };

    const output = await replicate.run("black-forest-labs/flux-kontext-dev", { input });
    // @ts-ignore
    const res = output.url();

    return NextResponse.json({ data: res });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while editing image." },
      { status: 500 }
    );
  }
}
