// test-upload.js
import cloudinary from './config/cloudinary.js'; // Import Cloudinary config
import fs from 'fs';  // To read a test image file

// Test Cloudinary upload directly
const uploadImage = async () => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'products' },  // Set the folder for uploads
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return;
        }
        console.log('Cloudinary upload result:', result); // Log the result on successful upload
      }
    );

    // Use an image from local directory to test (adjust path accordingly)
    const filePath = './test-images/Phone.jpeg';  // Replace with actual image path
    const fileBuffer = fs.readFileSync(filePath);  // Read the image file into a buffer

    result.end(fileBuffer);  // End the stream and upload the image buffer
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

// Run the test upload function
uploadImage();
