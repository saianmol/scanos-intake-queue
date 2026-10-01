const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    patient_name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    primary_concern: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["new", "in_review", "approved", "rejected"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);