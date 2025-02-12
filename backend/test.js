const cloudinary = require("cloudinary").v2;
require("dotenv").config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary Connection
cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg", {
  folder: "test_upload",
  timeout: 12000,
})
.then((result) => {
  console.log("✅ Cloudinary connection successful:", result.secure_url);
})
.catch((error) => {
  console.error("❌ Cloudinary connection failed:", error.message);
});
