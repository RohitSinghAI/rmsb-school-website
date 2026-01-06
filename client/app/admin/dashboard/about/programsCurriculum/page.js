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
  useGetAllProgramsCurriculumQuery,
  useCreateProgramsCurriculumMutation,
  useUpdateProgramsCurriculumMutation,
  useDeleteProgramsCurriculumMutation,
} from "@/redux/features/about/programsCurriculumApi";

export default function ProgramsCurriculumPage() {
  const { data, isLoading } = useGetAllProgramsCurriculumQuery();

  const list = Array.isArray(data?.data)
    ? data.data
    : [];

  const [createItem, { isLoading: creating }] =
    useCreateProgramsCurriculumMutation();
  const [updateItem, { isLoading: updating }] =
    useUpdateProgramsCurriculumMutation();
  const [deleteItem, { isLoading: deleting }] =
    useDeleteProgramsCurriculumMutation();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "Program",
  });

  // ✏️ Edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      title: item.title,
      content: item.content,
      type: item.type,
    });
    setShowModal(true);
  };

  // ➕ Create / ✏️ Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(editId ? "Updating..." : "Creating...");
    try {
      editId
        ? await updateItem({ id: editId, data: form }).unwrap()
        : await createItem(form).unwrap();

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
      await deleteItem(id).unwrap();
      toast.success("Deleted", { id: toastId });
    } catch {
      toast.error("Delete failed", { id: toastId });
    }
  };

  const resetForm = () => {
    setForm({ title: "", content: "", type: "Program" });
    setEditId(null);
    setShowModal(false);
  };

  // 🔍 Filter
  const filteredList =
    filter === "All" ? list : list.filter((i) => i.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white px-4 sm:px-6 lg:px-10 py-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Programs & Curriculum
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2"
          >
            <option value="All">All</option>
            <option value="Program">Program</option>
            <option value="Curriculum">Curriculum</option>
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>

      {isLoading && <p className="text-gray-300">Loading...</p>}

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
              {editId ? "Edit" : "Add"} Item
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                placeholder="Title"
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

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
              >
                <option value="Program">Program</option>
                <option value="Curriculum">Curriculum</option>
              </select>

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
        {filteredList.map((item) => (
          <div
            key={item._id}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl hover:scale-[1.02] transition"
          >
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 mb-2">
              {item.type}
            </span>

            <h3 className="font-semibold text-lg">{item.title}</h3>

            <p className="text-sm text-gray-300 mt-2 line-clamp-4">
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
