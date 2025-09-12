const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      index: true, // single field index
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // unique index
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      index: true,
    },
    source: {
      type: String,
      enum: ["website", "referral", "social", "ads", "other"],
      required: [true, "Source is required"],
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for faster queries
leadSchema.index({ name: 1, email: 1 });

// text index for searching name/email
leadSchema.index({ name: "text", email: "text" });

const Lead = mongoose.model("Lead", leadSchema);

// Ensure indexes are created whenever app starts
Lead.syncIndexes()
  .then(() => console.log("Lead indexes synced"))
  .catch((err) => console.error("Index sync error", err));

module.exports = Lead;
