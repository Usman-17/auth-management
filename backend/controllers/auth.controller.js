import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

// PATH     : /api/auth/signup
// METHOD   : POST
// ACCESS   : PUBLIC
// DESC     : Create User
export const signup = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Validate required fields
    if (!name || !email || !password || !mobile) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email or mobile already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({
        error:
          existingUser.email === email
            ? "Email is already taken"
            : "Phone Number is already taken",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create new user
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 Hours
    });

    await newUser.save();

    // Generate token and set cookie
    generateTokenAndSetCookie(newUser._id, res);

    // Send success response
    res.status(201).json({
      success: true,
      message: "User Created successfully",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
