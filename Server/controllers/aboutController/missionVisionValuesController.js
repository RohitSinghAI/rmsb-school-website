const missionVisionValuesModel = require("../../models/about/missionVisionValues");

class MissionVisionValuesController {

  // ================= CREATE =================
  static insert = async (req, res) => {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: "Title and content are required",
        });
      }

      const data = await missionVisionValuesModel.create({
        title,
        content,
      });

      return res.status(201).json({
        success: true,
        message: "Created successfully",
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
      const data = await missionVisionValuesModel
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
      const data = await missionVisionValuesModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Data not found",
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
      const { title, content } = req.body;

      const data = await missionVisionValuesModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Data not found",
        });
      }

      if (title) data.title = title;
      if (content) data.content = content;

      await data.save();

      return res.status(200).json({
        success: true,
        message: "Updated successfully",
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
      const data = await missionVisionValuesModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Data not found",
        });
      }

      await data.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Deleted successfully",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Delete API error",
      });
    }
  };
}

module.exports = MissionVisionValuesController;
