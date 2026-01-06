"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    useCreateGalleryMutation,
    useGetAllGalleryQuery,
    useUpdateGalleryMutation,
    useDeleteGalleryMutation,
} from "@/redux/features/gallery/galleryImagesApi";

const GalleryPage = () => {
    const { data, isLoading } = useGetAllGalleryQuery();
    const [createGallery] = useCreateGalleryMutation();
    const [updateGallery] = useUpdateGalleryMutation();
    const [deleteGallery] = useDeleteGalleryMutation();

    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [editId, setEditId] = useState(null);
    const [preview, setPreview] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const [uploading, setUploading] = useState(false);

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category) {
            toast.error("Please select category");
            return;
        }

        const formData = new FormData();
        formData.append("category", category);
        if (image) formData.append("image", image);

        try {
            setUploading(true);

            if (editId) {
                await updateGallery({ id: editId, data: formData }).unwrap();
                toast.success("Gallery image updated successfully");
                setEditId(null);
            } else {
                await createGallery(formData).unwrap();
                toast.success("Gallery image uploaded successfully");
            }

            setCategory("");
            setImage(null);
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setUploading(false);
        }
    };

    // ================= EDIT =================
    const handleEdit = (item) => {
        setEditId(item._id);
        setCategory(item.category);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this image?")) {
            try {
                await deleteGallery(id).unwrap();
                toast.success("Image deleted successfully");
            } catch {
                toast.error("Delete failed");
            }
        }
    };

    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${darkMode
                    ? "bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white"
                    : "bg-gradient-to-br from-slate-100 via-white to-slate-200 text-gray-900"
                } p-4 sm:p-6`}
        >
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto">

                {/* ===== HEADER ===== */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            🏫 School Gallery Management
                        </h1>
                        <p className="text-sm opacity-70">
                            Manage campus, classrooms, events & sports images
                        </p>
                    </div>

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition w-fit"
                    >
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>

                {/* ===== FORM ===== */}
                <div
                    className={`rounded-xl p-5 sm:p-6 mb-10 shadow-xl backdrop-blur-xl border transition ${darkMode
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-gray-200"
                        }`}
                >
                    <h2 className="text-lg font-semibold mb-4">
                        {editId ? "Update Gallery Image" : "Upload New Image"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        <select
                            value={category}
                            disabled={uploading}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded-lg px-4 py-2 border bg-transparent focus:outline-none"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Campus">Campus</option>
                            <option value="Classrooms">Classrooms</option>
                            <option value="Events">Events</option>
                            <option value="Sports">Sports</option>
                        </select>

                        <input
                            type="file"
                            disabled={uploading}
                            onChange={(e) => setImage(e.target.files[0])}
                            className="rounded-lg px-4 py-2 border bg-transparent"
                        />

                        <button
                            disabled={uploading}
                            className={`flex items-center justify-center gap-2 rounded-lg px-6 py-2 font-semibold text-white transition
                                ${uploading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105"
                                }
                            `}
                        >
                            {uploading && (
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            )}
                            {uploading
                                ? "Uploading..."
                                : editId
                                    ? "Update Image"
                                    : "Upload Image"}
                        </button>
                    </form>
                </div>

                {/* ===== GALLERY GRID ===== */}
                {isLoading ? (
                    <p className="text-center opacity-70">Loading gallery...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {data?.gallery?.length > 0 ? (
                            data.gallery.map((item) => (
                                <div
                                    key={item._id}
                                    className={`group rounded-xl overflow-hidden shadow-lg transition ${darkMode
                                            ? "bg-white/5 border border-white/10"
                                            : "bg-white border"
                                        }`}
                                >
                                    <img
                                        src={item.images}
                                        alt="School Gallery"
                                        className="h-48 w-full object-cover cursor-pointer group-hover:scale-110 transition duration-500"
                                        onClick={() => setPreview(item.images)}
                                    />

                                    <div className="p-4">
                                        <span className="text-xs font-medium text-indigo-500">
                                            {item.category}
                                        </span>

                                        <div className="flex justify-between mt-4">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-sm px-3 py-1 rounded bg-yellow-400/20 text-yellow-500 hover:bg-yellow-400/30"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="text-sm px-3 py-1 rounded bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center opacity-70">
                                No gallery images found
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* ===== IMAGE PREVIEW MODAL ===== */}
            {preview && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreview(null)}
                >
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
