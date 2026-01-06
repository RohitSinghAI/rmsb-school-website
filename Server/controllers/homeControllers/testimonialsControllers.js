const cloudinary = require("cloudinary");
const testimonialsModel = require("../../models/home/testimonials");

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class TestimonialsController {

    // ================= CREATE =================
    static testimonialInsert = async (req, res) => {
        try {
            const { name, role, message } = req.body;

            if (!name || !role || !message) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }

            if (!req.files || !req.files.image) {
                return res.status(400).json({
                    success: false,
                    message: "Image is required"
                });
            }

            const upload = await cloudinary.uploader.upload(
                req.files.image.tempFilePath,
                { folder: "testimonials" }
            );

            const testimonial = await testimonialsModel.create({
                name,
                role,
                message,
                status: "pending",
                image: {
                    public_id: upload.public_id,
                    url: upload.secure_url
                }
            });

            return res.status(201).json({
                success: true,
                message: "Testimonial submitted (Pending approval)",
                data: testimonial
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Create testimonial failed"
            });
        }
    };

    // ================= ADMIN DISPLAY =================
    static testimonialDisplay = async (req, res) => {
        try {
            const testimonials = await testimonialsModel
                .find()
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                testimonials
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Display API error"
            });
        }
    };

    // ================= PUBLIC DISPLAY (ONLY ACCEPTED) =================
    static testimonialPublicDisplay = async (req, res) => {
        try {
            const testimonials = await testimonialsModel
                .find({ status: "accepted" })
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                testimonials
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Public display error"
            });
        }
    };

    // ================= VIEW =================
    static testimonialView = async (req, res) => {
        const testimonial = await testimonialsModel.findById(req.params._id);
        if (!testimonial) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        return res.status(200).json({ success: true, testimonial });
    };

    // ================= UPDATE (EDIT / ACCEPT / REJECT) =================
    static testimonialUpdate = async (req, res) => {
        try {
            const { name, role, message, status } = req.body;

            const testimonial = await testimonialsModel.findById(req.params._id);
            if (!testimonial) {
                return res.status(404).json({
                    success: false,
                    message: "Testimonial not found"
                });
            }

            if (name) testimonial.name = name;
            if (role) testimonial.role = role;
            if (message) testimonial.message = message;
            if (status) testimonial.status = status; // 🔥 ACCEPT / REJECT

            if (req.files && req.files.image) {
                if (testimonial.image?.public_id) {
                    await cloudinary.uploader.destroy(testimonial.image.public_id);
                }

                const upload = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,
                    { folder: "testimonials" }
                );

                testimonial.image = {
                    public_id: upload.public_id,
                    url: upload.secure_url
                };
            }

            await testimonial.save();

            return res.status(200).json({
                success: true,
                message: "Testimonial updated successfully",
                data: testimonial
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Update API error"
            });
        }
    };

    // ================= DELETE =================
    static testimonialDelete = async (req, res) => {
        const testimonial = await testimonialsModel.findById(req.params._id);
        if (!testimonial) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        if (testimonial.image?.public_id) {
            await cloudinary.uploader.destroy(testimonial.image.public_id);
        }

        await testimonial.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Testimonial deleted"
        });
    };
}

module.exports = TestimonialsController;
