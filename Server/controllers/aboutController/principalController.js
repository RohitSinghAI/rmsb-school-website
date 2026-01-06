const cloudinary = require("cloudinary");
const principalModel = require("../../models/about/principal");

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class PrincipalController {

    // ================= CREATE =================
    static createPrincipal = async (req, res) => {
        try {
            const { title, designation, message } = req.body;

            if (!title || !designation || !message) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }

            if (!req.files || !req.files.image) {
                return res.status(400).json({
                    success: false,
                    message: "Image is required",
                });
            }

            const upload = await cloudinary.uploader.upload(
                req.files.image.tempFilePath,
                { folder: "principal" }
            );

            const principal = await principalModel.create({
                title,
                designation,
                message,
                image: {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                },
            });

            return res.status(201).json({
                success: true,
                message: "Principal created successfully",
                data: principal,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Create principal failed",
            });
        }
    };

    // ================= READ ALL =================
    static getAllPrincipals = async (req, res) => {
        try {
            const principals = await principalModel.find().sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                data: principals,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Fetch principals failed",
            });
        }
    };

    // ================= READ SINGLE =================
    static getSinglePrincipal = async (req, res) => {
        try {
            const principal = await principalModel.findById(req.params.id);

            if (!principal) {
                return res.status(404).json({
                    success: false,
                    message: "Principal not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: principal,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Fetch principal failed",
            });
        }
    };

    // ================= UPDATE =================
    static updatePrincipal = async (req, res) => {
        try {
            const { title, designation, message } = req.body;
            const principal = await principalModel.findById(req.params.id);

            if (!principal) {
                return res.status(404).json({
                    success: false,
                    message: "Principal not found",
                });
            }

            if (title) principal.title = title;
            if (designation) principal.designation = designation;
            if (message) principal.message = message;

            if (req.files && req.files.image) {
                if (principal.image?.public_id) {
                    await cloudinary.uploader.destroy(principal.image.public_id);
                }

                const upload = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,
                    { folder: "principal" }
                );

                principal.image = {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                };
            }

            await principal.save();

            return res.status(200).json({
                success: true,
                message: "Principal updated successfully",
                data: principal,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Update principal failed",
            });
        }
    };

    // ================= DELETE =================
    static deletePrincipal = async (req, res) => {
        try {
            const principal = await principalModel.findById(req.params.id);

            if (!principal) {
                return res.status(404).json({
                    success: false,
                    message: "Principal not found",
                });
            }

            if (principal.image?.public_id) {
                await cloudinary.uploader.destroy(principal.image.public_id);
            }

            await principal.deleteOne();

            return res.status(200).json({
                success: true,
                message: "Principal deleted successfully",
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Delete principal failed",
            });
        }
    };
}

module.exports = PrincipalController;
