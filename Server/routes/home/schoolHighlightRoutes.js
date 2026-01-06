const express = require("express");
const schoolHighlightController = require("../../controllers/homeControllers/schoolHighlightsController");
const router = express.Router();

router.post("/schoolHighlight/create", schoolHighlightController.createHighlight);
router.get("/schoolHighlight/all", schoolHighlightController.getAllHighlights);
router.get("/schoolHighlight/:id", schoolHighlightController.getHighlightById);
router.put("/schoolHighlight/update/:id", schoolHighlightController.updateHighlight);
router.delete("/schoolHighlight/delete/:id", schoolHighlightController.deleteHighlight);

module.exports = router;
