const mongoose = require("mongoose")

const schoolHighlightSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const schoolHighlightModel = mongoose.model('schoolHighlight', schoolHighlightSchema)
module.exports = schoolHighlightModel