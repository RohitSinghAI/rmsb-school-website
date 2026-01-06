const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const SECRET = process.env.JWT_SECRET || "pn1234";

const checkAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Login required" });
        }
 
        const decoded = jwt.verify(token, SECRET);
        const user = await Admin.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = checkAuth;
