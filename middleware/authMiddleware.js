import jwt from "jsonwebtoken"; // Ensure jwt is imported
import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token

      console.log("Decoded Token:", decoded); // Log the decoded token for debugging

      // Check if the user is a seller or a user and attach the correct data to `req.user`
      if (decoded.role === "user") {
        const user = await User.findById(decoded.id); // Fetch user by decoded id
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        req.user = user; // Attach the user to the request object
      } else if (decoded.role === "seller") {
        const seller = await Seller.findById(decoded.id); // Fetch seller by decoded id
        if (!seller) {
          return res.status(404).json({ message: "Seller not found" });
        }
        req.user = seller; // Attach the seller to the request object
      } else {
        return res.status(401).json({ message: "Invalid role in token" });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Token is not valid" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};


// Middleware to restrict access to admins only
export const verifyAdmin = (req, res, next) => {
  const { role } = req.user; 
  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied, not an admin" });
  }
  next(); 
};
