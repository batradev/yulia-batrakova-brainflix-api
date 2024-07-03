const express = require('express');
const router = express.Router();

let videos = require('../data/videos.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const videosFilePath = path.join(__dirname, '../data/videos.json');
const imagesDirectoryPath = path.join(__dirname, '../public/images');

const readVideosFromFile = () => {
    const fileData = fs.readFileSync(videosFilePath);
    return JSON.parse(fileData);
};

const writeVideosToFile = (data) => {
    fs.writeFileSync(videosFilePath, JSON.stringify(data, null, 2));
};

const getRandomImage = () => {
    const images = fs.readdirSync(imagesDirectoryPath);
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
};

router.get('/', (req, res) => {
    const videos = readVideosFromFile();
    res.json(videos);
});
router.get('/:id', (req, res) => {
    const videos = readVideosFromFile();
    const videoId = req.params.id;
    const video = videos.find(video => video.id === videoId);

    if (video) {
        res.json(video);
    } else {
        res.status(404).json({ message: 'No video with that id exists' });
    }
});

router.post('/:id/comments', (req, res) => {
    const videos = readVideosFromFile();
    const videoId = req.params.id;
    const video = videos.find(video => video.id === videoId);

    if (video) {
        const newComment = {
            id: uuidv4(),
            name: req.body.name,
            comment: req.body.comment,
            likes: 0,
            timestamp: Date.now()
        };

        video.comments.push(newComment);
        writeVideosToFile(videos);
        res.status(201).json(newComment);
    } else {
        res.status(404).json({ message: 'Video not found' });
    }
});

router.put('/:id/likes', (req, res) => {
    const videos = readVideosFromFile();
    const videoId = req.params.id;
    const video = videos.find(video => video.id === videoId);
    const currentLikes = parseInt(video.likes.replace(/,/g, ''), 10);
    video.likes = (currentLikes + 1).toLocaleString();
    writeVideosToFile(videos);
    res.status(201).json(video.likes);
})

router.delete('/:id/comments/:commentId', (req, res) => {
    const videos = readVideosFromFile();
    const videoId = req.params.id;
    const video = videos.find(video => video.id === videoId);
    video.comments = video.comments.filter(comment => comment.id !== req.params.commentId)
    writeVideosToFile(videos);
    res.status(201).json(video.comments);
})


router.post('/', (req, res) => {
    const videos = readVideosFromFile();
    const newVideo = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        channel: "Default Channel",
        image: `http://localhost:8080/images/${getRandomImage()}`,
        views: "0",
        likes: "0",
        duration: "0:00",
        video: "http://localhost:3000/stream",
        timestamp: Date.now(),
        comments: []
    };

    videos.push(newVideo);
    writeVideosToFile(videos);
    res.status(201).json(newVideo);
});


// router.post('/', (req, res) => {
//     const newVideo = req.body;
//     videos.push(newVideo);
//     res.status(201).json(newVideo);
// });

module.exports = router