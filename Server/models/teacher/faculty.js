const mongoose = require("mongoose");

const facultySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        department: {
            type: String,
            required: true,
        },

        subject: {
            type: String,
            required: true,
        },

        experience: {
            type: String,
            required: true
        },

        bio: {
            type: String,
            required: true
        },

        courses: [
            {
                type: String,
                trim: true
            }
        ],

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        image: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    },
    { timestamps: true }
);

const facultyModel = mongoose.model("faculty", facultySchema);
module.exports = facultyModel;
