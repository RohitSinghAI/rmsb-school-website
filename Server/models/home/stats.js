const mongoose = require("mongoose")

const statsSchema = mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const statsModel = mongoose.model('stats', statsSchema)
module.exports = statsModel