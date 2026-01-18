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
      // console.log("FILES:", req.files); // 🔍 DEBUG
      const admission = await admissionModel.findById(req.params.id);
      if (!admission) {
        return res.status(404).json({
          success: false,
          message: "Admission not found",
        });
      }

      if (!req.files || Object.keys(req.files).length === 0) {
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
        const file = req.files[field];

        if (!file) continue;

        // 🔥 SAFETY: tempFilePath fallback
        const filePath = file.tempFilePath || file.path;

        if (!filePath) {
          return res.status(400).json({
            success: false,
            message: `Invalid file for ${field}`,
          });
        }

        console.log("Uploading:", field, filePath);

        const upload = await cloudinary.uploader.upload(filePath, {
          folder: "admissions/documents",
          resource_type: "auto", // ✅ pdf / image both
        });

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

      admission.status = "pending";
      await admission.save();

      return res.status(200).json({
        success: true,
        message: "Documents updated successfully",
        data: admission,
      });

    } catch (error) {
      console.error("DOCUMENT UPDATE ERROR:", error);
      return res.status(500).json({
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
  // static updateAdmissionStatus = async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { status } = req.body;

  //     /* ================= VALIDATION ================= */
  //     const allowedStatus = ["approved", "rejected", "pending"];
  //     if (!allowedStatus.includes(status)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid admission status",
  //       });
  //     }

  //     /* ================= FIND ADMISSION ================= */
  //     const admission = await admissionModel.findById(id);

  //     if (!admission) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Admission not found",
  //       });
  //     }

  //     // 🛑 Prevent duplicate update
  //     if (admission.status === status) {
  //       return res.status(200).json({
  //         success: true,
  //         message: "Admission status already updated",
  //         data: admission,
  //       });
  //     }

  //     /* ================= UPDATE STATUS ================= */
  //     admission.status = status;

  //     // If rejected or pending → remove roll number
  //     if (status !== "approved") {
  //       admission.rollNumber = undefined;
  //     }

  //     // ✅ Save first (important)
  //     await admission.save();

  //     /* ================= EMAIL (NON-BLOCKING) ================= */
  //     if (admission.email) {
  //       let subject = "";
  //       let bodyHtml = "";

  //       if (status === "approved") {
  //         subject = "🎉 Admission Approved";
  //         bodyHtml = `
  //         <p>Dear <strong>${admission.parentName}</strong>,</p>

  //         <p>
  //           We are pleased to inform you that the admission application
  //           for <strong>${admission.studentName}</strong> has been
  //           <span style="color:#16a34a;font-weight:700">APPROVED</span>.
  //         </p>

  //         <table width="100%" cellpadding="0" cellspacing="0"
  //           style="border-collapse:collapse;margin:22px 0;font-size:14px">
  //           <tr style="background:#f8fafc">
  //             <td style="border:1px solid #e5e7eb;padding:10px"><b>Student Name</b></td>
  //             <td style="border:1px solid #e5e7eb;padding:10px">${admission.studentName}</td>
  //           </tr>
  //           <tr>
  //             <td style="border:1px solid #e5e7eb;padding:10px"><b>Class</b></td>
  //             <td style="border:1px solid #e5e7eb;padding:10px">${admission.classApplied}</td>
  //           </tr>
  //           <tr style="background:#f8fafc">
  //             <td style="border:1px solid #e5e7eb;padding:10px"><b>Roll Number</b></td>
  //             <td style="border:1px solid #e5e7eb;padding:10px;font-weight:700;color:#1d4ed8">
  //               ${admission.rollNumber}
  //             </td>
  //           </tr>
  //         </table>

  //         <p>Please visit the school office to complete the remaining formalities.</p>

  //         <p style="margin-top:26px">
  //           Regards,<br/>
  //           <strong>Mr. Narendra Singh Kushwaha</strong><br/>
  //           <span style="color:#475569">Principal</span>
  //         </p>
  //       `;
  //       }

  //       if (status === "rejected") {
  //         subject = "Admission Status Update";
  //         bodyHtml = `
  //         <p>Dear <strong>${admission.parentName}</strong>,</p>

  //         <p>
  //           After careful review, we regret to inform you that the admission
  //           application for <strong>${admission.studentName}</strong>
  //           could not be approved at this time.
  //         </p>

  //         <p>
  //           We appreciate your interest and wish your child success ahead.
  //         </p>

  //         <p style="margin-top:26px">
  //           Sincerely,<br/>
  //           <strong>Mr. Narendra Singh Kushwaha</strong><br/>
  //           <span style="color:#475569">Principal</span>
  //         </p>
  //       `;
  //       }

  //       if (status === "pending") {
  //         subject = "Admission Under Review";
  //         bodyHtml = `
  //         <p>Dear <strong>${admission.parentName}</strong>,</p>

  //         <p>
  //           The admission application for
  //           <strong>${admission.studentName}</strong> is currently
  //           <span style="color:#ca8a04;font-weight:700">UNDER REVIEW</span>.
  //         </p>

  //         <p>You will be notified once a final decision is made.</p>

  //         <p style="margin-top:26px">
  //           Regards,<br/>
  //           <strong>Mr. Narendra Singh Kushwaha</strong><br/>
  //           <span style="color:#475569">Principal</span>
  //         </p>
  //       `;
  //       }

  //       // 🛑 EMAIL MUST NEVER BREAK API
  //       try {
  //         if (subject && bodyHtml) {
  //           await sendEmail({
  //             to: admission.email,
  //             subject,
  //             bodyHtml,
  //           });
  //         }
  //       } catch (emailError) {
  //         console.error("EMAIL ERROR:", emailError.message);
  //       }
  //     }

  //     /* ================= RESPONSE ================= */
  //     return res.status(200).json({
  //       success: true,
  //       message: `Admission ${status} successfully`,
  //       data: admission,
  //     });

  //   } catch (error) {
  //     console.error("UPDATE ADMISSION ERROR:", error.message);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Server error while updating admission",
  //     });
  //   }
  // };

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

      /* ================= FIND ADMISSION ================= */
      const admission = await admissionModel.findById(id);
      if (!admission) {
        return res.status(404).json({
          success: false,
          message: "Admission not found",
        });
      }

      /* ================= PREVENT DUPLICATE ================= */
      if (admission.status === status) {
        return res.status(200).json({
          success: true,
          message: "Admission status already updated",
          data: admission,
        });
      }

      /* ================= UPDATE STATUS ================= */
      admission.status = status;

      // pending / rejected → remove roll number
      if (status !== "approved") {
        admission.rollNumber = null;
      }

      // Save (roll number generated by schema if approved)
      await admission.save();

      /* ================= EMAIL ================= */
      if (admission.email) {
        let subject = "";
        let bodyHtml = "";

        /* ---------- APPROVED EMAIL ---------- */
        if (status === "approved") {
          subject = "Admission Status Update";

          bodyHtml = `
        <div style="
          max-width:620px;
          margin:30px auto;
          background:#ffffff;
          border-radius:12px;
          border:1px solid #e5e7eb;
          font-family:Arial,Helvetica,sans-serif;
          color:#1f2937">

          <div style="padding:32px">

            <p style="margin-top:0">
              Dear <strong>${admission.parentName}</strong>,
            </p>

            <p>
              The admission application for
              <strong>${admission.studentName}</strong>
              has been approved.
            </p>

            <div style="
              margin:24px 0;
              border:1px solid #e5e7eb;
              border-radius:8px;
              overflow:hidden">

              <div style="padding:12px 16px;background:#f9fafb">
                <strong>Student Name:</strong>
                ${admission.studentName}
              </div>

              <div style="padding:12px 16px">
                <strong>Class:</strong>
                ${admission.classApplied}
              </div>

              <div style="padding:14px 16px;background:#f1f5f9">
                <strong>Roll Number:</strong>
                <span style="
                  display:inline-block;
                  margin-left:6px;
                  padding:4px 12px;
                  background:#0f172a;
                  color:#ffffff;
                  border-radius:20px;
                  font-size:14px">
                  ${admission.rollNumber}
                </span>
              </div>
            </div>

            <p>
              Please visit the school office to complete the remaining admission
              formalities.
            </p>

            <p style="margin-top:28px">
              Regards,<br/>
              <strong>Mr. Narendra Singh Kushwaha</strong><br/>
              <span style="color:#6b7280">Principal</span>
            </p>

          </div>

          <div style="
            padding:14px;
            text-align:center;
            font-size:12px;
            color:#6b7280;
            background:#f9fafb">
            © ${new Date().getFullYear()} School Management System
          </div>
        </div>
        `;
        }

        /* ---------- REJECTED EMAIL ---------- */
        if (status === "rejected") {
          subject = "Admission Status Update";
          bodyHtml = `
        <div style="max-width:600px;margin:auto;background:#ffffff;
          padding:24px;border-radius:10px;font-family:Arial">
          <p>Dear <strong>${admission.parentName}</strong>,</p>
          <p>
            After careful review, the admission application for
            <strong>${admission.studentName}</strong>
            could not be approved.
          </p>
          <p>We wish you the best for the future.</p>
        </div>`;
        }

        /* ---------- PENDING EMAIL ---------- */
        if (status === "pending") {
          subject = "Admission Under Review";
          bodyHtml = `
        <div style="max-width:600px;margin:auto;background:#ffffff;
          padding:24px;border-radius:10px;font-family:Arial">
          <p>Dear <strong>${admission.parentName}</strong>,</p>
          <p>
            The admission application for
            <strong>${admission.studentName}</strong>
            is currently under review.
          </p>
          <p>You will be notified once a final decision is made.</p>
        </div>`;
        }

        // Non-blocking email
        if (subject && bodyHtml) {
          sendEmail({
            to: admission.email,
            subject,
            bodyHtml,
          }).catch(err =>
            console.error("EMAIL ERROR:", err.message)
          );
        }
      }

      /* ================= RESPONSE ================= */
      return res.status(200).json({
        success: true,
        message: `Admission ${status} successfully`,
        data: admission,
      });

    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Roll number conflict, please retry approval",
        });
      }

      console.error("UPDATE ADMISSION ERROR:", error.message);
      return res.status(500).json({
        success: false,
        message: "Server error while updating admission",
      });
    }
  };

  /* ================= PROMOTE STUDENT ================= */
  static promoteStudent = async (req, res) => {
    try {
      const { id, nextClass } = req.body;

      if (!id || !nextClass) {
        return res.status(400).json({
          success: false,
          message: "Student ID and next class are required",
        });
      }

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

      if (!allowedClasses.includes(nextClass)) {
        return res.status(400).json({
          success: false,
          message: "Invalid next class",
        });
      }

      const oldAdmission = await admissionModel.findById(id);
      if (!oldAdmission) {
        return res.status(404).json({
          success: false,
          message: "Admission not found",
        });
      }

      /* ================= CREATE NEW ADMISSION (COPY) ================= */
      const newAdmission = await admissionModel.create({
        studentName: oldAdmission.studentName,
        dob: oldAdmission.dob,
        gender: oldAdmission.gender,

        classApplied: nextClass,               // 🔥 NEW CLASS
        previousClass: oldAdmission.classApplied,
        promotedFrom: oldAdmission._id,
        isPromoted: true,

        parentName: oldAdmission.parentName,
        phone: oldAdmission.phone,
        email: oldAdmission.email,
        address: oldAdmission.address,

        studentImage: oldAdmission.studentImage,
        documents: oldAdmission.documents,

        visitDate: oldAdmission.visitDate,
        visitTime: oldAdmission.visitTime,

        status: "pending",                     // 🔥 fresh approval
      });

      return res.status(201).json({
        success: true,
        message: "Student promoted successfully",
        data: newAdmission,
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
