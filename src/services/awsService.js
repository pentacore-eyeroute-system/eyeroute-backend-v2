import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import config from '../config/env.js';

const AWS_ACCESS_KEY_ID = config.s3.accessKeyId;
const AWS_SECRET_ACCESS_KEY = config.s3.secretAccessKey;
const S3_BUCKET_REGION = config.s3.s3BucketRegion;
const S3_BUCKET_NAME = config.s3.s3BucketName;
const SES_FROM_EMAIL = config.ses.sesFromEmail;

const s3 = new S3Client({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    region: S3_BUCKET_REGION,
});

const sesClient = new SESClient({
    region: S3_BUCKET_REGION
});

export class AwsService {
    async uploadProfilePic(file) {
        const folderName = 'profile-pictures';
        const extension = file.mimetype.split('/')[1];
        const fileKey = `${folderName}/${uuidv4()}.${extension}`;
        
        const uploadParameters = {
            Bucket: S3_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(uploadParameters);

        await s3.send(command);

        return { fileKey };
    }

    async getProfilePicUrl(fileKey) {
        const bucketParameters = {
            Bucket: S3_BUCKET_NAME,
            Key: fileKey,
        };

        const command = new GetObjectCommand(bucketParameters);

        const url = await getSignedUrl(s3, command, { expiresIn: 604800 });

        return url;
    };

    async getNewsPic(fileKey) {
        const bucketParameters = {
            Bucket: S3_BUCKET_NAME,
            Key: fileKey,
        };

        const command = new GetObjectCommand(bucketParameters);

        const url = await getSignedUrl(s3, command, { expiresIn: 60 * 10 });

        return url;
    };

    async getGalleryPic(fileKey) {
        const bucketParameters = {
            Bucket: S3_BUCKET_NAME,
            Key: fileKey,
        };

        const command = new GetObjectCommand(bucketParameters);

        const url = await getSignedUrl(s3, command, { expiresIn: 60 * 10 });

        return url;
    }; 

    async sendEmail(to, subject, body) {
        const command = new SendEmailCommand({
            Source: `EyeRoute <${SES_FROM_EMAIL}>`,
            Destination: { ToAddresses: [to] },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: "UTF-8"
                },
                Body: {
                    Text: {
                        Data: body,
                        Charset: "UTF-8"
                    }
                }
            }
        });

        return await sesClient.send(command);
    };

    async iotQrCodeExists(fileKey) {
        const bucketParameters = {
            Bucket: S3_BUCKET_NAME,
            Key: fileKey,
        };

        const command = new HeadObjectCommand(bucketParameters);

        try {
            await s3.send(command);

            return true;
        } catch (err) {
            if (err.$metadata?.httpStatusCode === 404) {
                return false;
            }

            throw err;
        }
    };

    async uploadIotQrCode(fileKey, buffer, mimetype) {       
        const uploadParameters = {
            Bucket: S3_BUCKET_NAME,
            Key: fileKey,
            Body: buffer,
            ContentType: mimetype,
        };

        const command = new PutObjectCommand(uploadParameters);

        await s3.send(command);
    };
}