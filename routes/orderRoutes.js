import express from "express";
import { protect } from "../middleware/authMiddleware.js"; 

import { createOrder,
    getSellerOrders,
    getAllUserOrders,
    updateOrderStatus,
    getAllOrdersByUserId,

 } from "../controllers/orderController.js";

const router = express.Router();

// Route to create an order
router.post("/orders", createOrder);

// Route to get seller orders
router.get("/orders/seller/:sellerId", getSellerOrders);

// Route to get all orders for admin
router.get("/orders/admin", protect, getAllUserOrders);

// Route to update order status for admin
router.put("/orders/admin/:orderId/status", protect, updateOrderStatus);

// Route to get all orders for a user by userId
router.get("/orders/:userId", protect, getAllOrdersByUserId);


export default router;
