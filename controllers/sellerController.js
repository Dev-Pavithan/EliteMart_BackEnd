import Seller from "../models/sellerModel.js";
import { generateUniqueId } from "../utils/idGenerator.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register a new seller
export const registerSeller = async (req, res, next) => {
  try {
    const { businessName, businessType, bankDetails, idProof, password, email, role } = req.body;

    if (!password) {
      console.log("Password is missing");
      return res.status(400).json({ message: "Password is required" });
    }
    if (!email) {
      console.log("Email is missing");
      return res.status(400).json({ message: "Email is required" });
    }

    const sellerRole = role || 'seller'; 
    console.log(`Role set to: ${sellerRole}`);

    const emailExists = await Seller.findOne({ email });
    if (emailExists) {
      console.log(`Email ${email} is already in use`);
      return res.status(400).json({ message: "Email is already in use" });
    }

    console.log(`Email ${email} is available, generating unique sellerId`);

    let sellerId = generateUniqueId("SELLER");

    let sellerExists = await Seller.findOne({ sellerId });

    while (sellerExists) {
      sellerId = generateUniqueId("SELLER");
      sellerExists = await Seller.findOne({ sellerId });
      console.log(`Generated new sellerId: ${sellerId}`);
    }

    console.log(`Unique sellerId generated: ${sellerId}`);

    const newSeller = await Seller.create({
      sellerId,
      businessName,
      businessType,
      bankDetails,
      idProof,
      email,
      password, 
      role: sellerRole,
    });

    console.log(`New seller created with sellerId: ${newSeller.sellerId}`);

    res.status(201).json({
      message: "Seller registered. Await admin approval.",
      newSeller,
    });
  } catch (error) {
    console.error(`Error during seller registration: ${error.message}`);
    next(error);
  }
};



// Approve a seller by sellerId
export const approveSeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    console.log(`Attempting to approve seller with sellerId: ${sellerId}`);

    const updatedSeller = await Seller.findOneAndUpdate(
      { sellerId },
      { isApproved: true },
      { new: true }
    );

    if (!updatedSeller) {
      console.log(`Seller with sellerId ${sellerId} not found`);
      return res.status(404).json({ message: "Seller not found" });
    }

    console.log(`Seller with sellerId ${sellerId} approved successfully`);

    res.status(200).json({
      message: "Seller approved successfully",
      updatedSeller,
    });
  } catch (error) {
    console.error(`Error during seller approval: ${error.message}`);
    next(error);
  }
};


// Reject a seller by sellerId
export const rejectSeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    console.log(`Attempting to reject seller with sellerId: ${sellerId}`);

    const updatedSeller = await Seller.findOneAndUpdate(
      { sellerId },
      { isApproved: false }, // Set isApproved to false, or you can use a separate rejection field
      { new: true }
    );

    if (!updatedSeller) {
      console.log(`Seller with sellerId ${sellerId} not found`);
      return res.status(404).json({ message: "Seller not found" });
    }

    console.log(`Seller with sellerId ${sellerId} rejected successfully`);

    res.status(200).json({
      message: "Seller rejected successfully",
      updatedSeller,
    });
  } catch (error) {
    console.error(`Error during seller rejection: ${error.message}`);
    next(error);
  }
};

// Get seller by email
export const getSellerByEmail = async (req, res, next) => {
  const { email } = req.params; 

  try {
    const seller = await Seller.findOne({ email }); 

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" }); 
    }

    res.status(200).json(seller);
  } catch (error) {
    next(error); 
  }
};
