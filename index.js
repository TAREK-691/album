const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();
const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));

const Video = require("./models/Video");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload Route
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { category } = req.body;
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const video = new Video({ category, url });
    await video.save();
    res.json({ message: "Uploaded", url });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// Fetch all or by category
app.get("/videos", async (req, res) => {
  const { category } = req.query;
  try {
    const videos = category
      ? await Video.find({ category })
      : await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
