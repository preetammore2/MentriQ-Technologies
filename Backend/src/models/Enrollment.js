const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid"
    },
    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active"
    },
    pricePaid: { type: Number, default: 0 },
    totalFee: { type: Number, default: 0 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dob: { type: String, required: true },
    contact: { type: String, required: true },
    parentContact: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
