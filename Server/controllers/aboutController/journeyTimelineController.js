const journeyTimelineModel = require("../../models/about/journeyTimeline");

class JourneyTimelineController {

  // ================= CREATE =================
  static insert = async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "Title and description are required",
        });
      }

      const data = await journeyTimelineModel.create({
        title,
        description,
      });

      return res.status(201).json({
        success: true,
        message: "Journey timeline created successfully",
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
      const data = await journeyTimelineModel
        .find()
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "View API error",
      });
    }
  };

  // ================= READ SINGLE =================
  static viewSingle = async (req, res) => {
    try {
      const data = await journeyTimelineModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Journey timeline not found",
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
      });
    }
  };

  // ================= UPDATE =================
  static update = async (req, res) => {
    try {
      const { title, description } = req.body;

      const data = await journeyTimelineModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Journey timeline not found",
        });
      }

      if (title) data.title = title;
      if (description) data.description = description;

      await data.save();

      return res.status(200).json({
        success: true,
        message: "Journey timeline updated successfully",
        data,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Update API error",
      });
    }
  };

  // ================= DELETE =================
  static delete = async (req, res) => {
    try {
      const data = await journeyTimelineModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Journey timeline not found",
        });
      }

      await data.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Journey timeline deleted successfully",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Delete API error",
      });
    }
  };
}

module.exports = JourneyTimelineController;
