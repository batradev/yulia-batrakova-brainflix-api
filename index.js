const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "public/images")));

const videoRoutes = require("./routes/videos");
app.use("/videos", videoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
