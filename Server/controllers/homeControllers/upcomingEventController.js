const upcomingEventModel = require("../../models/home/upcomingEvent");

class upcomingEventController {

    static createEvent = async (req, res) => {
        try {
            const { date, title, description } = req.body;

            if (!date || !title || !description) {
                return res.status(400).json({
                    success: false,
                    message: "Date, Title and Description are required"
                });
            }

            const event = await upcomingEventModel.create({
                date,
                title,
                description
            });

            res.status(201).json({
                success: true,
                message: "Upcoming event created successfully",
                data: event
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    static getAllEvents = async (req, res) => {
        try {
            const events = await upcomingEventModel
                .find()
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                total: events.length,
                data: events
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    static getEventById = async (req, res) => {
        try {
            const event = await upcomingEventModel.findById(req.params.id);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found"
                });
            }

            res.status(200).json({
                success: true,
                data: event
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    static updateEvent = async (req, res) => {
        try {
            const { date, title, description } = req.body;

            const updatedEvent = await upcomingEventModel.findByIdAndUpdate(
                req.params.id,
                { date, title, description },
                { new: true }
            );

            if (!updatedEvent) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Event updated successfully",
                data: updatedEvent
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    static deleteEvent = async (req, res) => {
        try {
            const deletedEvent = await upcomingEventModel.findByIdAndDelete(
                req.params.id
            );

            if (!deletedEvent) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Event deleted successfully"
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
}

module.exports = upcomingEventController;
