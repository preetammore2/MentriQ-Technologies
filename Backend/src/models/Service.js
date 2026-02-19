const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    icon: {
      type: String,
      required: [true, "Service icon/image URL is required"],
    },
    features: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: "from-blue-500 to-cyan-500",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
