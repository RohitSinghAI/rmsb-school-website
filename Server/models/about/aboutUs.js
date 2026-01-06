const mongoose = require('mongoose')

const aboutUsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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
}, { timestamps: true });
const aboutUsModel = mongoose.model('aboutUs', aboutUsSchema);
module.exports = aboutUsModel