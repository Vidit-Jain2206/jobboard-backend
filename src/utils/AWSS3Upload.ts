import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import { client } from "./AWSS3GetUrl";

const bucket_name = process.env.AWS_BUCKET_NAME;
export const uploadOnS3 = async (payload: {
  Key: string;
  Body: Buffer;
  ContentType: string;
}) => {
  try {
    const params = {
      Bucket: bucket_name,
      ...payload,
    };

    const command = new PutObjectCommand(params);
    await client.send(command);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
