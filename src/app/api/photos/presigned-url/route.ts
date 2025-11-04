import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const s3Url = searchParams.get("url");

    if (!s3Url) {
      return NextResponse.json(
        { error: "Missing url parameter" },
        { status: 400 },
      );
    }

    // Parse the S3 URL to extract bucket and key
    // Format: https://bucket-name.s3.amazonaws.com/path/to/file.png
    const urlPattern = /https:\/\/([^.]+)\.s3\.amazonaws\.com\/(.+)/;
    const match = s3Url.match(urlPattern);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid S3 URL format" },
        { status: 400 },
      );
    }

    const [, bucket, key] = match;

    // Generate presigned URL for GET access
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: decodeURIComponent(key),
    });

    // URL expires in 1 hour (3600 seconds)
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return NextResponse.json({ presignedUrl });
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 },
    );
  }
}
