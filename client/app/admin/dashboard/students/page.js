"use client";

import { useGetAllAdmissionsQuery } from "@/redux/features/admission/admissionApi";
import { useSearchParams } from "next/navigation";

export default function AdminStudentsPage() {
  const searchParams = useSearchParams();
  const selectedClass = searchParams.get("class");

  const { data, isLoading } = useGetAllAdmissionsQuery();
  const admissions = data?.data || [];

  /* ================= FILTER STUDENTS ================= */
  const students = admissions.filter(
    (a) =>
      a.status === "approved" &&
      (!selectedClass || a.classApplied === selectedClass)
  );

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading students...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Students List</h1>
          {selectedClass && (
            <p className="text-sm text-gray-500">
              Class: <b>{selectedClass}</b>
            </p>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Total Students: <b>{students.length}</b>
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-center">Class</th>
              <th className="p-3 text-center">Phone</th>
              <th className="p-3 text-center">Roll</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={s._id} className="border-t">
                <td className="p-3">{i + 1}</td>

                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.studentImage?.current?.url || "/avatar.png"}
                      className="w-9 h-9 rounded-full border object-cover"
                      alt="student"
                    />
                    <div>
                      <p className="font-semibold">{s.studentName}</p>
                      <p className="text-xs text-gray-500">
                        {s.gender || "—"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="text-center">{s.classApplied}</td>
                <td className="text-center">{s.phone}</td>
                <td className="text-center">
                  {s.rollNumber || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No students found for this class
          </div>
        )}
      </div>
    </div>
  );
}
