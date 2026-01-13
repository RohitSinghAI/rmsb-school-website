const express = require("express");
const admissionController = require("../../controllers/admissionController/admissionController");

const router = express.Router();

/* ================= CREATE ADMISSION ================= */
router.post(
    "/createAdmission/create",
    admissionController.createAdmission
);

/* ================= GET ALL ADMISSIONS ================= */
router.get(
    "/getAllAdmissions/display",
    admissionController.getAllAdmissions
);

/* ================= GET SINGLE ADMISSION ================= */
router.get(
    "/getAdmissionById/view/:id",
    admissionController.getAdmissionById
);

/* ================= UPDATE FULL ADMISSION (STATUS + ALL FIELDS) ================= */
router.put(
    "/updateAdmission/update/:id",
    admissionController.updateAdmission
);

/* ================= APPROVE / REJECT ADMISSION (NEW ✅) ================= */
router.patch(
    "/updateAdmissionStatus/status/:id",
    admissionController.updateAdmissionStatus
);

/* ================= UPDATE / RE-UPLOAD DOCUMENTS ================= */
router.put(
    "/updateAdmissionDocuments/update/:id",
    admissionController.updateDocuments
);

/* ================= DELETE SINGLE DOCUMENT ================= */
router.delete(
    "/deleteAdmissionDocument/delete/:id/:field",
    admissionController.deleteDocument
);

/* ================= DELETE ADMISSION ================= */
router.delete(
    "/deleteAdmission/delete/:id",
    admissionController.deleteAdmission
);
/* ================= PROMOTE STUDENT (COPY → NEXT CLASS) ================= */
router.post(
    "/promoteAdmission/promote",
    admissionController.promoteStudent
);

module.exports = router;
