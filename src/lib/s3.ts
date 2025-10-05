"use server";

import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  PutObjectCommandOutput,
  ListObjectsV2CommandOutput,
  _Object,
} from "@aws-sdk/client-s3";

// Type definitions
interface UploadFileParams {
  file: Buffer | Uint8Array | string;
  fileName: string;
  mimetype: string;
  organization_id: string;
}

interface SignedUrlParams {
  url: string;
  organization_id: string;
  expirationOption: "10min" | "10years";
}

interface ListImagesParams {
  bucketName: string;
  prefix?: string;
  continuationToken?: string | null;
}

interface ListImagesResult {
  images: string[];
  nextToken: string | null;
}

interface GetImagesResult {
  signedUrls: string[];
  nextToken: string | null;
}

const s3 = new S3Client({
  region: process.env.BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export const uploadFile = async (
  file: Buffer | Uint8Array | string,
  fileName: string,
  mimetype: string,
  organization_id: string
): Promise<PutObjectCommandOutput> => {
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME!,
    Body: file,
    Key: `${organization_id}/${fileName}`,
    ContentType: mimetype,
  };

  return s3.send(new PutObjectCommand(uploadParams));
};

export const getSignedUrlCf = async (
  url: string,
  organization_id: string,
  expirationOption: "10min" | "10years"
): Promise<string> => {
  let expirationTime;

  switch (expirationOption) {
    case "10min":
      expirationTime = 10 * 60 * 1000;
      break;
    case "10years":
      expirationTime = 10 * 365 * 24 * 60 * 60 * 1000;
      break;
    default:
      throw new Error("Invalid expiration option. Use '10min' or '10years'.");
  }

  const signedUrl = await getSignedUrl({
    url: `https://d1kw46qh6t9dlp.cloudfront.net/${organization_id}/${url}`,
    dateLessThan: new Date(Date.now() + expirationTime).toISOString(),
    privateKey: process.env.NEXT_PRIVATE_KEY!,
    keyPairId: process.env.NEXT_KEY_PAIR_ID!,
  });

  return signedUrl;
};

export const listAllImages = async (
  bucketName: string,
  prefix: string = "",
  continuationToken: string | null = null
): Promise<ListImagesResult> => {
  try {
    let isTruncated = true;
    const allImages: _Object[] = [];

    const params = {
      Bucket: bucketName,
      MaxKeys: 100,
      Prefix: `${prefix}/`,
      ContinuationToken: continuationToken || undefined,
    };

    const data = await s3.send(new ListObjectsV2Command(params));

    if (data.Contents) {
      allImages.push(...data.Contents);
    }

    isTruncated = data.IsTruncated || false;
    continuationToken = data.NextContinuationToken || null;

    allImages.sort(
      (a, b) => new Date(b.LastModified!).getTime() - new Date(a.LastModified!).getTime()
    );

    return {
      images: allImages.map((image) => image.Key!.split("/")[1]),
      nextToken: continuationToken,
    };
  } catch (err) {
    console.error("Error fetching images:", err);
    throw err;
  }
};

export const generateSignedUrls = async (
  keys: string[],
  organization_id: string,
  expirationOption: "10min" | "10years"
): Promise<string[]> => {
  return Promise.all(
    keys.map((key) => getSignedUrlCf(key, organization_id, expirationOption))
  );
};

// Usage
export async function getImages(
  organization_id: string,
  continuationToken?: string | null
): Promise<GetImagesResult | []> {
  if (!organization_id) {
    throw new Error("Organization ID is required.");
  }
  const bucketName = process.env.BUCKET_NAME!;
  const expirationOption: "10years" = "10years";

  try {
    const keys = await listAllImages(
      bucketName,
      organization_id,
      continuationToken
    );
    const signedUrls = await generateSignedUrls(
      keys.images,
      organization_id,
      expirationOption
    );
    return { signedUrls, nextToken: keys.nextToken || null };
  } catch (err) {
    console.error("Error fetching images:", err);
    return [];
  }
}
