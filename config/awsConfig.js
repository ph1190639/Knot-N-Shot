const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require('dotenv');
dotenv.config();
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
});

module.exports = s3;
