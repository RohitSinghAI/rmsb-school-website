const express = require("express");
const ProgramsCurriculumController = require("../../controllers/aboutController/programsCurriculumController");

const router = express.Router();

// CRUD ROUTES
router.post("/programsCurriculum/insert", ProgramsCurriculumController.insert);
router.get("/programsCurriculum/view", ProgramsCurriculumController.viewAll);
router.get("/programsCurriculum/view/type/:type", ProgramsCurriculumController.viewByType);
router.get("/programsCurriculum/view/:id", ProgramsCurriculumController.viewSingle);
router.put("/programsCurriculum/update/:id", ProgramsCurriculumController.update);
router.delete("/programsCurriculum/delete/:id", ProgramsCurriculumController.delete);

module.exports = router;
