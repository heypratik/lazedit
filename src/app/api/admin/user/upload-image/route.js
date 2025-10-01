import { uploadFile } from "../../../../../lib/s3";
import { db } from "../../../../../db/drizzle";
import { images } from "../../../../../db/schema";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";

import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(req) {
  // const session = await getServerSession(req, authOptions);
  // console.log(session, "SESSION STARTED");
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
  // const userId = req.headers.get("userId");

  try {
    const result = await uploadFile(
      fileBuffer,
      fileName,
      mimetype,
      organizationId
    );
    if (result) {
      const [image] = await db.insert(images).values({
        user_id: "QRcdVFtdWIhMYNyTt2q9xCGc5upFoQa9", // You may want to get this from session/auth
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
