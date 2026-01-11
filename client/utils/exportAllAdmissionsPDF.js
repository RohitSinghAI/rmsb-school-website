import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportAllAdmissionsPDF = (admissions, navbar) => {
  const doc = new jsPDF("landscape");

  doc.setFontSize(16);
  doc.text(navbar?.schoolName || "School Admissions", 14, 15);
  doc.setFontSize(10);
  doc.text("All Admission Records", 14, 22);

  const rows = admissions.map((a, i) => ([
    i + 1,
    a.rollNumber || "-",
    a.studentName,
    a.classApplied,
    a.gender,
    a.phone,
    a.parentName,
    a.status,
    a.visitDate
      ? new Date(a.visitDate).toLocaleDateString()
      : "-"
  ]));

  /* ✅ IMPORTANT CHANGE HERE */
  autoTable(doc, {
    startY: 28,
    head: [[
      "#",
      "Roll No",
      "Student Name",
      "Class",
      "Gender",
      "Phone",
      "Parent",
      "Status",
      "Visit Date"
    ]],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [15, 118, 110] },
  });

  doc.save("All_Admissions.pdf");
};
