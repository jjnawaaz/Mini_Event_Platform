import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

const cookieOptions = {
  httpOnly: true,
  // sameSite: "strict",
  // secure: process.env.NODE_ENV === "production",
  // maxAge: 24 * 60 * 60 * 1000,
};

// register user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter name, email and password",
    });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const token = generateToken(user._id);

  return res
    .cookie(process.env.COOKIE_NAME, token, cookieOptions)
    .status(201)
    .json({
      success: true,
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter email and password",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const token = generateToken(user._id);

  return res
    .cookie(process.env.COOKIE_NAME, token, cookieOptions)
    .status(200)
    .json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
};

// logout
export const logout = async (req, res) => {
  return res
    .clearCookie(process.env.COOKIE_NAME, cookieOptions)
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

// me details for user profile
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("name email");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    user,
  });
};

// UPDATE ME
export const updateMe = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // check if the new email entered already exists
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
    user.email = email;
  }

  if (name) user.name = name;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  // invalidate session if sensitive data changed
  if (email || password) {
    res.clearCookie(process.env.COOKIE_NAME, cookieOptions);
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
};
