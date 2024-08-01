const uploadController = require("../controllers/uploadsController");

const express = require("express");
const router = express.Router();

router.post("/file-upload", uploadController.uploadFile);

module.exports = router;