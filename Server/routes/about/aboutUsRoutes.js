const express = require("express");
const aboutUsController = require("../../controllers/aboutController/aboutUsController");

const router = express.Router();

router.post("/aboutUs/insert", aboutUsController.aboutUsInsert);
router.get("/aboutUs/view", aboutUsController.aboutUsDisplay);
router.get("/aboutUs/view/:id", aboutUsController.aboutUsView);
router.put("/aboutUs/update/:id", aboutUsController.aboutUsUpdate);
router.delete("/aboutUs/delete/:id", aboutUsController.aboutUsDelete);

module.exports = router;
