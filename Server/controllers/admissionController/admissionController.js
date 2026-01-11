const admissionModel = require("../../models/admission/Admission");
const cloudinary = require("cloudinary");
const sendEmail = require("../../utils/approveRejectEmail/sendEmail");
const navbarModel = require("../../models/navbar/navbar");


/* ================= CLOUDINARY CONFIG ================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class admissionController {
  /* ================= CREATE ADMISSION ================= */
  static createAdmission = async (req, res) => {
    try {
      const {
        studentName,
        dob,
        gender,
        classApplied,
        parentName,
        phone,
        email,
        address,
        visitDate,
        visitTime,
      } = req.body;

      if (
        !studentName ||
        !dob ||
        !gender ||
        !classApplied ||
        !parentName ||
        !phone ||
        !address
      ) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be filled",
        });
      }

      /* ✅ UPDATED CLASS VALIDATION */
      const allowedClasses = [
        "Nursery",
        "LKG",
        "UKG",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
      ];

      if (!allowedClasses.includes(classApplied)) {
        return res.status(400).json({
          success: false,
          message: "Invalid class selected",
        });
      }

      /* ========== STUDENT IMAGE ========== */
      let studentImage = { current: null, history: [] };

      if (req.files?.studentImage) {
        const upload = await cloudinary.uploader.upload(
          req.files.studentImage.tempFilePath,
          { folder: "admissions/student" }
        );

        studentImage.current = {
          url: upload.secure_url,
          public_id: upload.public_id,
          uploadedAt: new Date(),
        };
      }

      /* ========== DOCUMENTS ========== */
      const documents = {};

      if (req.files) {
        for (const field of [
          "birthCertificate",
          "reportCard",
          "transferCertificate",
        ]) {
          if (req.files[field]) {
            const upload = await cloudinary.uploader.upload(
              req.files[field].tempFilePath,
              { folder: "admissions/documents" }
            );

            documents[field] = {
              current: {
                url: upload.secure_url,
                public_id: upload.public_id,
                uploadedAt: new Date(),
              },
              history: [],
            };
          }
        }
      }
      const admission = await admissionModel.create({
        studentName,
        dob,
        gender,
        classApplied,
        parentName,
        phone,
        email,
        address,
        studentImage,
        documents,
        visitDate,
        visitTime,
        status: "pending",
      });

      res.status(201).json({
        success: true,
        message: "Admission submitted successfully",
        rollNumber: admission.rollNumber,
        data: admission,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /* ================= GET ALL ================= */
  static getAllAdmissions = async (req, res) => {
    try {
      const data = await admissionModel.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        total: data.length,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /* ================= GET SINGLE ================= */
  static getAdmissionById = async (req, res) => {
    try {
      const data = await admissionModel.findById(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Admission not found",
        });
      }

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /* ================= UPDATE FULL ADMISSION ================= */
  static updateAdmission = async (req, res) => {
    try {
      const {
        studentName,
        dob,
        gender,
        classApplied,
        parentName,
        phone,
        email,
        address,
        visitDate,
        visitTime,
        status,
      } = req.body;

      // ✅ status validation
      if (status && !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const admission = await admissionModel.findById(req.params.id);
      if (!admission) {
        return res.status(404).json({
          success: false,
          message: "Admission not found",
        });
      }

      /* ================= UPDATE FIELDS ================= */
      if (studentName !== undefined) admission.studentName = studentName;
      if (dob !== undefined) admission.dob = dob;
      if (gender !== undefined) admission.gender = gender;
      if (classApplied !== undefined) admission.classApplied = classApplied;
      if (parentName !== undefined) admission.parentName = parentName;
      if (phone !== undefined) admission.phone = phone;
      if (email !== undefined) admission.email = email;
      if (address !== undefined) admission.address = address;
      if (visitDate !== undefined) admission.visitDate = visitDate;
      if (visitTime !== undefined) admission.visitTime = visitTime;

      // ⭐ status update
      if (status !== undefined) {
        admission.status = status;
      }

      await admission.save();

      res.status(200).json({
        success: true,
        message: "Admission updated successfully",
        data: admission,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  /* ================= UPDATE DOCUMENTS ================= */
  static updateDocuments = async (req, res) => {
    try {
      const admission = await admissionModel.findById(req.params.id);
      if (!admission) {
        return res.status(404).json({
          success: false,
          message: "Admission not found",
        });
      }

      if (!req.files) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      for (const field of [
        "birthCertificate",
        "reportCard",
        "transferCertificate",
      ]) {
        if (req.files[field]) {
          const upload = await cloudinary.uploader.upload(
            req.files[field].tempFilePath,
            { folder: "admissions/documents" }
          );

          admission.documents[field] =
            admission.documents[field] || { history: [] };

          if (admission.documents[field].current) {
            admission.documents[field].history.push(
              admission.documents[field].current
            );
          }

          admission.documents[field].current = {
            url: upload.secure_url,
            public_id: upload.public_id,
            uploadedAt: new Date(),
          };
        }
      }

      admission.status = "pending";
      await admission.save();

      res.status(200).json({
        success: true,
        message: "Documents updated",
        data: admission,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /* ================= DELETE DOCUMENT ================= */
  static deleteDocument = async (req, res) => {
    try {
      const { id, field } = req.params;

      const admission = await admissionModel.findById(id);
      if (!admission || !admission.documents[field]?.current) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      await cloudinary.uploader.destroy(
        admission.documents[field].current.public_id
      );

      admission.documents[field].current = null;
      admission.status = "pending";
      await admission.save();

      res.status(200).json({
        success: true,
        message: "Document deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /* ================= DELETE ADMISSION ================= */
  static deleteAdmission = async (req, res) => {
    try {
      const admission = await admissionModel.findById(req.params.id);
      if (!admission) {
        return res.status(404).json({
          success: false,
          message: "Admission not found",
        });
      }

      if (admission.studentImage?.current?.public_id) {
        await cloudinary.uploader.destroy(
          admission.studentImage.current.public_id
        );
      }

      for (const key of [
        "birthCertificate",
        "reportCard",
        "transferCertificate",
      ]) {
        if (admission.documents[key]?.current?.public_id) {
          await cloudinary.uploader.destroy(
            admission.documents[key].current.public_id
          );
        }
      }

      await admission.deleteOne();

      res.status(200).json({
        success: true,
        message: "Admission deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  static updateAdmissionStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      /* ================= VALIDATION ================= */
      const allowedStatus = ["approved", "rejected", "pending"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid admission status",
        });
      }

      const admission = await admissionModel.findById(id);
      if (!admission) {
        return res.status(404).json({
          success: false,
          message: "Admission not found",
        });
      }

      // 🛑 Prevent double click / duplicate email
      if (admission.status === status) {
        return res.status(200).json({
          success: true,
          message: "Admission status already updated",
          data: admission,
        });
      }

      /* ================= STATUS UPDATE ================= */
      admission.status = status;

      // If rejected or pending → remove roll number
      if (status !== "approved") {
        admission.rollNumber = undefined;
      }

      // ✅ Save first (roll number generation happens here)
      await admission.save();

      /* ================= EMAIL CONTENT ================= */
      if (admission.email) {
        let subject = "";
        let bodyHtml = "";

        /* ========= APPROVED ========= */
        if (status === "approved") {
          subject = "🎉 Admission Approved";

          bodyHtml = `
            <p>Dear <strong>${admission.parentName}</strong>,</p>

            <p>
              We are delighted to inform you that the admission application
              for <strong>${admission.studentName}</strong> has been
              <span style="color:#16a34a;font-weight:700">APPROVED</span>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0"
              style="border-collapse:collapse;margin:22px 0;font-size:14px">
              <tr style="background:#f8fafc">
                <td style="border:1px solid #e5e7eb;padding:10px"><b>Student Name</b></td>
                <td style="border:1px solid #e5e7eb;padding:10px">
                  ${admission.studentName}
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #e5e7eb;padding:10px"><b>Class</b></td>
                <td style="border:1px solid #e5e7eb;padding:10px">
                  ${admission.classApplied}
                </td>
              </tr>
              <tr style="background:#f8fafc">
                <td style="border:1px solid #e5e7eb;padding:10px"><b>Roll Number</b></td>
                <td style="border:1px solid #e5e7eb;padding:10px;font-weight:700;color:#1d4ed8">
                  ${admission.rollNumber}
                </td>
              </tr>
            </table>

            <p>
              Kindly visit the school office to complete the remaining
              admission formalities within the given time.
            </p>

            <p style="margin-top:26px">
              Warm regards,<br/>
              <strong>Mr. Narendra Singh Kushwaha</strong><br/>
              <span style="color:#475569">Principal</span>
            </p>
          `;
        }

        /* ========= REJECTED ========= */
        if (status === "rejected") {
          subject = "Admission Status Update";

          bodyHtml = `
            <p>Dear <strong>${admission.parentName}</strong>,</p>

            <p>
              Thank you for your interest in our institution.
              After careful consideration, we regret to inform you that
              the admission application for
              <strong>${admission.studentName}</strong>
              could not be approved at this time.
            </p>

            <p>
              This decision was made after reviewing all admission
              criteria and available capacity.
            </p>

            <p>
              We sincerely appreciate your understanding and wish your
              child every success in future academic endeavors.
            </p>

            <p style="margin-top:26px">
              Sincerely,<br/>
              <strong>Shri Narendra Singh Kushwaha</strong><br/>
              <span style="color:#475569">Principal</span>
            </p>
          `;
        }

        /* ========= PENDING ========= */
        if (status === "pending") {
          subject = "Admission Under Review";

          bodyHtml = `
            <p>Dear <strong>${admission.parentName}</strong>,</p>

            <p>
              This is to inform you that the admission application for
              <strong>${admission.studentName}</strong> is currently
              <span style="color:#ca8a04;font-weight:700">UNDER REVIEW</span>.
            </p>

            <p>
              Our admission committee is carefully evaluating the
              application. You will be notified once a final decision
              is made.
            </p>

            <p>
              We appreciate your patience and cooperation.
            </p>

            <p style="margin-top:26px">
              Regards,<br/>
              <strong>Mr. Narendra Singh Kushwaha</strong><br/>
              <span style="color:#475569">Principal</span>
            </p>
          `;
        }

        // 🛑 Safety check
        if (subject && bodyHtml) {
          await sendEmail({
            to: admission.email,
            subject,
            bodyHtml,
          });
        }
      }

      /* ================= RESPONSE ================= */
      return res.status(200).json({
        success: true,
        message: `Admission ${status} successfully`,
        data: admission,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

}

module.exports = admissionController;
