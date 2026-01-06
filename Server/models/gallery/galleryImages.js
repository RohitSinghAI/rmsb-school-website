const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema(
  {
    images: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Campus", "Classrooms", "Events", "Sports"],
    },
  },
  { timestamps: true }
);

const GalleryImage = mongoose.model("GalleryImage", gallerySchema);
module.exports = GalleryImage;
