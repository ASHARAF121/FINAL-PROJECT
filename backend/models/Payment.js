const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    sessionId: {
      type: String
    },

    invoicePath: {
      type: String
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "cash"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
