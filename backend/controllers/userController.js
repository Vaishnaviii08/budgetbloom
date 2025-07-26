import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

//Controller function to signup user
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    //Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    //Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      passwordHash,
    });
    await newUser.save();

    //Generate JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    //Response
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error : ", error.message);
    res.status(500).json({ message: "Servor error please try again later" });
  }
};

//Contoller function to login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    //Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (!existingUser) {
      return res.status(401).json({ message: "User dosen't exists." });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    //Generate JWT
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET
    );

    //Return response
    res.status(200).json({
      message: "Login successfull",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error("Login error : ", error.message);
    res.status(500).json({ message: "Servor error please try again later" });
  }
};

//Controller function to set pin
export const setPin = async (req, res) => {
  try {
    const { pin } = req.body;

    // Validate pin format (must be exactly 4 digits)
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits." });
    }

    // Hash the PIN
    const saltRounds = 10;
    const pinHash = await bcrypt.hash(pin, saltRounds);

    const userId = req.user.userId;

    // Update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { pinHash },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "PIN set successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Set PIN error:", error.message);
    res.status(500).json({ message: "Server error while setting PIN." });
  }
};

//Controller function to verify user
export const verifyPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    // Validate input
    if (!email || !pin || !/^\d{4}$/.test(pin)) {
      return res
        .status(400)
        .json({
          message: "Invalid input. User ID and 4-digit PIN are required.",
        });
    }

    // Find the user
    const user = await User.findOne({email});
    if (!user || !user.pinHash) {
      return res
        .status(404)
        .json({ message: "User not found or PIN not set." });
    }

    // Compare PIN with hash
    const isMatch = await bcrypt.compare(pin, user.pinHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect PIN." });
    }

    // Success
    return res.status(200).json({ message: "PIN verified successfully." });

  } catch (error) {
    console.error("Set PIN error:", error.message);
    res.status(500).json({ message: "Server error while setting PIN." });
  }
};
