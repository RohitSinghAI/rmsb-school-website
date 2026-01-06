const express = require("express");
const JourneyTimelineController = require("../../controllers/aboutController/journeyTimelineController");

const router = express.Router();

// CRUD ROUTES
router.post("/journeyTimeline/insert", JourneyTimelineController.insert);
router.get("/journeyTimeline/view", JourneyTimelineController.viewAll);
router.get("/journeyTimeline/view/:id", JourneyTimelineController.viewSingle);
router.put("/journeyTimeline/update/:id", JourneyTimelineController.update);
router.delete("/journeyTimeline/delete/:id", JourneyTimelineController.delete);

module.exports = router;
