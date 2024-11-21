import express from "express";
import { addToCart, updateCart, removeFromCart, getCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/:userId", addToCart);
router.put("/:userId", updateCart);
router.delete("/:userId", removeFromCart);
router.get("/:userId", getCart);

export default router;
