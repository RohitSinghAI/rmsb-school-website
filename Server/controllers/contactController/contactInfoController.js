const contactInfoModel = require("../../models/contact/contactInfo");

class ContactInfoController {

  // ================= CREATE =================
  static insert = async (req, res) => {
    try {
      const { address, phone, email, mapUrl, streetViewUrl } = req.body;

      if (!address || !phone || !email || !mapUrl || !streetViewUrl) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const data = await contactInfoModel.create({
        address,
        phone,
        email,
        mapUrl,
        streetViewUrl,
      });

      return res.status(201).json({
        success: true,
        message: "Contact info created successfully",
        data,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Create API error",
        error: error.message,
      });
    }
  };

  // ================= READ ALL =================
  static viewAll = async (req, res) => {
    try {
      const data = await contactInfoModel.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "View API error",
        error: error.message,
      });
    }
  };

  // ================= READ SINGLE =================
  static viewSingle = async (req, res) => {
    try {
      const data = await contactInfoModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Contact info not found",
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Single view API error",
        error: error.message,
      });
    }
  };

  // ================= UPDATE =================
  static update = async (req, res) => {
    try {
      const { address, phone, email, mapUrl, streetViewUrl } = req.body;

      const data = await contactInfoModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Contact info not found",
        });
      }

      if (address) data.address = address;
      if (phone) data.phone = phone;
      if (email) data.email = email;
      if (mapUrl) data.mapUrl = mapUrl;
      if (streetViewUrl) data.streetViewUrl = streetViewUrl;

      await data.save();

      return res.status(200).json({
        success: true,
        message: "Contact info updated successfully",
        data,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Update API error",
        error: error.message,
      });
    }
  };

  // ================= DELETE =================
  static delete = async (req, res) => {
    try {
      const data = await contactInfoModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Contact info not found",
        });
      }

      await data.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Contact info deleted successfully",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Delete API error",
        error: error.message,
      });
    }
  };
}

module.exports = ContactInfoController;
