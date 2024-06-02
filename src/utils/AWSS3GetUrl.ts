import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || " ",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || " ",
  },
});

const bucket_name = process.env.AWS_BUCKET_NAME;

export const getUrl = async (payload: { Key: string; ContentType: string }) => {
  try {
    const params = {
      Bucket: bucket_name,
      ...payload,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(client, command);
    return url;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
