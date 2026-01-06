const express = require("express");
const statsController = require("../../controllers/homeControllers/statsController");

const router = express.Router();

router.post("/stats/create", statsController.createStat);
router.get("/stats/all", statsController.getAllStats);
router.get("/stats/:id", statsController.getStatById);
router.put("/stats/update/:id", statsController.updateStat);
router.delete("/stats/delete/:id", statsController.deleteStat);

module.exports = router;
