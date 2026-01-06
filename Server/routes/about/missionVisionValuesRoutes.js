const express = require("express");
const MissionVisionValuesController = require("../../controllers/aboutController/missionVisionValuesController");

const router = express.Router();

// CRUD ROUTES
router.post("/missionVisionValues/insert", MissionVisionValuesController.insert);
router.get("/missionVisionValues/view", MissionVisionValuesController.viewAll);
router.get("/missionVisionValues/view/:id", MissionVisionValuesController.viewSingle);
router.put("/missionVisionValues/update/:id", MissionVisionValuesController.update);
router.delete("/missionVisionValues/delete/:id", MissionVisionValuesController.delete);

module.exports = router;
