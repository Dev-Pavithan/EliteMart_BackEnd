import express from "express";
import { protect } from "../middleware/authMiddleware.js"; 
import { getAllUsers, getAllApprovedSellers,getSellersByStatus } from "../controllers/adminController.js";

const router = express.Router();

// Admin routes with protection middleware
router.get("/users", protect, getAllUsers);
router.get("/approved-sellers", protect, getAllApprovedSellers); 
router.get("/sellers/:status", protect, getSellersByStatus);


export default router;
