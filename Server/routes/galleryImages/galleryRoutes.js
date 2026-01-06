const express = require("express");
const GalleryController = require("../../controllers/galleryImagesController/galleryImagesController");
const router = express.Router();

router.post("/galleryInsert/insert", GalleryController.galleryInsert);
router.get("/galleryDisplay/display", GalleryController.galleryDisplay);
router.get("/galleryView/view/:_id", GalleryController.galleryView);
router.delete("/galleryDelete/delete/:_id", GalleryController.galleryDelete);
router.put("/galleryUpdate/update/:_id", GalleryController.galleryUpdate);

module.exports = router;
