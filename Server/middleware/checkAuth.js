const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // 1️⃣ Token check
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Find user
    const user = await Admin.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // 4️⃣ 🔒 ADMIN ROLE CHECK (IMPORTANT)
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    // 5️⃣ Attach user
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
};

module.exports = checkAuth;
