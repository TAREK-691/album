const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Media schema for video/photo
const mediaSchema = new mongoose.Schema({
  url: String,
  type: String,
  uploadedAt: { type: Date, default: Date.now },
});

const Media = mongoose.model("Media", mediaSchema);

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route for uploading media
app.post("/upload", upload.single("media"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const type = req.file.mimetype.includes("image") ? "photo" : "video";
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  const newMedia = new Media({ url, type });
  await newMedia.save();

  res.json({ success: true, url, type });
});

// Route for listing media
app.get("/media", async (req, res) => {
  const media = await Media.find().sort({ uploadedAt: -1 });
  res.json(media);
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
