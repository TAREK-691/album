const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Album API is running!");
});

app.get("/categories", (req, res) => {
  const categories = JSON.parse(fs.readFileSync("./data/categories.json", "utf-8"));
  res.json(categories);
});

app.get("/videos", (req, res) => {
  const category = req.query.category;
  const videos = JSON.parse(fs.readFileSync("./data/videos.json", "utf-8"));
  const filtered = videos.filter(v => v.category === category);
  res.json(filtered);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
