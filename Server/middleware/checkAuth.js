const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    /* ================= NO TOKEN ================= */
    if (!token) {
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN",
        message: "Session expired. Please login again.",
      });
    }

    /* ================= VERIFY TOKEN ================= */
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        clockTolerance: 30, // ⏱️ tolerance for back/refresh
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid or expired token",
      });
    }

    /* ================= FIND ADMIN ================= */
    const user = await Admin.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User no longer exists",
      });
    }

    /* ================= ROLE CHECK ================= */
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message: "Access denied. Admins only.",
      });
    }

    /* ================= ATTACH USER ================= */
    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      success: false,
      code: "AUTH_ERROR",
      message: "Authentication failed",
    });
  }
};

module.exports = checkAuth;
