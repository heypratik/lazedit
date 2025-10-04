import { uploadFile } from "@/lib/s3";
import { db } from "@/db/drizzle";
import {images} from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401 }
    );
  }

  const arrayBuffer = await req.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);
  const fileName = (() => {
    const originalFileName = req.headers
      .get("File-Name")
      ?.replace(/\s+/g, "-")
      .toLowerCase();
    if (!originalFileName) return uuidv4();

    const [name, extension] = originalFileName.split(".");
    if (!extension) return `${name}-${uuidv4()}`;

    return `${name}-${uuidv4()}.${extension}`;
  })();

  const fileNameForDb = (() => {
    const originalFileName = req.headers
      .get("File-Name")
      ?.replace(/\s+/g, "-")
      .toLowerCase();
    if (!originalFileName) return uuidv4();

    const [name, extension] = originalFileName.split(".");
    if (!extension) return `${name}`;

    return `${name}.${extension}`;
  })();

  const mimetype = req.headers.get("mimetype");
  const organizationId = req.headers.get("organizationId");

  try {
    const result = await uploadFile(
      fileBuffer,
      fileName,
      mimetype,
      organizationId
    );
    if (result) {
      const [image] = await db.insert(images).values({
        user_id: session.user.id,
        organization_id: 1,
        filename: fileNameForDb,
        mediaObjectKey: fileName,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning();
    }

    return new Response(
      JSON.stringify({ success: true, data: { objectKey: fileName } }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading the image:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
