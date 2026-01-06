const express = require("express");
const TestimonialsController = require("../../controllers/homeControllers/testimonialsControllers");
const router = express.Router();

router.post("/testimonials/insert", TestimonialsController.testimonialInsert);
router.get("/testimonials/display", TestimonialsController.testimonialDisplay);
router.get("/testimonials/public", TestimonialsController.testimonialPublicDisplay);
router.get("/testimonials/view/:_id", TestimonialsController.testimonialView);
router.put("/testimonials/update/:_id", TestimonialsController.testimonialUpdate);
router.delete("/testimonials/delete/:_id", TestimonialsController.testimonialDelete);


module.exports = router;
