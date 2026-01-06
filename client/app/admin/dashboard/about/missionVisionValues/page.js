"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";

import {
    useGetAllMissionVisionValuesQuery,
    useCreateMissionVisionValuesMutation,
    useUpdateMissionVisionValuesMutation,
    useDeleteMissionVisionValuesMutation,
} from "@/redux/features/about/missionVisionValuesApi";

export default function MissionVisionValuesPage() {
    const { data, isLoading } = useGetAllMissionVisionValuesQuery();

    // ✅ backend response safe
    const list = Array.isArray(data?.data) ? data.data : [];

    const [createMVV, { isLoading: creating }] =
        useCreateMissionVisionValuesMutation();
    const [updateMVV, { isLoading: updating }] =
        useUpdateMissionVisionValuesMutation();
    const [deleteMVV, { isLoading: deleting }] =
        useDeleteMissionVisionValuesMutation();

    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        content: "",
    });

    // ✏️ Edit
    const handleEdit = (item) => {
        setEditId(item._id);
        setForm({
            title: item.title,
            content: item.content,
        });
        setShowModal(true);
    };

    // ➕ Create / ✏️ Update
    const handleSubmit = async (e) => {
        e.preventDefault();

        const toastId = toast.loading(
            editId ? "Updating..." : "Creating..."
        );

        try {
            editId
                ? await updateMVV({ id: editId, data: form }).unwrap()
                : await createMVV(form).unwrap();

            toast.success("Success", { id: toastId });
            resetForm();
        } catch {
            toast.error("Something went wrong", { id: toastId });
        }
    };

    // ❌ Delete
    const handleDelete = async (id) => {
        if (!confirm("Delete this item?")) return;

        const toastId = toast.loading("Deleting...");
        try {
            await deleteMVV(id).unwrap();
            toast.success("Deleted", { id: toastId });
        } catch {
            toast.error("Delete failed", { id: toastId });
        }
    };

    const resetForm = () => {
        setForm({ title: "", content: "" });
        setEditId(null);
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white px-4 sm:px-6 lg:px-10 py-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">
                    Mission / Vision / Values
                </h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl shadow-lg"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add
                </button>
            </div>

            {isLoading && (
                <p className="text-gray-300">Loading content...</p>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-3">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={resetForm}
                            disabled={creating || updating}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl sm:text-2xl font-semibold mb-5">
                            {editId ? "Edit" : "Add"} Content
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                                placeholder="Title (Mission / Vision / Values)"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                required
                            />

                            <textarea
                                rows="5"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                                placeholder="Content"
                                value={form.content}
                                onChange={(e) =>
                                    setForm({ ...form, content: e.target.value })
                                }
                                required
                            />

                            <button
                                type="submit"
                                disabled={creating || updating}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold disabled:opacity-50"
                            >
                                {creating || updating
                                    ? "Please wait..."
                                    : editId
                                        ? "Update"
                                        : "Save"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                {list.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl hover:scale-[1.02] transition"
                    >
                        <h3 className="font-semibold text-lg text-indigo-400">
                            {item.title}
                        </h3>

                        <p className="text-sm text-gray-300 mt-2 line-clamp-5">
                            {item.content}
                        </p>

                        <div className="flex justify-end gap-4 mt-5">
                            <button
                                onClick={() => handleEdit(item)}
                                className="text-indigo-400 hover:text-indigo-300"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>

                            <button
                                disabled={deleting}
                                onClick={() => handleDelete(item._id)}
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
