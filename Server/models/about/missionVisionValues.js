const mongoose = require("mongoose");

const missionVisionValuesSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const missionVisionValuesModel = mongoose.model("missionVisionValues", missionVisionValuesSchema);
module.exports = missionVisionValuesModel;
