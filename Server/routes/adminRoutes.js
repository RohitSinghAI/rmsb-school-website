const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/authController/AdminController");
const checkAuth = require("../middleware/checkAuth");

// ================= AUTH =================
router.post("/register", AdminController.register);
router.post("/login", AdminController.login);
router.post("/logout", checkAuth, AdminController.logout);

// ================= PROFILE =================
router.get("/profile", checkAuth, AdminController.profile);
router.put("/profile", checkAuth, AdminController.updateProfile);

// ================= SECURITY =================
router.post("/change-password", checkAuth, AdminController.changePassword);

// ================= DASHBOARD =================
router.get("/dashboard", checkAuth, AdminController.dashboard);

// ================= PASSWORD RESET =================
router.post("/forgot-password", AdminController.forgotPassword);
router.post("/reset-password", AdminController.resetPassword);

// ================= HOME ROUTES =================
const sliderRoute = require("./home/sliderRoute");
const schoolHighlightRoutes = require("./home/schoolHighlightRoutes");
const statsRoutes = require("./home/statsRoutes");
const upcomingEventRoutes = require("./home/upcomingEventRoutes");
const testimonialsRoutes = require("./home/testimonialsRoutes");

// ================= About ROUTES =================
const aboutUsRoutes = require("./about/aboutUsRoutes");
const principalRoutes = require("./about/principalRoutes");
const missionVisionValuesRoutes = require("./about/missionVisionValuesRoutes");
const journeyTimelineRoutes = require("./about/journeyTimelineRoutes");
const programsCurriculumRoutes = require("./about/programsCurriculumRoutes");
const  facilityRoutes= require("./about/facilityRoutes");


// ================= TEACHER / FACULTY ROUTES =================
const facultyRoutes = require("./teacher/facultyRoutes");

// ================= GALLERY / GALLERY ROUTES =================
const galleryRoutes = require("./galleryImages/galleryRoutes");

// ================= CONTACT ROUTES =================
const contactInfoRoutes = require("./contact/contactInfoRoutes");
const contactRoutes = require("./contact/contactRoutes");

// ================= USE ROUTES =================

// Home
router.use("/", sliderRoute);
router.use("/", statsRoutes);
router.use("/", schoolHighlightRoutes);
router.use("/", upcomingEventRoutes);
router.use("/", aboutUsRoutes);

// About
router.use("/", testimonialsRoutes);
router.use("/", principalRoutes);
router.use("/", missionVisionValuesRoutes);
router.use("/", journeyTimelineRoutes);
router.use("/", programsCurriculumRoutes)
router.use("/", facilityRoutes)

// Teacher
router.use("/", facultyRoutes);

// Gallery
router.use("/", galleryRoutes);

// Contact
router.use("/", contactInfoRoutes);
router.use("/", contactRoutes);


module.exports = router;
