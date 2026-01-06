const mongoose = require("mongoose")

const journeyTimelineSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const journeyTimelineModel = mongoose.model('journeyTimeline', journeyTimelineSchema)
module.exports = journeyTimelineModel