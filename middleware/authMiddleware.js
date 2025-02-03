const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // Extract the token
    
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user details and attach to req.user (excluding password)
    req.user = await User.findById(decoded.id).select("-password");
    console.log("User found:", req.user);

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next(); // Move to the next middleware or controller function
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

const checkAdmin = (req, res, next) => {
  console.log("User Role:", req.user.role);
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { protect, checkAdmin };
