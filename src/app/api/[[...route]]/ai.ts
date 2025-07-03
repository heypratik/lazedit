import { z } from "zod";
import { Hono } from "hono";
// import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { replicate } from "@/lib/replicate";

const app = new Hono()
  .post(
    "/remove-bg",
    // verifyAuth(),
    zValidator(
      "json",
      z.object({
        image: z.string(),
      }),
    ),
    async (c) => {
      const { image } = c.req.valid("json");

      const input = {
        image: image
      };
    
      const output = await replicate.run("cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003", { input });

      // @ts-ignore
      const res = output.url();

      return c.json({ data: res });
    },
  )
  .post(
    "/generate-image",
    // verifyAuth(),
    zValidator(
      "json",
      z.object({
        prompt: z.string(),
      }),
    ),
    async (c) => {
      const { prompt } = c.req.valid("json");

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

      let imgUrl

      for (const [index, item] of Object.entries(output)) {
        console.log(`${index}: ${item}`);
        imgUrl = `${item}`
      }
      
      const res = output as Array<string>;

      return c.json({ data: imgUrl });
    },
  )
  .post(
    "/edit-image",
    // verifyAuth(),
    zValidator(
      "json",
      z.object({
        prompt: z.string(),
        input_image: z.string(),
        output_format: z.enum(["jpg", "png", "webp"]).optional().default("jpg"),
        num_inference_steps: z.number().min(1).max(50).optional().default(30),
      }),
    ),
    async (c) => {
      const { prompt, input_image, output_format, num_inference_steps } = c.req.valid("json");

      const input = {
        prompt: prompt,
        input_image: input_image,
        output_format: output_format,
        num_inference_steps: num_inference_steps
      };
      
      const output = await replicate.run("black-forest-labs/flux-kontext-dev", { input });
      // @ts-ignore
            const res = output.url();

      return c.json({ data: res });
    },
  );

export default app;