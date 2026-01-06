const mongoose = require("mongoose");

const upcomingEventSchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

const upcomingEventModel = mongoose.model("upcomingEvent",upcomingEventSchema);

module.exports = upcomingEventModel;
