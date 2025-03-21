const cloudinary = require("cloudinary").v2;
const AWS = require("aws-sdk");


cloudinary.config({
  cloud_name: "my_cloud_name",
  api_key: "my_key",
  api_secret: "my_secret",
});

const s3 = new AWS.S3({
  endpoint: "https://s3.us-east-005.backblazeb2.com", // Replace with your endpoint
  accessKeyId: "0052d4ccb11af9a0000000002", // Replace with your Key ID
  secretAccessKey: "K0055ckqWqwbGzaa0eKeBlCyxp2gR8I", // Replace with your Application Key
  region: "us-west-001", // Replace with your region
  s3ForcePathStyle: true, // Required for Backblaze B2
});

class FileHandler {
  async uploadFile(file) {
    const fileType = this.getFileType(file.mimetype);
    if (fileType === "image" || fileType === "video") {
      return await this.uploadToCloudinary(file);
    } else if (fileType === "document") {
      return await this.uploadFileToBackblaze(file);
    } else {
      throw new Error("Invalid file type");
    }
  }

  getFileType(mimetype) {
    if (mimetype.startsWith("image/")) {
      return "image";
    } else if (mimetype.startsWith("video/")) {
      return "video";
    } else {
      return "document";
    }
  }

  // Upload Images and Videos to Cloudinary
  async uploadToCloudinary(file) {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    try {
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });
      return result.secure_url;
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  // Upload Documents to Firebase
  async uploadFileToBackblaze(file, bucketName = "hospitaldbms") {
    const params = {
      Bucket: bucketName, // Name of your bucket
      Key: `${Date.now()}_${file.originalname}`, // Unique file name
      Body: file.buffer, // File data (from Multer or similar)
      ContentType: file.mimetype, // MIME type of the file
    };

    try {
      const data = await s3.upload(params).promise();
      console.log("File uploaded successfully:", data.Location);
      return data.Location; // URL of the uploaded file
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
}

module.exports = FileHandler;


// K005Mmc + PBDMK + vdQGfcbYj3pe9 + zXI;
