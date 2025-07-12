import { uploadFile } from "../../../../../lib/s3";
const { Image } = require("../../../../../../models");
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";

import { v4 as uuidv4 } from "uuid";

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
      const image = await Image.create({
        user_id: 1,
        organization_id: organizationId,
        filename: fileNameForDb,
        mediaObjectKey: fileName,
      });
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
