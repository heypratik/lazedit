"use server";

import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Image } from "../../models";
import next from "next";

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

export const uploadFile = async (file, fileName, mimetype, organization_id) => {
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Body: file,
    Key: `${organization_id}/${fileName}`,
    ContentType: mimetype,
  };

  return s3.send(new PutObjectCommand(uploadParams));
};

export const getSignedUrlCf = async (
  url,
  organization_id,
  expirationOption
) => {
  let expirationTime; // Duration in milliseconds

  // Determine expiration time based on the selected option
  switch (expirationOption) {
    case "10min":
      expirationTime = 10 * 60 * 1000; // 10 minutes
      break;
    case "10years":
      expirationTime = 10 * 365 * 24 * 60 * 60 * 1000; // 10 years
      break;
    default:
      throw new Error("Invalid expiration option. Use '10min' or '10years'.");
  }

  const signedUrl = await getSignedUrl({
    url: `https://d1kw46qh6t9dlp.cloudfront.net/${organization_id}/${url}`,
    dateLessThan: new Date(Date.now() + expirationTime), // Set expiration time dynamically
    privateKey: process.env.NEXT_PRIVATE_KEY,
    keyPairId: process.env.NEXT_KEY_PAIR_ID, // KEY PAID ID NOT ATTACHED TO RIGHT CLOUDFRONT FXI TI
  });

  return signedUrl;
};

export const listAllImages = async (
  bucketName,
  prefix = "",
  continuationToken = null
) => {
  try {
    let isTruncated = true;
    const allImages = [];

    const params = {
      Bucket: bucketName,
      MaxKeys: 100,
      Prefix: `${prefix}/`, // Optional: Specify folder path if needed
      ContinuationToken: continuationToken,
    };

    const data = await s3.send(new ListObjectsV2Command(params));

    if (data.Contents) {
      allImages.push(...data.Contents);
    }

    isTruncated = data.IsTruncated;
    continuationToken = data.NextContinuationToken;

    allImages.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    );

    return {
      images: allImages.map((image) => image.Key.split("/")[1]),
      nextToken: continuationToken,
    };
  } catch (err) {
    console.error("Error fetching images:", err);
    throw err;
  }
};

export const generateSignedUrls = async (
  keys,
  organization_id,
  expirationOption
) => {
  return Promise.all(
    keys.map((key) => getSignedUrlCf(key, organization_id, expirationOption))
  );
};

// Usage
export async function getImages(organization_id, continuationToken) {
  if (!organization_id) {
    throw new Error("Organization ID is required.");
  }
  const bucketName = process.env.BUCKET_NAME;
  const expirationOption = "10years";

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
