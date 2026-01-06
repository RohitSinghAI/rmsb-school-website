// models/about/facility.js
const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    content: { type: String, trim: true, default: "" },
    image: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("facility", facilitySchema);
