import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";


const authMiddleware = asyncHandler(async(req, res, next) => {
  const token = req.headers.authorization;
  
  token = token && token.split(" ")[1]; // Bearer <token>
  
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
    }
    const user = await User.findById(decoded._id);
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();     
})

export default authMiddleware;