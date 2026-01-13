"use client";

import {
    useGetAllAdmissionsQuery,
    useDeleteAdmissionMutation,
    useUpdateAdmissionDocumentsMutation,
    useUpdateAdmissionMutation,
    useUpdateAdmissionStatusMutation,
    usePromoteAdmissionMutation,
} from "@/redux/features/admission/admissionApi";

import { useGetNavbarQuery } from "@/redux/features/navbar/page";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { exportSingleAdmissionPDF } from "@/utils/exportSingleAdmissionPDF";
import { exportAllAdmissionsPDF } from "@/utils/exportAllAdmissionsPDF";

/* ================= FILE VALIDATION ================= */
const validateFile = (file) => {
    if (!file) return false;
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) {
        toast.error("Only JPG, PNG, PDF allowed");
        return false;
    }
    if (file.size > 2 * 1024 * 1024) {
        toast.error("Max file size 2MB");
        return false;
    }
    return true;
};

/* ================= DROPZONE ================= */
const Dropzone = ({ label, onFile }) => (
    <label className="flex flex-col items-center justify-center border border-dashed rounded-xl p-4 text-xs cursor-pointer bg-white hover:border-emerald-400">
        <span className="font-semibold">Upload {label}</span>
        <span className="text-gray-400">JPG / PNG / PDF</span>
        <input
            type="file"
            hidden
            onChange={(e) => {
                const file = e.target.files[0];
                if (validateFile(file)) onFile(file);
            }}
        />
    </label>
);

