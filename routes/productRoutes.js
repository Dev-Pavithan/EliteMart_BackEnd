import express from "express";

import {
    createProduct,
    getProductsBySellerId,
    updateProduct,
    deleteProduct,
    approveRejectProduct,
    getAllProducts,
    getAllApprovedProducts,
    getPackagesByCategory,
    getProductById
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/category/:category", protect, getPackagesByCategory);



// Seller routes
router.post("/create", protect, createProduct);
router.get("/seller/:sellerId/products", getProductsBySellerId);
router.patch("/:productId", protect, updateProduct);
router.delete("/:productId", protect, deleteProduct);

// Admin routes
router.get("/admin", protect, getAllProducts);
router.patch("/admin/:productId", protect, approveRejectProduct);

// User routes (can only view approved products)
router.get("/approved", getAllApprovedProducts);

// Get product by productId
router.get("/:productId", getProductById);


export default router;
