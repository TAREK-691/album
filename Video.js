const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  category: String,
  url: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Video", videoSchema);
