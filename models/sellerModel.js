import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sellerSchema = new mongoose.Schema({
  sellerId: { type: String, unique: true, required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  bankDetails: { type: String, required: true },
  idProof: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isApproved: { type: Boolean, default: false },
  password: { type: String, required: true },
  role: { type: String, default: 'seller' },
  createdAt: { type: Date, default: Date.now },
});

// Hash the password before saving
sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare the entered password with the stored hashed password
sellerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Seller", sellerSchema);
