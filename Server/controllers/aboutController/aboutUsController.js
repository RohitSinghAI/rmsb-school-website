const cloudinary = require("cloudinary");
const aboutUsModel = require("../../models/about/aboutUs");

// ✅ Cloudinary config (safe)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class aboutUsController {

  // ================= CREATE =================
  static aboutUsInsert = async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "Title and description are required",
        });
      }

      if (!req.files || !req.files.image) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }

      const file = req.files.image;

      if (!file.tempFilePath) {
        return res.status(400).json({
          success: false,
          message: "File upload error",
        });
      }

      const upload = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "aboutUs" }
      );

      const aboutUs = await aboutUsModel.create({
        title,
        description,
        image: {
          public_id: upload.public_id,
          url: upload.secure_url,
        },
      });

      return res.status(201).json({
        success: true,
        message: "AboutUs created successfully",
        data: aboutUs,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Create AboutUs failed",
      });
    }
  };

  // ================= DISPLAY =================
  static aboutUsDisplay = async (req, res) => {
    try {
      const aboutUs = await aboutUsModel.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        aboutUs,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Display API error",
      });
    }
  };

  // ================= VIEW SINGLE =================
  static aboutUsView = async (req, res) => {
    try {
      const aboutUs = await aboutUsModel.findById(req.params.id);

      if (!aboutUs) {
        return res.status(404).json({
          success: false,
          message: "AboutUs not found",
        });
      }

      return res.status(200).json({
        success: true,
        aboutUs,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "View API error",
      });
    }
  };

  // ================= DELETE =================
  static aboutUsDelete = async (req, res) => {
    try {
      const aboutUs = await aboutUsModel.findById(req.params.id);

      if (!aboutUs) {
        return res.status(404).json({
          success: false,
          message: "AboutUs not found",
        });
      }

      if (aboutUs.image?.public_id) {
        await cloudinary.uploader.destroy(aboutUs.image.public_id);
      }

      await aboutUs.deleteOne();

      return res.status(200).json({
        success: true,
        message: "AboutUs deleted successfully",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Delete API error",
      });
    }
  };

  // ================= UPDATE =================
  static aboutUsUpdate = async (req, res) => {
    try {
      const { title, description } = req.body;

      const aboutUs = await aboutUsModel.findById(req.params.id);
      if (!aboutUs) {
        return res.status(404).json({
          success: false,
          message: "AboutUs not found",
        });
      }

      let isUpdated = false;

      if (title) {
        aboutUs.title = title;
        isUpdated = true;
      }

      if (description) {
        aboutUs.description = description;
        isUpdated = true;
      }

      if (req.files && req.files.image) {
        if (aboutUs.image?.public_id) {
          await cloudinary.uploader.destroy(aboutUs.image.public_id);
        }

        const upload = await cloudinary.uploader.upload(
          req.files.image.tempFilePath,
          { folder: "aboutUs" }
        );

        aboutUs.image = {
          public_id: upload.public_id,
          url: upload.secure_url,
        };

        isUpdated = true;
      }

      if (!isUpdated) {
        return res.status(400).json({
          success: false,
          message: "No data provided to update",
        });
      }

      await aboutUs.save();

      return res.status(200).json({
        success: true,
        message: "AboutUs updated successfully",
        data: aboutUs,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Update API error",
      });
    }
  };
}

module.exports = aboutUsController;
