require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Media schema
const mediaSchema = new mongoose.Schema({
    type: String,
    url: String,
});

const Media = mongoose.model('Media', mediaSchema);

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('media'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    const media = new Media({
        type: req.file.mimetype.startsWith('image') ? 'photo' : 'video',
        url: req.protocol + '://' + req.get('host') + '/' + req.file.path.replace('\\', '/'),
    });
    await media.save();
    res.send('File uploaded successfully!');
});

// Get all media
app.get('/media', async (req, res) => {
    const media = await Media.find();
    res.json(media);
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});