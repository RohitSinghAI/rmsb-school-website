const contactModel = require("../../models/contact/contact");

class ContactController {
    static create = async (req, res) => {
        try {
            const { name, phone, email, message } = req.body;

            if (!name || !phone || !email) {
                return res.status(400).json({
                    success: false,
                    message: "Name, phone and email are required",
                });
            }

            const contact = await contactModel.create({
                name,
                phone,
                email,
                message,
            });

            return res.status(201).json({
                success: true,
                message: "Contact message sent successfully",
                data: contact,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Create contact error",
            });
        }
    };
    static getAll = async (req, res) => {
        try {
            const contacts = await contactModel.find().sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                data: contacts,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Fetch contacts error",
            });
        }
    };
    static delete = async (req, res) => {
        try {
            const contact = await contactModel.findById(req.params.id);

            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: "Contact not found",
                });
            }

            await contact.deleteOne();

            return res.status(200).json({
                success: true,
                message: "Contact deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Delete contact error",
            });
        }
    };
}

module.exports = ContactController;
