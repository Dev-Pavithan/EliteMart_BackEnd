import User from "../models/userModel.js";
import { generateUniqueId } from "../utils/idGenerator.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";  

// Register a new user
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, bio, address } = req.body;
    const userId = generateUniqueId("USER");

    let profilePictureUrl = null;

    // Handle image upload if provided
    if (req.files && req.files.profilePicture) {
      const result = await cloudinary.v2.uploader.upload(req.files.profilePicture.tempFilePath, {
        folder: "user_profiles", 
      });
      profilePictureUrl = result.secure_url; 
    }

    const newUser = await User.create({
      userId,
      name,
      email,
      password,
      phone,
      bio,
      address,
      profilePicture: profilePictureUrl,
    });

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    next(error);
  }
};


// Update user profile
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    let profilePictureUrl = updates.profilePicture;

    if (req.files && req.files.profilePicture) {
      const result = await cloudinary.v2.uploader.upload(req.files.profilePicture.tempFilePath, {
        folder: "user_profiles", 
      });
      profilePictureUrl = result.secure_url; 
    }

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt); 
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { ...updates, profilePicture: profilePictureUrl },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    next(error); 
  }
};

// Get user by email
export const getUserByEmail = async (req, res, next) => {
  const { email } = req.params; 

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" }); 
    }

    res.status(200).json(user); 
  } catch (error) {
    next(error); 
  }
};
