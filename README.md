# GoatBot Album API

A simple Express.js API for storing and retrieving media (photos/videos) for GoatBot using MongoDB.

---

## ✅ Features
- Upload media using `/upload`
- View all stored media using `/media`
- MongoDB powered (Atlas supported)
- Ready for deployment on **Render** or **Heroku**

---

## ⚙️ Routes

### `POST /upload`
Upload a photo or video.

**Form Data:**
- `media` (file): Attach the media (photo/video)

**Response:**
```text
File uploaded successfully!
