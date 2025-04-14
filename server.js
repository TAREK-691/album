const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const Media = require("./models/Media");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("uploads"));

// MongoDB connection
mongoose.connect("mongodb+srv://eren:erenxten@cluster0.facb9ur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${req.body.category}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const { category, description, uploader, type } = req.body;
  const url = `${req.protocol}://${req.get("host")}/${category}/${req.file.filename}`;

  const media = new Media({
    filename: req.file.filename,
    category,
    url,
    type,
    description,
    uploader
  });

  await media.save();

  res.json({ message: "File uploaded!", url });
});

// View files in a category
app.get("/view/:category", async (req, res) => {
  const { category } = req.params;
  const files = await Media.find({ category });
  res.json({ files });
});

// List categories
app.get("/categories", async (req, res) => {
  const categories = await Media.distinct("category");
  res.json({ categories });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