export default function AdminAdmissionPage() {
    const { data, isLoading: listLoading } = useGetAllAdmissionsQuery();
    const { data: navbarData } = useGetNavbarQuery();
    const navbar = navbarData?.navbar;

    const [updateAdmission, { isLoading: updateLoading }] = useUpdateAdmissionMutation();
    const [updateAdmissionStatus, { isLoading: statusLoading },] = useUpdateAdmissionStatusMutation();
    const [deleteAdmission] = useDeleteAdmissionMutation();
    const [updateDocuments] = useUpdateAdmissionDocumentsMutation();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [classFilter, setClassFilter] = useState("all");

    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);
    const [exportOpen, setExportOpen] = useState(false);

    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkClass, setBulkClass] = useState("");

    const [docFiles, setDocFiles] = useState({});
    const [docLoading, setDocLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(null);

    /* ================= PROMOTE ================= */
    const [promoteAdmission, { isLoading: promoteLoading }] = usePromoteAdmissionMutation();
    const [promote, setPromote] = useState(null);
    const [nextClass, setNextClass] = useState("");

    const admissions = data?.data || [];

    /* ================= FILTER ================= */
    const filtered = admissions.filter((a) => {
        const s = search.toLowerCase();
        return (
            (
                a.studentName?.toLowerCase().includes(s) ||
                a.phone?.includes(search) ||
                String(a.rollNumber || "").includes(search)
            ) &&
            (statusFilter === "all" || a.status === statusFilter) &&
            (classFilter === "all" || a.classApplied === classFilter)
        );
    });

    /* ================= ACTIONS ================= */
    const handlePDF = async (admission) => {
        try {
            setPdfLoading(admission._id);
            await new Promise((r) => setTimeout(r, 300));
            exportSingleAdmissionPDF(admission, navbar);
        } finally {
            setPdfLoading(null);
        }
    };

    const handleStatus = async (id, status) => {
        try {
            await updateAdmissionStatus({
                id,
                status,
            }).unwrap();

            toast.success(`Admission ${status} & email sent`);
        } catch (err) {
            console.error(err);
            toast.error("Action failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete admission?")) return;
        try {
            await deleteAdmission(id).unwrap();
            toast.success("Admission deleted");
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleDocumentUpdate = async () => {
        try {
            setDocLoading(true);
            const formData = new FormData();
            Object.entries(docFiles).forEach(([k, v]) =>
                formData.append(k, v)
            );
            await updateDocuments({ id: edit._id, data: formData }).unwrap();
            toast.success("Documents updated");
            setEdit(null);
            setDocFiles({});
        } catch {
            toast.error("Upload failed");
        } finally {
            setDocLoading(false);
        }
    };

    const handlePromote = async () => {
        if (!nextClass) {
            toast.error("Please select next class");
            return;
        }

        try {
            await promoteAdmission({
                id: promote._id,
                nextClass,
            }).unwrap();

            toast.success("Student promoted successfully");
            setPromote(null);
            setNextClass("");
        } catch (err) {
            console.error(err);
            toast.error("Promotion failed");
        }
    };
    const handleBulkPromote = async () => {
        if (!bulkClass) {
            toast.error("Please select next class");
            return;
        }

        try {
            await Promise.all(
                selectedIds.map((id) =>
                    promoteAdmission({
                        id,
                        nextClass: bulkClass,
                    }).unwrap()
                )
            );

            toast.success(
                `${selectedIds.length} students promoted successfully`
            );

            setSelectedIds([]);
            setBulkClass("");
        } catch (err) {
            console.error("BULK PROMOTE ERROR:", err);
            toast.error("Bulk promotion failed");
        }
    };

    if (listLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading admissions...
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* ================= FILTER BAR ================= */}
            <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                    placeholder="Search name / phone / roll"
                    className="border rounded px-3 py-2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border rounded px-3 py-2"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                >
                    <option value="all">All Classes</option>
                    {[...new Set(admissions.map(a => a.classApplied))].map(c => (
                        <option key={c}>{c}</option>
                    ))}
                </select>

                <select
                    className="border rounded px-3 py-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* ================= EXPORT BUTTON ================= */}
            <div className="flex justify-end mb-3">
                <button
                    onClick={() => setExportOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                    Download PDF
                </button>
            </div>
            {/* ================= Promote Selected ================= */}
            {selectedIds.length > 0 && (
                <div className="bg-yellow-300 p-4 m-4 rounded-xl shadow mb-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">

                    {/* COUNT */}
                    <div className="text-sm font-semibold text-center md:text-left">
                        Selected Students: {selectedIds.length}
                    </div>

                    {/* SELECT */}
                    <select
                        className="w-full md:w-auto border rounded px-3 py-2"
                        value={bulkClass}
                        onChange={(e) => setBulkClass(e.target.value)}
                    >
                        <option value="">Select Next Class</option>
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                    </select>

                    {/* BUTTON */}
                    <button
                        onClick={handleBulkPromote}
                        disabled={!bulkClass}
                        className={`w-full md:w-auto px-5 py-2 rounded text-white transition ${bulkClass
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Promote Selected
                    </button>

                </div>
            )}

            {/* ================= TABLE ================= */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-[1100px] w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>#</th>
                            <th className="p-4 text-center">
                                <input
                                    type="checkbox"
                                    checked={
                                        filtered.filter(a => a.status === "approved").length > 0 &&
                                        selectedIds.length ===
                                        filtered.filter(a => a.status === "approved").length
                                    }
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIds(
                                                filtered
                                                    .filter(a => a.status === "approved")
                                                    .map(a => a._id)
                                            );
                                        } else {
                                            setSelectedIds([]);
                                        }
                                    }}
                                />
                            </th>
                            <th className="p-4">Student</th>
                            <th>Class</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((a, index) => (
                            <tr key={a._id} className="border-t">
                                <td className="text-center font-semibold">
                                    {index + 1}
                                </td>
                                <td className="text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(a._id)}
                                        disabled={a.status !== "approved" || a.isPromoted}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedIds([...selectedIds, a._id]);
                                            } else {
                                                setSelectedIds(
                                                    selectedIds.filter((id) => id !== a._id)
                                                );
                                            }
                                        }}
                                    />
                                </td>

                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={a.studentImage?.current?.url || "/avatar.png"}
                                            className="w-10 h-10 rounded-full object-cover border"
                                            alt="student"
                                        />
                                        <div>
                                            <p className="font-semibold">{a.studentName}</p>
                                            <p className="text-xs text-gray-500">
                                                Roll: {a.rollNumber || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="text-center font-medium">{a.classApplied}</td>
                                <td className="text-center">{a.phone}</td>
                                <td className="text-center capitalize">{a.status}</td>

                                <td className="p-2">
                                    <div className="flex justify-center gap-2 flex-wrap">
                                        <Btn onClick={() => setView(a)}>View</Btn>
                                        <Btn gray onClick={() => setEdit(a)}>Docs</Btn>
                                        {/* PROMOTE BUTTON */}
                                        <Btn
                                            gray
                                            disabled={a.status !== "approved"}
                                            onClick={() => setPromote(a)}
                                        >
                                            Promote
                                        </Btn>
                                        <Btn gray onClick={() => handlePDF(a)}>
                                            {pdfLoading === a._id ? "Loading..." : "PDF"}
                                        </Btn>
                                        <Btn
                                            green
                                            disabled={a.status === "approved" || statusLoading}
                                            onClick={() => handleStatus(a._id, "approved")}
                                        >
                                            {statusLoading ? "..." : "✓"}
                                        </Btn>


                                        <Btn
                                            red
                                            disabled={a.status === "rejected" || statusLoading}
                                            onClick={() => handleStatus(a._id, "rejected")}
                                        >
                                            {statusLoading ? "..." : "✕"}
                                        </Btn>
                                        <Btn dark onClick={() => handleDelete(a._id)}>🗑</Btn>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= VIEW MODAL ================= */}
            {view && (
                <AdmissionViewModal
                    admission={view}
                    onClose={() => setView(null)}
                    onPDF={handlePDF}
                    pdfLoading={pdfLoading}
                />
            )}
            {/* ================= PROMOTE MODAL ================= */}
            {promote && (
                <Modal title="Promote Student" onClose={() => setPromote(null)}>
                    <p className="text-sm mb-3">
                        Promote <b>{promote.studentName}</b> from{" "}
                        <b>{promote.classApplied}</b>
                    </p>

                    <select
                        className="w-full border rounded p-2 mb-4"
                        value={nextClass}
                        onChange={(e) => setNextClass(e.target.value)}
                    >
                        <option value="">Select Next Class</option>
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                    </select>

                    <button
                        onClick={handlePromote}
                        className="w-full bg-emerald-600 text-white py-2 rounded"
                    >
                        Promote Student
                    </button>
                </Modal>
            )}
            {/* ================= EXPORT MODAL ================= */}
            {exportOpen && (
                <Modal title="Export Admissions PDF" onClose={() => setExportOpen(false)}>
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                exportAllAdmissionsPDF(filtered, navbar);
                                setExportOpen(false);
                            }}
                            className="w-full py-2 bg-indigo-600 text-white rounded"
                        >
                            Export Filtered Data ({filtered.length})
                        </button>

                        <button
                            onClick={() => {
                                exportAllAdmissionsPDF(admissions, navbar);
                                setExportOpen(false);
                            }}
                            className="w-full py-2 bg-emerald-600 text-white rounded"
                        >
                            Export All Admissions ({admissions.length})
                        </button>

                        <button
                            onClick={() => setExportOpen(false)}
                            className="w-full py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {/* ================= DOC MODAL ================= */}
            {edit && (
                <Modal title="Document Control" onClose={() => setEdit(null)}>
                    {["birthCertificate", "reportCard", "transferCertificate"].map((doc) => (
                        <div key={doc} className="mb-4">
                            <Dropzone
                                label={doc}
                                onFile={(file) =>
                                    setDocFiles({ ...docFiles, [doc]: file })
                                }
                            />
                        </div>
                    ))}

                    <button
                        onClick={handleDocumentUpdate}
                        disabled={docLoading}
                        className="w-full py-2 rounded bg-emerald-600 text-white"
                    >
                        {docLoading ? "Saving..." : "Save Documents"}
                    </button>
                </Modal>
            )}
        </div>
    );
}

/* ================= VIEW MODAL ================= */
const AdmissionViewModal = ({ admission, onClose, onPDF, pdfLoading }) => {
    const [editMode, setEditMode] = useState(false);
    const [data, setData] = useState(admission);

    const [updateAdmission, { isLoading: updateLoading }] =
        useUpdateAdmissionMutation();

    useEffect(() => {
        setData(admission);
    }, [admission]);

    const update = (k, v) =>
        setData((prev) => ({ ...prev, [k]: v }));

    const handleSave = async () => {
        try {
            await updateAdmission({
                id: data._id,
                data: {
                    studentName: data.studentName,
                    dob: data.dob,
                    gender: data.gender,
                    parentName: data.parentName,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                    visitDate: data.visitDate,
                    visitTime: data.visitTime,
                },
            }).unwrap();

            toast.success("Admission updated successfully");
            setEditMode(false);
            onClose();
        } catch {
            toast.error("Update failed");
        }
    };

    return (
        <Modal title="Full Admission Details" onClose={onClose}>

            {/* ===== HEADER ===== */}
            <div className="flex justify-between items-center mb-6">
                <div className="text-sm space-x-4">
                    <span>
                        Roll: <b>{data.rollNumber || "-"}</b>
                    </span>
                    <span>
                        Status:{" "}
                        <b className="capitalize">{data.status}</b>
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="px-3 py-1 bg-yellow-500 text-white text-xs rounded"
                    >
                        {editMode ? "Cancel Edit" : "Edit"}
                    </button>

                    <button
                        onClick={() => onPDF(data)}
                        className="px-3 py-1 bg-indigo-600 text-white text-xs rounded"
                    >
                        {pdfLoading === data._id
                            ? "Loading..."
                            : "Download PDF"}
                    </button>
                </div>
            </div>

            {/* ===== STUDENT INFO ===== */}
            <Section title="Student Information">
                <div className="flex gap-6 items-start">
                    {/* IMAGE */}
                    <div className="shrink-0">
                        <img
                            src={
                                data.studentImage?.current?.url ||
                                "/avatar.png"
                            }
                            alt="student"
                            className="w-32 h-32 rounded-lg object-cover border"
                        />
                    </div>

                    {/* DETAILS */}
                    <Grid>
                        <Input
                            label="Student Name"
                            value={data.studentName || ""}
                            disabled={!editMode}
                            onChange={(e) =>
                                update("studentName", e.target.value)
                            }
                        />

                        <Input
                            label="Class"
                            value={data.classApplied || ""}
                            disabled
                        />

                        <Input
                            label="Gender"
                            value={data.gender || ""}
                            disabled={!editMode}
                            onChange={(e) =>
                                update("gender", e.target.value)
                            }
                        />

                        <Input
                            type="date"
                            label="Date of Birth"
                            value={
                                data.dob
                                    ? data.dob.slice(0, 10)
                                    : ""
                            }
                            disabled={!editMode}
                            onChange={(e) =>
                                update("dob", e.target.value)
                            }
                        />
                    </Grid>
                </div>
            </Section>

            {/* ===== PARENT INFO ===== */}
            <Section title="Parent Information">
                <Grid>
                    <Input
                        label="Parent Name"
                        value={data.parentName || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                            update("parentName", e.target.value)
                        }
                    />

                    <Input
                        label="Phone"
                        value={data.phone || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                            update("phone", e.target.value)
                        }
                    />

                    <Input
                        label="Email"
                        value={data.email || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                            update("email", e.target.value)
                        }
                    />
                </Grid>
            </Section>

            {/* ===== ADDRESS ===== */}
            <Section title="Address">
                <textarea
                    rows="3"
                    className="w-full border rounded p-3 text-sm"
                    value={data.address || ""}
                    disabled={!editMode}
                    onChange={(e) =>
                        update("address", e.target.value)
                    }
                />
            </Section>

            {/* ===== VISIT ===== */}
            <Section title="Visit Appointment">
                <Grid>
                    <Input
                        type="date"
                        label="Visit Date"
                        value={data.visitDate || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                            update("visitDate", e.target.value)
                        }
                    />

                    <Input
                        type="time"
                        label="Visit Time"
                        value={data.visitTime || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                            update("visitTime", e.target.value)
                        }
                    />
                </Grid>
            </Section>

            {/* ===== DOCUMENTS ===== */}
            <Section title="Documents">
                {[
                    "birthCertificate",
                    "reportCard",
                    "transferCertificate",
                ].map((key) => {
                    const doc = data.documents?.[key]?.current;
                    return (
                        <div
                            key={key}
                            className="flex justify-between items-center bg-gray-50 p-3 rounded mb-2 text-sm"
                        >
                            <span className="capitalize">
                                {key.replace(/([A-Z])/g, " $1")}
                            </span>

                            {doc?.url ? (
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    View
                                </a>
                            ) : (
                                <span className="text-gray-400">
                                    Not Uploaded
                                </span>
                            )}
                        </div>
                    );
                })}
            </Section>

            {/* ===== SAVE BUTTON ===== */}
            {editMode && (
                <button
                    onClick={handleSave}
                    disabled={updateLoading}
                    className="w-full mt-4 py-2 bg-emerald-600 text-white rounded"
                >
                    {updateLoading ? "Saving..." : "Save Changes"}
                </button>
            )}
        </Modal>
    );
};

/* ================= UI HELPERS ================= */
const Btn = ({
    children,
    onClick,
    green,
    red,
    gray,
    dark,
    disabled,
}) => {
    const color = disabled
        ? "bg-gray-300 cursor-not-allowed"
        : green
            ? "bg-emerald-600 hover:bg-emerald-700"
            : red
                ? "bg-rose-600 hover:bg-rose-700"
                : gray
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : dark
                        ? "bg-gray-900 hover:bg-gray-800"
                        : "bg-blue-600 hover:bg-blue-700";

    return (
        <button
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            className={`px-3 py-1 text-xs text-white rounded transition ${color}`}
        >
            {children}
        </button>
    );
};


const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-[95%] md:w-[700px] p-6 rounded-xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} className="absolute top-3 right-3">✕</button>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {children}
        </div>
    </div>
);

const Section = ({ title, children }) => (
    <div className="mb-5">
        <h3 className="font-semibold mb-2">{title}</h3>
        {children}
    </div>
);

const Grid = ({ children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, ...props }) => (
    <div>
        <label className="text-xs text-gray-500">{label}</label>
        <input {...props} className="w-full border rounded p-2" />
    </div>
);
