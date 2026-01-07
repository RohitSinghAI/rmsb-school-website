const express = require("express");
const NavbarController = require("../../controllers/navbarController/navbarController");
const router = express.Router();

router.post("/navbarCreate/create", NavbarController.navbarCreate);
router.put("/navbarUpdate/update/:_id", NavbarController.navbarUpdate);
router.get("/navbarDisplay/display", NavbarController.navbarDisplay);


module.exports = router;
