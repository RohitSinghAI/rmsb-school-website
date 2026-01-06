const cloudinary = require("cloudinary");
const sliderModel = require("../../models/home/slider");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class SliderController {

    // ================= CREATE SLIDER =================
    static sliderInsert = async (req, res) => {
        try {
            const { title, subtitle } = req.body;

            if (!title || !subtitle) {
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

            const file = req.files.image;

            const upload = await cloudinary.uploader.upload(
                file.tempFilePath,
                { folder: "slider" }
            );

            const slider = await sliderModel.create({
                title,
                subtitle,
                image: {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                },
            });

            return res.status(201).json({
                success: true,
                message: "Slider created successfully",
                data: slider
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Create slider failed"
            });
        }
    };

    // ================= DISPLAY SLIDERS =================
    static sliderDisplay = async (req, res) => {
        try {
            const slides = await sliderModel.find().sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: "Slides fetched successfully",
                slides
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Display API error"
            });
        }
    };

    // ================= VIEW SINGLE SLIDER =================
    static sliderView = async (req, res) => {
        try {
            const slider = await sliderModel.findById(req.params._id);

            if (!slider) {
                return res.status(404).json({
                    success: false,
                    message: "Slider not found"
                });
            }

            return res.status(200).json({
                success: true,
                slider
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "View API error"
            });
        }
    };

    // ================= DELETE SLIDER =================
    static sliderDelete = async (req, res) => {
        try {
            const slider = await sliderModel.findById(req.params._id);

            if (!slider) {
                return res.status(404).json({
                    success: false,
                    message: "Slider not found"
                });
            }

            // delete image from cloudinary
            if (slider.image?.public_id) {
                await cloudinary.uploader.destroy(slider.image.public_id);
            }

            await slider.deleteOne();

            return res.status(200).json({
                success: true,
                message: "Slider deleted successfully"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Delete API error"
            });
        }
    };

    // ================= UPDATE SLIDER =================
    static sliderUpdate = async (req, res) => {
        try {
            const { title, subtitle } = req.body;

            const slider = await sliderModel.findById(req.params._id);
            if (!slider) {
                return res.status(404).json({
                    success: false,
                    message: "Slider not found"
                });
            }

            // update text
            if (title) slider.title = title;
            if (subtitle) slider.subtitle = subtitle;

            // update image if provided
            if (req.files && req.files.image) {

                // delete old image
                if (slider.image?.public_id) {
                    await cloudinary.uploader.destroy(slider.image.public_id);
                }

                const upload = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,
                    { folder: "slider" }
                );

                slider.image = {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                };
            }

            await slider.save();

            return res.status(200).json({
                success: true,
                message: "Slider updated successfully",
                data: slider
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Update API error"
            });
        }
    };
}

module.exports = SliderController;
