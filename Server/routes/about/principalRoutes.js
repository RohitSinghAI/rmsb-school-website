const express = require("express");
const PrincipalController = require("../../controllers/aboutController/principalController");

const router = express.Router();

// CRUD ROUTES
router.post("/principal/insert", PrincipalController.createPrincipal);
router.get("/principal/view", PrincipalController.getAllPrincipals);
router.get("/principal/view/:id", PrincipalController.getSinglePrincipal);
router.put("/principal/update/:id", PrincipalController.updatePrincipal);
router.delete("/principal/delete/:id", PrincipalController.deletePrincipal);

module.exports = router;
