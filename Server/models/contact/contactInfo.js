const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema(
    {
        address: {
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
        mapUrl: {
            type: String,
            default: null,
        },
        streetViewUrl: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const contactInfoModel = mongoose.model("contactInfo", contactInfoSchema);

module.exports = contactInfoModel;
