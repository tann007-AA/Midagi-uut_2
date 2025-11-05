const express = require("express");
const multer = require("multer");

const router = express.Router();
const uploader = multer({dest: "./public/gallery/orig/"});


const {
	galleryphotouploadPage,
	galleryphotouploadPagePost
} = require("../controllers/galleryphotouploadControllers");

router.route("/").get(galleryphotouploadPage);

router.route("/").post(uploader.single("photoinput"),
galleryphotouploadPagePost);

module.exports = router;