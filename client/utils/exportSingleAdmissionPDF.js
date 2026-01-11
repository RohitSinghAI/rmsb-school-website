import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportSingleAdmissionPDF = (admission, navbar) => {
  const doc = new jsPDF("p", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  /* ================= BORDER ================= */
  doc.setLineWidth(0.8);
  doc.rect(10, 10, W - 20, H - 20);

  /* ================= HEADER ================= */
  if (navbar?.brand?.logoImage?.url) {
    try {
      doc.addImage(navbar.brand.logoImage.url, "PNG", W / 2 - 10, 14, 20, 20);
    } catch {}
  }

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text(navbar?.brand?.title || "SCHOOL NAME", W / 2, 42, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(
    navbar?.brand?.subtitle || "Affiliated to Education Board",
    W / 2,
    48,
    { align: "center" }
  );

  doc.setLineWidth(0.4);
  doc.line(25, 52, W - 25, 52);

  /* ================= TITLE ================= */
  doc.setFontSize(15);
  doc.setFont("times", "bold");
  doc.text("ADMISSION RECORD", W / 2, 62, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("times", "italic");
  doc.text("Academic Session Record", W / 2, 68, { align: "center" });

  /* ================= STUDENT PHOTO ================= */
  const pX = W - 55;
  const pY = 75;
  const pS = 28;

  doc.rect(pX, pY, pS, pS);

  if (admission?.studentImage?.current?.url) {
    try {
      doc.addImage(
        admission.studentImage.current.url,
        "JPEG",
        pX + 1,
        pY + 1,
        pS - 2,
        pS - 2
      );
    } catch {}
  } else {
    doc.setFontSize(8);
    doc.text("Photo", pX + 9, pY + 17);
  }

  /* ================= STUDENT INFO ================= */
  autoTable(doc, {
    startY: 75,
    margin: { right: 65, left: 25 },
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 55 },
    },
    body: [
      ["Student Name", admission.studentName || "-"],
      ["Roll Number", admission.rollNumber || "-"],
      ["Date of Birth", admission.dob ? new Date(admission.dob).toLocaleDateString() : "-"],
      ["Gender", admission.gender || "-"],
      ["Class Admitted", admission.classApplied || "-"],
      ["Parent / Guardian", admission.parentName || "-"],
      ["Contact Number", admission.phone || "-"],
      ["Email Address", admission.email || "-"],
      ["Residential Address", admission.address || "-"],
    ],
  });

  /* ================= ACADEMIC / DOCUMENT ================= */
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 8,
    margin: { left: 25, right: 25 },
    theme: "grid",
    styles: { fontSize: 9 },
    head: [["Category", "Information"]],
    body: [
      ["Admission Status", admission.status?.toUpperCase() || "-"],
      ["Birth Certificate", admission.documents?.birthCertificate?.current ? "Verified" : "Pending"],
      ["Report Card", admission.documents?.reportCard?.current ? "Verified" : "Pending"],
      ["Transfer Certificate", admission.documents?.transferCertificate?.current ? "Verified" : "Pending"],
      ["Visit Date", admission.visitDate ? new Date(admission.visitDate).toLocaleDateString() : "-"],
      ["Visit Time", admission.visitTime || "-"],
    ],
  });

  /* ================= DECLARATION ================= */
  const dY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(9);
  doc.setFont("times", "italic");
  doc.text(
    "This is to certify that the above student details are recorded as per the admission register of the school.",
    25,
    dY,
    { maxWidth: W - 50 }
  );

  /* ================= PRINCIPAL SIGN ================= */
  const sY = dY + 18;
  doc.line(W - 85, sY, W - 25, sY);

  doc.setFont("times", "bold");
  doc.text("Principal", W - 55, sY + 6, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("times", "normal");
  doc.text("Authorized Signature", W - 55, sY + 12, { align: "center" });

  /* ================= FOOTER ================= */
  doc.setFontSize(8);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString()}`,
    W / 2,
    H - 18,
    { align: "center" }
  );

  /* ================= SAVE ================= */
  doc.save(
    `Admission_Record_${(admission.studentName || "Student").replace(/\s+/g, "_")}.pdf`
  );
};
