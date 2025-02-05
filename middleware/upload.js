const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/awsConfig"); // Import your configured S3 client
const dotenv = require('dotenv');
dotenv.config();

const uploadFileToS3 = async (file) => {
  const fileKey = `${Date.now()}_${file.originalname}`; // Unique file name

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME, // Use environment variable for bucket name
    Key: fileKey, // The name the file will have in S3
    Body: file.buffer, // The file data
    ContentType: file.mimetype, // Content type (image/jpeg, video/mp4, etc.)
    
  };

  try {
    await s3.send(new PutObjectCommand(params));

    // Construct the public URL of the uploaded file
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return { fileUrl, fileKey }; // Return URL & key
  } catch (error) {
    console.error("Error uploading to S3", error);
    throw new Error("File upload failed");
  }
};



const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory for AWS S3 upload
const upload = multer({ storage });

module.exports = {upload, uploadFileToS3};
