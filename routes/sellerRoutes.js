import express from "express";
import { registerSeller, approveSeller, getSellerByEmail,rejectSeller } from "../controllers/sellerController.js";

const router = express.Router();

router.post("/register", registerSeller);

router.patch("/approve/:sellerId", approveSeller);

router.put("/reject/:sellerId", rejectSeller);

router.get("/email/:email", getSellerByEmail);


export default router;
