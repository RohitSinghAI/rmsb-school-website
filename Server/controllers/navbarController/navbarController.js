const cloudinary = require("cloudinary");
const navbarModel = require("../../models/navbar/navbar");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class NavbarController {

    // ================= CREATE NAVBAR =================
    static navbarCreate = async (req, res) => {
        try {
            const { title, subtitle, href, logoText, marqueeItems } = req.body;

            if (!title || !subtitle) {
                return res.status(400).json({
                    success: false,
                    message: "Title and subtitle are required",
                });
            }

            if (!req.files || !req.files.logoImage) {
                return res.status(400).json({
                    success: false,
                    message: "Logo image is required",
                });
            }

            const upload = await cloudinary.uploader.upload(
                req.files.logoImage.tempFilePath,
                { folder: "navbar" }
            );

            const navbar = await navbarModel.create({
                brand: {
                    logoText: logoText || "",
                    logoImage: {
                        public_id: upload.public_id,
                        url: upload.secure_url,
                    },
                    title,
                    subtitle,
                    href: href || "/",
                },
                marqueeItems: marqueeItems ? JSON.parse(marqueeItems) : [],
            });

            return res.status(201).json({
                success: true,
                message: "Navbar created successfully",
                data: navbar,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Navbar create failed",
            });
        }
    };

    // ================= UPDATE NAVBAR =================
    static navbarUpdate = async (req, res) => {
        try {
            const { title, subtitle, href, logoText, marqueeItems } = req.body;

            const navbar = await navbarModel.findById(req.params._id);
            if (!navbar) {
                return res.status(404).json({
                    success: false,
                    message: "Navbar not found",
                });
            }

            // update text fields
            if (title) navbar.brand.title = title;
            if (subtitle) navbar.brand.subtitle = subtitle;
            if (href) navbar.brand.href = href;
            if (logoText !== undefined) navbar.brand.logoText = logoText;

            // update marquee
            if (marqueeItems) {
                navbar.marqueeItems = JSON.parse(marqueeItems);
            }

            // update image if provided
            if (req.files && req.files.logoImage) {

                // delete old image
                if (navbar.brand.logoImage?.public_id) {
                    await cloudinary.uploader.destroy(
                        navbar.brand.logoImage.public_id
                    );
                }

                const upload = await cloudinary.uploader.upload(
                    req.files.logoImage.tempFilePath,
                    { folder: "navbar" }
                );

                navbar.brand.logoImage = {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                };
            }

            await navbar.save();

            return res.status(200).json({
                success: true,
                message: "Navbar updated successfully",
                data: navbar,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Navbar update failed",
            });
        }
    };

    // ================= GET NAVBAR =================
    static navbarDisplay = async (req, res) => {
        try {
            const navbar = await navbarModel.findOne({ isActive: true });

            return res.status(200).json({
                success: true,
                navbar,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Navbar fetch failed",
            });
        }
    };
}

module.exports = NavbarController;
