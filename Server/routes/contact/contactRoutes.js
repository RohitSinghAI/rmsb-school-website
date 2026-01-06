const express = require("express");
const ContactController = require("../../controllers/contactController/contactController");
const router = express.Router();

// Create contact (Contact Us form)
router.post("/contact/creat", ContactController.create);

// Get all contacts (Admin)
router.get("/contact/view", ContactController.getAll);

// Delete contact (Admin)
router.delete("/contact/delete/:id", ContactController.delete);

module.exports = router;
