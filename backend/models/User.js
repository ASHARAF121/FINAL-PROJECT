const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "client", "provider"],
      default: "client"
    },

    phone: {
      type: String
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    documents: [
      {
        type: String // file paths or URLs (providers)
      }
    ]
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("User", userSchema);
