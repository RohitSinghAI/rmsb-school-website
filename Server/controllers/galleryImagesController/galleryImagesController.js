const cloudinary = require("cloudinary");
const GalleryImage = require("../../models/gallery/galleryImages");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class GalleryController {

    // ================= CREATE GALLERY IMAGE =================
    static galleryInsert = async (req, res) => {
        try {
            const { category } = req.body;

            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: "Category is required"
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
                { folder: "gallery" }
            );

            const gallery = await GalleryImage.create({
                images: upload.secure_url,
                category
            });

            return res.status(201).json({
                success: true,
                message: "Gallery image added successfully",
                data: gallery
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Gallery insert failed"
            });
        }
    };

    // ================= DISPLAY GALLERY =================
    static galleryDisplay = async (req, res) => {
        try {
            const { category } = req.query;
            const filter = category ? { category } : {};

            const gallery = await GalleryImage.find(filter).sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: "Gallery fetched successfully",
                gallery
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Gallery display failed"
            });
        }
    };

    // ================= VIEW SINGLE IMAGE =================
    static galleryView = async (req, res) => {
        try {
            const gallery = await GalleryImage.findById(req.params._id);

            if (!gallery) {
                return res.status(404).json({
                    success: false,
                    message: "Gallery image not found"
                });
            }

            return res.status(200).json({
                success: true,
                gallery
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Gallery view failed"
            });
        }
    };

    // ================= DELETE IMAGE =================
    static galleryDelete = async (req, res) => {
        try {
            const gallery = await GalleryImage.findById(req.params._id);

            if (!gallery) {
                return res.status(404).json({
                    success: false,
                    message: "Gallery image not found"
                });
            }

            // Cloudinary se image delete
            const publicId = gallery.images.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`gallery/${publicId}`);

            await gallery.deleteOne();

            return res.status(200).json({
                success: true,
                message: "Gallery image deleted successfully"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Gallery delete failed"
            });
        }
    };

    // ================= UPDATE IMAGE =================
    static galleryUpdate = async (req, res) => {
        try {
            const { category } = req.body;

            const gallery = await GalleryImage.findById(req.params._id);
            if (!gallery) {
                return res.status(404).json({
                    success: false,
                    message: "Gallery image not found"
                });
            }

            // category update
            if (category) gallery.category = category;

            // image update
            if (req.files && req.files.image) {

                const publicId = gallery.images.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`gallery/${publicId}`);

                const upload = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,
                    { folder: "gallery" }
                );

                gallery.images = upload.secure_url;
            }

            await gallery.save();

            return res.status(200).json({
                success: true,
                message: "Gallery image updated successfully",
                data: gallery
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Gallery update failed"
            });
        }
    };
}

module.exports = GalleryController;
