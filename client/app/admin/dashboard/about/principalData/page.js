"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    useCreatePrincipalMutation,
    useDeletePrincipalMutation,
    useGetAllPrincipalsQuery,
    useUpdatePrincipalMutation
} from "@/redux/features/about/principalApi";


import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";

export default function PrincipalPage() {
    const { data, isLoading } = useGetAllPrincipalsQuery();

    const [createPrincipal, { isLoading: creating }] =
        useCreatePrincipalMutation();
    const [updatePrincipal, { isLoading: updating }] =
        useUpdatePrincipalMutation();
    const [deletePrincipal, { isLoading: deleting }] =
        useDeletePrincipalMutation();

    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        title: "",
        designation: "",
        message: "",
        image: null,
    });

    // ✏️ EDIT
    const handleEdit = (p) => {
        setEditId(p._id);
        setForm({
            title: p.title,
            designation: p.designation,
            message: p.message,
            image: null,
        });
        setPreview(p.image?.url);
        setShowModal(true);
    };

    // ➕ CREATE / ✏️ UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("designation", form.designation);
        formData.append("message", form.message);
        if (form.image) formData.append("image", form.image);

        const toastId = toast.loading(
            editId ? "Updating principal..." : "Creating principal..."
        );

        try {
            editId
                ? await updatePrincipal({ id: editId, formData }).unwrap()
                : await createPrincipal(formData).unwrap();

            toast.success(
                editId ? "Principal updated successfully" : "Principal added successfully",
                { id: toastId }
            );
            resetForm();
        } catch (error) {
            toast.error("Something went wrong", { id: toastId });
        }
    };

    // ❌ DELETE
    const handleDelete = async (id) => {
        if (!confirm("Delete this principal?")) return;

        const toastId = toast.loading("Deleting principal...");
        try {
            await deletePrincipal(id).unwrap();
            toast.success("Principal deleted", { id: toastId });
        } catch {
            toast.error("Delete failed", { id: toastId });
        }
    };

    const resetForm = () => {
        setForm({ title: "", designation: "", message: "", image: null });
        setPreview(null);
        setEditId(null);
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold">Principal Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl shadow-lg"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Principal
                </button>
            </div>

            {/* PAGE LOADER */}
            {isLoading && (
                <div className="text-center text-gray-300">Loading principals...</div>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xl p-8 relative">
                        <button
                            onClick={resetForm}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            disabled={creating || updating}
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-semibold mb-6">
                            {editId ? "Edit Principal" : "Add Principal"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <input
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                required
                            />

                            <input
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                                placeholder="Designation"
                                value={form.designation}
                                onChange={(e) =>
                                    setForm({ ...form, designation: e.target.value })
                                }
                                required
                            />

                            <textarea
                                rows="4"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                                placeholder="Message"
                                value={form.message}
                                onChange={(e) =>
                                    setForm({ ...form, message: e.target.value })
                                }
                                required
                            />

                            {/* IMAGE */}
                            <div>
                                {preview && (
                                    <img
                                        src={preview}
                                        className="w-24 h-24 rounded-full object-cover mb-3 border"
                                    />
                                )}
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setForm({ ...form, image: file });
                                        setPreview(URL.createObjectURL(file));
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={creating || updating}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold disabled:opacity-50"
                            >
                                {creating || updating
                                    ? "Please wait..."
                                    : editId
                                        ? "Update Principal"
                                        : "Save Principal"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* LIST */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {!isLoading &&
                    data?.data?.map((p) => (
                        <div
                            key={p._id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:scale-[1.02] transition"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={p.image?.url}
                                    className="w-16 h-16 rounded-full object-cover border"
                                />
                                <div>
                                    <h3 className="font-semibold">{p.title}</h3>
                                    <p className="text-sm text-gray-400">
                                        {p.designation}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-300 mt-4 line-clamp-3">
                                {p.message}
                            </p>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={() => handleEdit(p)}
                                    className="text-indigo-400 hover:text-indigo-300"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>

                                <button
                                    disabled={deleting}
                                    onClick={() => handleDelete(p._id)}
                                    className="text-red-400 hover:text-red-300 disabled:opacity-50"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
