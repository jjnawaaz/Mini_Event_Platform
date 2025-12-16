import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";

const protect = async (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({
        message: "Please login again",
      });
    req.user = await User.findById(decoded.id).select("_id");
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token invalid",
    });
  }
};

export default protect;
