const express = require("express");
const SliderController = require("../../controllers/homeControllers/sliderController");

const router = express.Router();

// SLIDER ROUTES
router.post("/slider/create", SliderController.sliderInsert);
router.get("/slider", SliderController.sliderDisplay);
router.get("/slider/:_id", SliderController.sliderView);
router.put("/slider/update/:_id", SliderController.sliderUpdate);
router.delete("/slider/delete/:_id", SliderController.sliderDelete);

module.exports = router;
