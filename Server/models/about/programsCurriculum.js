const mongoose = require("mongoose");

const programsCurriculumSchema = mongoose.Schema(
    {
        title: { 
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const programsCurriculumModel = mongoose.model("programsCurriculum", programsCurriculumSchema);
module.exports = programsCurriculumModel;
