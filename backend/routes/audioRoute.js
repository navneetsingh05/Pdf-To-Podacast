const express = require("express");
const { generateAudio } = require("../controllers/audioController");

const router = express.Router();

router.post("/audio", generateAudio);

module.exports = router;
