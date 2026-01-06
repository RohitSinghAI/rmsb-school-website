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
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  useGetAllFacilitiesQuery,
} from "@/redux/features/about/facilityApi";

export default function FacilityPage() {
  /* ================= API ================= */
  const { data: facilities = [], isLoading } = useGetAllFacilitiesQuery();

  // ✅ SAFE DATA EXTRACTION (ARRAY / OBJECT BOTH)
//   const facilities = Array.isArray(data)
//     ? data
//     : Array.isArray(data?.data)
//     ? data.data
//     : [];

  const [createFacility, { isLoading: creating }] =
    useCreateFacilityMutation();
  const [updateFacility, { isLoading: updating }] =
    useUpdateFacilityMutation();
  const [deleteFacility, { isLoading: deleting }] =
    useDeleteFacilityMutation();

  /* ================= STATE ================= */
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
  });

  /* ================= HANDLERS ================= */

  // ✏️ EDIT
  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      title: item.title || "",
      content: item.content || "",
      image: null, // important
    });
    setPreview(item.image?.url || null);
    setShowModal(true);
  };

  // ➕ CREATE / ✏️ UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ allow single image update
    if (!form.title && !form.content && !form.image) {
      toast.error("Please add image or text");
      return;
    }

    const formData = new FormData();
    if (form.title) formData.append("title", form.title);
    if (form.content) formData.append("content", form.content);
    if (form.image) formData.append("image", form.image);

    const toastId = toast.loading(
      editId ? "Updating facility..." : "Creating facility..."
    );

    try {
      if (editId) {
        await updateFacility({ id: editId, formData }).unwrap();
      } else {
        await createFacility(formData).unwrap();
      }

      toast.success("Success", { id: toastId });
      resetForm();
    } catch {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this facility?")) return;

    const toastId = toast.loading("Deleting...");
    try {
      await deleteFacility(id).unwrap();
      toast.success("Deleted", { id: toastId });
    } catch {
      toast.error("Delete failed", { id: toastId });
    }
  };

  const resetForm = () => {
    setForm({ title: "", content: "", image: null });
    setPreview(null);
    setEditId(null);
    setShowModal(false);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white px-4 sm:px-6 lg:px-10 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Facilities</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          Add Facility
        </button>
      </div>

      {/* LOADING */}
      {isLoading && (
        <p className="text-gray-300 text-center mt-10">Loading...</p>
      )}

      {/* EMPTY */}
      {!isLoading && facilities.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          No facilities found.
        </p>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-3">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold mb-2">
              {editId ? "Edit Facility" : "Add Facility"}
            </h2>

            {editId && (
              <p className="text-sm text-gray-400 mb-4">
                You can update only image, only text, or both.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                placeholder="Title (optional)"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <textarea
                rows="4"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                placeholder="Content (optional)"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
              />

              {/* IMAGE */}
              <div>
                {preview && (
                  <>
                    <img
                      src={preview}
                      className="w-full h-40 object-cover rounded-lg mb-2 border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setForm({ ...form, image: null });
                      }}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove image
                    </button>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
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
                  ? "Update"
                  : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {facilities.map((item) => (
          <div
            key={item._id}
            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >
            {item.image?.url && (
              <img
                src={item.image.url}
                className="w-full h-36 object-cover rounded-xl mb-3"
              />
            )}

            {item.title && (
              <h3 className="font-semibold text-lg">{item.title}</h3>
            )}

            {item.content && (
              <p className="text-sm text-gray-300 mt-1">
                {item.content}
              </p>
            )}

            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => handleEdit(item)}>
                <PencilIcon className="w-5 h-5 text-indigo-400" />
              </button>
              <button
                disabled={deleting}
                onClick={() => handleDelete(item._id)}
              >
                <TrashIcon className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
