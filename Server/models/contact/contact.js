const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);
const contactModel = mongoose.model("contact", contactSchema);
module.exports = contactModel;
