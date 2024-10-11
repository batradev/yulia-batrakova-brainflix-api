This is the backend for the BrainFlix project developed during the BrainStation bootcamp

**Created by**: Yulia Batrakova

## Overview
The backend for the BrainFlix project is built with Node.js and Express. It provides a RESTful API to manage video data, simulating server-side functionality for a video streaming platform.

## Features
- **RESTful API**: Endpoints for retrieving and managing video data.
- **Data Persistence**: Uses a JSON file to store data, ensuring persistence across server restarts.
- **File Handling**: Utilizes Multer for handling file uploads.
- **Static Assets Serving**: Serves static files such as video thumbnails.

## Technologies Used
- Node.js
- Express.js
- Multer (for file uploads)
- UUID (for generating unique IDs)

## Installation and Setup

1. **Clone the Repository**

```bash
git clone git@github.com:batradev/yulia-batrakova-brainflix-api.git
```

2. **Navigate to the Project Directory**

```bash
cd yulia-batrakova-brainflix-api
```

3. **Install Dependencies**

```bash
npm install
```

4. **Start the Application**

```bash
npm start
```
The application will run at http://localhost:8080.

## Prerequisites
Node.js and npm should be installed on your machine.

## API Endpoints

### GET /videos
- **Description**: Retrieves an array of video summaries.
- **Response**: JSON array of video objects (`id`, `title`, `channel`, `image`).

### GET /videos/:id
- **Description**: Retrieves detailed information for a specific video.
- **Parameters**: `id` - The unique identifier of the video.
- **Response**: JSON object containing video details.

### POST /videos
- **Description**: Adds a new video to the list.
- **Request Body**:
  - `title` (string, required)
  - `description` (string, required)
  - `image` (file, optional) - Handled by Multer.
- **Response**: JSON object of the newly created video.

### POST /videos/:id/comments
- **Description**: Adds a new comment to a specific video.
- **Request Body**:
  - `name` (string, required)
  - `comment` (string, required)
- **Response**: JSON object of the newly created comment.

### PUT /videos/:id/likes
- **Description**: Increases the like count for a specific video.
- **Response**: JSON object with the updated like count.

### DELETE /videos/:id/likes
- **Description**: Decreases the like count for a specific video.
- **Response**: JSON object with the updated like count.

### DELETE /videos/:id/comments/:commentId
- **Description**: Deletes a specific comment from a video.
- **Parameters**: 
  - `id` - The unique identifier of the video.
  - `commentId` - The unique identifier of the comment.
- **Response**: JSON array of remaining comments for the video.

## Data Persistence
- Video data is stored in `data/videos.json`.
- Uploaded images are stored in the `public/images` directory.


