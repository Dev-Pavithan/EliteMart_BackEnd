import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js"; 

// Controller to get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find(); 
    console.log("All users retrieved successfully", users);  
    res.status(200).json({
      message: "All users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);  
    next(error);
  }
};

// Controller to get all approved sellers
export const getAllApprovedSellers = async (req, res, next) => {
  try {
    // Fetch only sellers with isApproved set to true
    const sellers = await Seller.find({ isApproved: true });

    if (!sellers || sellers.length === 0) {
      return res.status(404).json({
        message: "No approved sellers found.",
      });
    }

    console.log("Approved sellers retrieved successfully", sellers);
    res.status(200).json({
      message: "All approved sellers retrieved successfully.",
      sellers,
    });
  } catch (error) {
    console.error("Error retrieving approved sellers:", error);
    next(error);
  }
};



export const getSellersByStatus = async (req, res, next) => {
  const { status } = req.params;  // Get the status (approved, pending, or rejected) from URL parameters

  try {
    // Validate status input
    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved', 'pending', or 'rejected'." });
    }

    // Convert status to match field value
    let isApproved;
    if (status === 'approved') {
      isApproved = true;
    } else if (status === 'pending') {
      isApproved = false;
    } else if (status === 'rejected') {
      isApproved = false;  // Assuming rejected sellers also have `isApproved` set to `false`, 
                           // you may adjust based on your schema (if you use a separate `isRejected` field)
    }

    // Fetch sellers with the specified approval status
    const sellers = await Seller.find({ isApproved: isApproved });

    if (!sellers || sellers.length === 0) {
      return res.status(404).json({
        message: `No ${status} sellers found.`,
      });
    }

    console.log(`${status} sellers retrieved successfully`, sellers);
    res.status(200).json({
      message: `${status.charAt(0).toUpperCase() + status.slice(1)} sellers retrieved successfully.`,
      sellers,
    });
  } catch (error) {
    console.error("Error retrieving sellers by status:", error);
    next(error);
  }
};