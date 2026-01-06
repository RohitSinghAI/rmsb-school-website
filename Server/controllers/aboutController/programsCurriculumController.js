const programsCurriculumModel = require("../../models/about/programsCurriculum");

class ProgramsCurriculumController {

  // ================= CREATE =================
  static insert = async (req, res) => {
    try {
      const { title, content, type } = req.body;

      if (!title || !content || !type) {
        return res.status(400).json({
          success: false,
          message: "Title, content and type are required",
        });
      }

      const data = await programsCurriculumModel.create({
        title,
        content,
        type,
      });

      return res.status(201).json({
        success: true,
        message: "Program/Curriculum created successfully",
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
      const data = await programsCurriculumModel
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

  // ================= READ BY TYPE (OPTIONAL) =================
  static viewByType = async (req, res) => {
    try {
      const { type } = req.params;

      const data = await programsCurriculumModel.find({ type });

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "View by type API error",
      });
    }
  };

  // ================= READ SINGLE =================
  static viewSingle = async (req, res) => {
    try {
      const data = await programsCurriculumModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Program/Curriculum not found",
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
      const { title, content, type } = req.body;

      const data = await programsCurriculumModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Program/Curriculum not found",
        });
      }

      if (title) data.title = title;
      if (content) data.content = content;
      if (type) data.type = type;

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
      const data = await programsCurriculumModel.findById(req.params.id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Program/Curriculum not found",
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

module.exports = ProgramsCurriculumController;
