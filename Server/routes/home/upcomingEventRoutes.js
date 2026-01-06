const express = require("express");
const upcomingEventController = require("../../controllers/homeControllers/upcomingEventController");

const router = express.Router();

router.post("/upcomingEvent/create", upcomingEventController.createEvent);
router.get("/upcomingEvent/all", upcomingEventController.getAllEvents);
router.get("/upcomingEvent/:id", upcomingEventController.getEventById);
router.put("/upcomingEvent/update/:id", upcomingEventController.updateEvent);
router.delete("/upcomingEvent/delete/:id", upcomingEventController.deleteEvent);

module.exports = router;
