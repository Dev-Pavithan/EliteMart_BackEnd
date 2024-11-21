import mongoose from "mongoose";
import { generateUniqueId } from "../utils/idGenerator.js";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      default: () => generateUniqueId("ORDER"),
    },
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
