const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("../../models/Admin");
const sendEmail = require("../../utils/sendEmail");

const SECRET = process.env.JWT_SECRET || "pn1234";

class AdminController {

    // REGISTER
    static register = async (req, res) => {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const exists = await Admin.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const user = await Admin.create({ name, email, password });

        res.status(201).json({
            success: true,
            message: "Registered successfully",
            user: { _id: user._id, name: user.name, email: user.email },
        });
    };

    // LOGIN
    static login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required",
                });
            }

            const user = await Admin.findOne({ email: email.toLowerCase() }).select("+password");

            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            // 🔒 ADMIN ROLE CHECK
            if (user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Admins only.",
                });
            }

            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined");
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                success: true,
                message: "Admin login successful",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            next(error); // goes to global error handler
        }
    };


    // LOGOUT
    static logout = async (req, res) => {
        res.clearCookie("token");
        res.json({ success: true, message: "Logout successful" });
    };

    // PROFILE
    static profile = async (req, res) => {
        res.json({ success: true, user: req.user });
    };

    // UPDATE PROFILE
    static updateProfile = async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        const user = await Admin.findByIdAndUpdate(
            req.user._id,
            { name },
            { new: true }
        );

        res.json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    };


    // CHANGE PASSWORD
    static changePassword = async (req, res) => {
        const { oldPassword, newPassword } = req.body;

        const user = await Admin.findById(req.user._id).select("+password");

        if (!(await user.comparePassword(oldPassword))) {
            return res.status(401).json({
                success: false,
                message: "Old password incorrect",
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: "Password changed" });
    };

    //forgotPassword
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email is required",
                });
            }

            const user = await Admin.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            // Generate reset token
            const resetToken = user.getResetPasswordToken();
            await user.save({ validateBeforeSave: false });

            // Create reset URL
            const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password?token=${resetToken}`;

            // Send email
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      `,
            });

            return res.status(200).json({
                success: true,
                message: "Reset link sent to your email",
            });

        } catch (error) {
            console.error("FORGOT PASSWORD ERROR 👉", error);

            return res.status(500).json({
                success: false,
                message: "Email could not be sent. Try again later.",
            });
        }
    };


    // RESET PASSWORD
    static resetPassword = async (req, res) => {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.body.token)
            .digest("hex");

        const user = await Admin.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid token" });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successful" });
    };

    // DASHBOARD
    static dashboard = async (req, res) => {
        res.json({ success: true, user: req.user });
    };

    ///////////////////// Email ////////////////

    static forgotPassword = async (req, res) => {
        try {
            const email = req.body.email;

            const user = await Admin.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const resetToken = user.getResetPasswordToken();
            await user.save({ validateBeforeSave: false });

            const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password?token=${resetToken}`;


            const message = `
      <h2>Password Reset</h2>
      <p>You requested a password reset</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 10 minutes</p>
    `;

            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                html: message,
            });

            return res.status(200).json({
                success: true,
                message: "Reset link sent to your email",
            });

        } catch (error) {
            console.error("FORGOT PASSWORD ERROR 👉", error);
            return res.status(500).json({
                success: false,
                message: "Email could not be sent",
            });
        }
    };

}

module.exports = AdminController;
