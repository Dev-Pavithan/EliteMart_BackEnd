import express from "express";
import multer from "multer";
import { registerUser, updateUser,getUserByEmail } from "../controllers/userController.js";

const upload = multer({ dest: "uploads/" }); 
const router = express.Router();

router.post("/register", upload.single("profilePicture"), registerUser);
router.patch("/:userId", updateUser);
router.get("/email/:email", getUserByEmail);








export default router;
