const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Album API is running!");
});

// Route for categories
app.get("/categories", (req, res) => {
  try {
    const categories = JSON.parse(fs.readFileSync("./data/categories.json", "utf-8"));
    res.json(categories);
  } catch (err) {
    res.status(500).send("Error loading categories data: " + err.message);
  }
});

// Route for videos
app.get("/videos", (req, res) => {
  const category = req.query.category;
  try {
    const videos = JSON.parse(fs.readFileSync("./data/videos.json", "utf-8"));
    const filtered = videos.filter(v => v.category === category);
    res.json(filtered);
  } catch (err) {
    res.status(500).send("Error loading video data: " + err.message);
  }
});

// Ensure proper response for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
