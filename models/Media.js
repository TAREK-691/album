const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['video', 'photo'], required: true },
  description: { type: String, default: "" },
  uploader: { type: String, required: true },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Media", mediaSchema);
