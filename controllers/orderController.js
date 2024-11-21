import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";
import Order from "../models/orderModel.js";

// Create a new order and notify seller
export const createOrder = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid order details" });
    }

    // Fetch the product details
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient product quantity available" });
    }

    // Fetch the seller details (optional, to notify the seller)
    const seller = await Seller.findOne({ sellerId: product.sellerId });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Reduce product quantity
    product.quantity -= quantity;
    await product.save();

    // Create the order
    const newOrder = new Order({
      userId,
      productId,
      sellerId: product.sellerId,
      quantity,
      totalPrice,
    });

    await newOrder.save();

    // Simulate sending a message to the seller
    const message = {
      to: seller.email,
      subject: "New Order Notification",
      body: `You have received a new order. 
      Product ID: ${product.productId}
      Description: ${product.description}
      Category: ${product.category}
      Price: $${product.price}
      Quantity Ordered: ${quantity}
      Total Order Price: $${totalPrice}
      `,
    };

    // Replace this with actual email service
    console.log("Message sent to seller:", message);

    res.status(201).json({
      message: "Order placed successfully, seller notified.",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};













// Get orders for a seller
export const getSellerOrders = async (req, res) => {
    try {
      const { sellerId } = req.params;
  
      // Find all orders related to the seller
      const orders = await Order.find({ sellerId });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this seller." });
      }
  
      // Fetch product details for each order
      const ordersWithProductDetails = await Promise.all(
        orders.map(async (order) => {
          const product = await Product.findOne({ productId: order.productId });
          return {
            orderId: order.orderId,
            productId: order.productId,
            productName: product?.description || "Product not found",
            category: product?.category || "Unknown",
            image: product?.image || null,
            price: product?.price || 0,
            quantity: order.quantity,
            totalPrice: order.totalPrice,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
          };
        })
      );
  
      res.status(200).json({
        message: "Orders retrieved successfully.",
        orders: ordersWithProductDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };





// Get all orders for admin
export const getAllUserOrders = async (req, res) => {
    try {
      // Fetch all orders in the system
      const orders = await Order.find().populate("userId");  // Optionally populate user details, if needed
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found." });
      }
  
      // Fetch product details for each order
      const ordersWithProductDetails = await Promise.all(
        orders.map(async (order) => {
          const product = await Product.findOne({ productId: order.productId });
          return {
            orderId: order.orderId,
            userId: order.userId,
            productId: order.productId,
            productName: product?.description || "Product not found",
            category: product?.category || "Unknown",
            image: product?.image || null,
            price: product?.price || 0,
            quantity: order.quantity,
            totalPrice: order.totalPrice,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
          };
        })
      );
  
      res.status(200).json({
        message: "Orders retrieved successfully.",
        orders: ordersWithProductDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };




  // Update order status for admin
export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;  // Get orderId from the route params
    const { orderStatus } = req.body; // Get the new status from the request body
  
    // List of allowed order statuses
    const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  
    // Check if the provided order status is valid
    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: "Invalid order status. Valid statuses are: Pending, Processing, Shipped, Delivered, Cancelled.",
      });
    }
  
    try {
      // Find the order by its ID
      const order = await Order.findOne({ orderId });
  
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }
  
      // Update the order status
      order.orderStatus = orderStatus;
      await order.save();
  
      // Send response back to the admin
      res.status(200).json({
        message: `Order status updated to ${orderStatus}.`,
        order: {
          orderId: order.orderId,
          orderStatus: order.orderStatus,
          updatedAt: order.updatedAt,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };



  // Get all orders for a specific user by userId
  export const getAllOrdersByUserId = async (req, res) => {
    const { userId } = req.params;  // Get userId from request parameters
  
    try {
      // Fetch all orders for the given userId
      const orders = await Order.find({ userId });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: `No orders found for user with ID: ${userId}` });
      }
  
      // Return orders along with their details
      res.status(200).json({
        message: "Orders retrieved successfully.",
        orders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  