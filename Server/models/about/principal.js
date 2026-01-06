const mongoose = require('mongoose')

const principalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    message: {
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
const principalModel = mongoose.model('principal', principalSchema);
module.exports = principalModel