const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    },

    serviceType: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },

    date: {
      type: Date,
      required: true
    },

    time: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    notes: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
