const statsModel = require("../../models/home/stats");

class statsController {

    static createStat = async (req, res) => {
        try {
            const { value, label } = req.body;

            if (!value || !label) {
                return res.status(400).json({
                    success: false,
                    message: "Value and Label are required"
                });
            }

            const stat = await statsModel.create({ value, label });

            res.status(201).json({
                success: true,
                message: "Stat created successfully",
                data: stat
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    static getAllStats = async (req, res) => {
        try {
            const stats = await statsModel
                .find()
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                total: stats.length,
                data: stats
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    static getStatById = async (req, res) => {
        try {
            const stat = await statsModel.findById(req.params.id);

            if (!stat) {
                return res.status(404).json({
                    success: false,
                    message: "Stat not found"
                });
            }

            res.status(200).json({
                success: true,
                data: stat
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    static updateStat = async (req, res) => {
        try {
            const { value, label } = req.body;

            const updatedStat = await statsModel.findByIdAndUpdate(
                req.params.id,
                { value, label },
                { new: true }
            );

            if (!updatedStat) {
                return res.status(404).json({
                    success: false,
                    message: "Stat not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Stat updated successfully",
                data: updatedStat
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    static deleteStat = async (req, res) => {
        try {
            const deletedStat = await statsModel.findByIdAndDelete(req.params.id);

            if (!deletedStat) {
                return res.status(404).json({
                    success: false,
                    message: "Stat not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Stat deleted successfully"
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
}

module.exports = statsController;
