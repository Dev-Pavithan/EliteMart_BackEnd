// middleware/uploadMiddleware.js
import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export { upload };
