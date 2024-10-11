const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const videosFilePath = path.join(__dirname, "../data/videos.json");
const imagesDirectoryPath = path.join(__dirname, "../public/images");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const readVideosFromFile = () => {
  const fileData = fs.readFileSync(videosFilePath);
  return JSON.parse(fileData);
};

const writeVideosToFile = (data) => {
  fs.writeFileSync(videosFilePath, JSON.stringify(data, null, 2));
};

router.get("/", (req, res) => {
  const videos = readVideosFromFile();
  res.json(videos);
});
router.get("/:id", (req, res) => {
  const videos = readVideosFromFile();
  const videoId = req.params.id;
  const video = videos.find((video) => video.id === videoId);

  if (video) {
    res.json(video);
  } else {
    res.status(404).json({ message: "No video with that id exists" });
  }
});

router.post("/:id/comments", (req, res) => {
  const videos = readVideosFromFile();
  const videoId = req.params.id;
  const video = videos.find((video) => video.id === videoId);

  if (video) {
    const newComment = {
      id: uuidv4(),
      name: req.body.name,
      comment: req.body.comment,
      likes: 0,
      timestamp: Date.now(),
    };

    video.comments.push(newComment);
    writeVideosToFile(videos);
    res.status(201).json(newComment);
  } else {
    res.status(404).json({ message: "Video not found" });
  }
});

router.put("/:id/likes", (req, res) => {
  const videos = readVideosFromFile();
  const videoId = req.params.id;
  const video = videos.find((video) => video.id === videoId);
  const currentLikes = parseInt(video.likes.replace(/,/g, ""), 10);
  video.likes = (currentLikes + 1).toLocaleString();
  writeVideosToFile(videos);
  res.status(201).json(video.likes);
});

router.delete("/:id/likes", (req, res) => {
  const videos = readVideosFromFile();
  const videoId = req.params.id;
  const video = videos.find((video) => video.id === videoId);
  const currentLikes = parseInt(video.likes.replace(/,/g, ""), 10);
  video.likes = (currentLikes - 1).toLocaleString();
  writeVideosToFile(videos);
  res.status(201).json(video.likes);
});

router.delete("/:id/comments/:commentId", (req, res) => {
  const videos = readVideosFromFile();
  const videoId = req.params.id;
  const video = videos.find((video) => video.id === videoId);
  video.comments = video.comments.filter(
    (comment) => comment.id !== req.params.commentId
  );
  writeVideosToFile(videos);
  res.status(201).json(video.comments);
});

router.post("/", upload.single("image"), (req, res) => {
  const videos = readVideosFromFile();
  const newVideo = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    channel: "Default Channel",

    image: req.file
      ? `http://localhost:8080/images/${req.file.filename}`
      : "http://localhost:8080/images/default-image.jpg",
    views: "0",
    likes: "0",
    duration: "0:00",
    video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [],
  };

  videos.push(newVideo);
  writeVideosToFile(videos);
  res.status(201).json(newVideo);
});

module.exports = router;
