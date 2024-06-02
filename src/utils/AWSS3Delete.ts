import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { client } from "./AWSS3GetUrl";
const bucket_name = process.env.AWS_BUCKET_NAME;

export const deleteObj = async (payload: {
  Key: string;
  ContentType: string;
}) => {
  try {
    const params = {
      Bucket: bucket_name,
      ...payload,
    };
    const command = new DeleteObjectCommand(params);
    await client.send(command);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
