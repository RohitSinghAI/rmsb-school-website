// controllers/about/FacilityController.js
const cloudinary = require("cloudinary");
const facilityModel = require("../../models/about/facility");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class FacilityController {

    // ================= CREATE =================
    static insert = async (req, res) => {
        try {
            const title = req.body?.title?.trim() || "";
            const content = req.body?.content?.trim() || "";
            let imageData = null;

            if (req.files?.image) {
                const upload = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,
                    { folder: "facility" }
                );

                imageData = {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                };
            }

            const hasText = title || content;
            const hasImage = imageData?.url;

            if (!hasText && !hasImage) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field (title, content, or image) is required",
                });
            }

            const data = await facilityModel.create({
                title,
                content,
                image: imageData,
            });

            return res.status(201).json({
                success: true,
                message: "Facility created successfully",
                data,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Create API error",
            });
        }
    };

    // ================= READ ALL =================
    static viewAll = async (req, res) => {
        try {
            const data = await facilityModel.find().sort({ createdAt: -1 });
            return res.status(200).json({ success: true, data });
        } catch {
            return res.status(500).json({
                success: false,
                message: "View API error",
            });
        }
    };

    // ================= READ SINGLE =================
    static viewSingle = async (req, res) => {
        try {
            const data = await facilityModel.findById(req.params.id);

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Facility not found",
                });
            }

            return res.status(200).json({
                success: true,
                data,
            });

        } catch {
            return res.status(500).json({
                success: false,
                message: "Single view API error",
            });
        }
    };

    // ================= UPDATE =================
    static update = async (req, res) => {
        try {
            const data = await facilityModel.findById(req.params.id);

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Facility not found",
                });
            }

            if (req.body.title !== undefined)
                data.title = req.body.title.trim();
            if (req.body.content !== undefined)
                data.content = req.body.content.trim();

            if (req.files?.image) {
                if (data.image?.public_id) {
                    await cloudinary.uploader.destroy(data.image.public_id);
                }

                const upload = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,
                    { folder: "facility" }
                );

                data.image = {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                };
            }

            const hasText = data.title || data.content;
            const hasImage = data.image?.url;

            if (!hasText && !hasImage) {
                return res.status(400).json({
                    success: false,
                    message: "Facility must have at least one field",
                });
            }

            await data.save();

            return res.status(200).json({
                success: true,
                message: "Facility updated successfully",
                data,
            });

        } catch {
            return res.status(500).json({
                success: false,
                message: "Update API error",
            });
        }
    };

    // ================= DELETE =================
    static delete = async (req, res) => {
        try {
            const data = await facilityModel.findById(req.params.id);

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Facility not found",
                });
            }

            if (data.image?.public_id) {
                await cloudinary.uploader.destroy(data.image.public_id);
            }

            await data.deleteOne();

            return res.status(200).json({
                success: true,
                message: "Facility deleted successfully",
            });

        } catch {
            return res.status(500).json({
                success: false,
                message: "Delete API error",
            });
        }
    };
}

module.exports = FacilityController;
