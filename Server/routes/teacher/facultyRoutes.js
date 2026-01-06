const express = require("express");
const upload = require("../../middleware/multer");
const facultyController = require("../../controllers/teacherController/facultyController");

const router = express.Router();


router.post("/faculty/create", facultyController.createFaculty);
router.get("/faculty/all", facultyController.getAllFaculty);
router.get("/faculty/:id", facultyController.getFacultyById);
router.put("/faculty/update/:id", facultyController.updateFaculty);
router.delete("/faculty/delete/:id", facultyController.deleteFaculty);

module.exports = router;
