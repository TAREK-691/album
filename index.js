const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const albumSchema = new mongoose.Schema({
  name: String,
  category: String,
  videos: [String]
});
const Album = mongoose.model('Album', albumSchema);

app.get('/', (req, res) => res.send('Ayan Album API is live!'));

app.get('/albums', async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    res.status(500).send('Error fetching albums');
  }
});

app.post('/albums', async (req, res) => {
  try {
    const album = new Album(req.body);
    await album.save();
    res.status(201).json(album);
  } catch (err) {
    res.status(500).send('Error saving album');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
