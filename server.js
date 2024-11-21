import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from './routes/authRoutes.js'
import bodyParser from "body-parser";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import cartRoutes from "./routes/cartRoutes.js";
import { cloudinary } from "./config/cloudinary.js"; 
import { authorizeAdmin } from "./middleware/authorizeRole.js";  
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 



// Middleware
app.use(express.json());

// Routes
app.use("/api", authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", orderRoutes);




// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
