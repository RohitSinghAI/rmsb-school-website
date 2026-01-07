const mongoose = require("mongoose");

const navbarSchema = new mongoose.Schema(
  {
    brand: {
      logoText: {
        type: String,
        trim: true,
        default: "",
      },

      logoImage: {
        public_id: {
          type: String,
          default: "",
        },
        url: {
          type: String,
          default: "",
        },
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      subtitle: {
        type: String,
        required: true,
        trim: true,
      },

      href: {
        type: String,
        default: "/",
      },
    },

    /* 🔹 Marquee Section */
    marqueeItems: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const navbarModel = mongoose.model("navbar", navbarSchema);
module.exports = navbarModel;
