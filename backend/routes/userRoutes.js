import express from "express";
import { signupUser, loginUser, setPin, verifyPin } from "../controllers/userController.js";
import {auth} from "../middleware/auth.js";

const router = express.Router();

//Route 1 : Signup
router.post("/signup", signupUser);

//Route 2 : Login
router.post("/login", loginUser);

//Route 3 : Set up pin : Authentication required
router.patch("/set-pin", auth, setPin);

//Route 4 : verify pin : Authentication required
router.post("/verify-pin", auth, verifyPin );

export default router;
