import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { IS3Dao } from "../interfaces/IS3Dao";

const BUCKET = "lukescs340tweeterprofilepictures";
const REGION = "us-east-1";

const client = new S3Client({ region: REGION });

export class S3Dao implements IS3Dao {
    async putImage(fileName: string, imageStringBase64: string): Promise<string> {
        const decodedImageBuffer = Buffer.from(imageStringBase64, "base64");

        const params = {
            Bucket: BUCKET,
            Key: "image/" + fileName,
            Body: decodedImageBuffer,
            ContentType: "image/png",
            ACL: ObjectCannedACL.public_read
        };

        try {
            await client.send(new PutObjectCommand(params));
            return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
        } catch (error) {
            throw new Error("S3 put image failed with: " + error);
        }
    }
}