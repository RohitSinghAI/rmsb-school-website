const schoolHighlightModel = require("../../models/home/schoolHighlights");

class schoolHighlightController {

    // CREATE Highlight
    static createHighlight = async (req, res) => {
        try {
            const { title, desc } = req.body;

            if (!title || !desc) {
                return res.status(400).json({
                    success: false,
                    message: "Title and Description are required"
                });
            }

            const highlight = await schoolHighlightModel.create({
                title,
                desc
            });

            res.status(201).json({
                success: true,
                message: "School Highlight Created Successfully",
                data: highlight
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // GET All Highlights
    static getAllHighlights = async (req, res) => {
        try {
            const highlights = await schoolHighlightModel
                .find()
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                total: highlights.length,
                data: highlights
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // GET Single Highlight
    static getHighlightById = async (req, res) => {
        try {
            const highlight = await schoolHighlightModel.findById(req.params.id);

            if (!highlight) {
                return res.status(404).json({
                    success: false,
                    message: "Highlight not found"
                });
            }

            res.status(200).json({
                success: true,
                data: highlight
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // UPDATE Highlight
    static updateHighlight = async (req, res) => {
        try {
            const { title, desc } = req.body;

            const updatedHighlight = await schoolHighlightModel.findByIdAndUpdate(
                req.params.id,
                { title, desc },
                { new: true }
            );

            if (!updatedHighlight) {
                return res.status(404).json({
                    success: false,
                    message: "Highlight not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Highlight Updated Successfully",
                data: updatedHighlight
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    // DELETE Highlight
    static deleteHighlight = async (req, res) => {
        try {
            const deletedHighlight = await schoolHighlightModel.findByIdAndDelete(req.params.id);

            if (!deletedHighlight) {
                return res.status(404).json({
                    success: false,
                    message: "Highlight not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Highlight Deleted Successfully"
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
}

module.exports = schoolHighlightController;
