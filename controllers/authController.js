import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    console.log(`Attempting login with email: ${email}`);

    let account;
    let role;

    // Check if the email exists in the User collection
    account = await User.findOne({ email });
    if (account) {
      console.log(`Email found in User collection`);
      role = "user"; // User role is "user"
    } else {
      // Check if the email exists in the Seller collection
      account = await Seller.findOne({ email });
      if (account) {
        console.log(`Email found in Seller collection`);
        if (!account.isApproved) {
          console.log(`Seller with email ${email} is not approved`);
          return res.status(403).json({ message: "Seller account not approved" });
        }
        role = "seller"; // Seller role is "seller"
      } else {
        console.log(`Email not found in User or Seller collection`);
        return res.status(404).json({ message: "Account not found" });
      }
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(password, account.password);
    if (!isPasswordMatch) {
      console.log(`Invalid password for email: ${email}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log(`Password matched for email: ${email}`);

    // Generate JWT token including user/seller id and role
    const token = jwt.sign(
      { id: account._id, role }, // Use the correct id and role for the account
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    console.log(`JWT token generated for email: ${email}`);

    return res.status(200).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
      token,
      role,
    });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    next(error);
  }
};
