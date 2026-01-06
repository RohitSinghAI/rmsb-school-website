const express = require("express");
const ContactInfoController = require("../../controllers/contactController/contactInfoController");

const router = express.Router();

router.post("/contactInfo/insert", ContactInfoController.insert);
router.get("/contactInfo/view", ContactInfoController.viewAll);
router.get("/contactInfo/view/:id", ContactInfoController.viewSingle);
router.put("/contactInfo/update/:id", ContactInfoController.update);
router.delete("/contactInfo/delete/:id", ContactInfoController.delete);

module.exports = router;
