import dotenv from 'dotenv';

// Load default .env if present
dotenv.config();
dotenv.config({ path: 'env' });

export default {
    port : process.env.PORT || 3000,
    db: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    },
    cognito: {
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        clientId: process.env.COGNITO_CLIENT_ID,
    },
    s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        s3BucketRegion: process.env.S3_BUCKET_REGION,
        s3BucketName: process.env.S3_BUCKET_NAME,
    },
    email: {
        emailAddress: process.env.EYEROUTE_EMAIL_ADDRESS,
        emailPassword: process.env.EYEROUTE_EMAIL_PASSWORD,
    },
    iot: {
        xApiKey: process.env.IOT_X_API_KEY,
    },
}