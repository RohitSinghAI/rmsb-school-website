const express = require("express");
const FacilityController = require("../../controllers/aboutController/facilityController");

const router = express.Router();

// CRUD ROUTES
router.post("/facility/insert", FacilityController.insert);
router.get("/facility/view", FacilityController.viewAll);
router.get("/facility/view/:id", FacilityController.viewSingle);
router.put("/facility/update/:id", FacilityController.update);
router.delete("/facility/delete/:id", FacilityController.delete);

module.exports = router;
