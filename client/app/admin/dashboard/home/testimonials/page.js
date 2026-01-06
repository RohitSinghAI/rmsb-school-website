"use client";
import {
  useGetAllTestimonialsQuery,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} from "@/redux/features/home/testimonialApi";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

/* ================= DATE FORMAT ================= */
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function AdminTestimonialsPage() {
  const { data, isLoading } = useGetAllTestimonialsQuery();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [sort, setSort] = useState("new");

  if (isLoading) return <div className="p-10">Loading...</div>;

  let testimonials = [...(data?.testimonials || [])];

  testimonials.sort((a, b) =>
    sort === "new"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  const pending = testimonials.filter((t) => t.status === "pending");
  const accepted = testimonials.filter((t) => t.status === "accepted");
  const rejected = testimonials.filter((t) => t.status === "rejected");

  const updateStatus = async (id, status) => {
    try {
      const fd = new FormData();
      fd.append("status", status);
      await updateTestimonial({ id, formData: fd }).unwrap();
      toast.success(`Testimonial ${status}`);
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete testimonial?")) return;
    try {
      await deleteTestimonial(id).unwrap();
      toast.success("Testimonial deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 md:px-6 py-8">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <h1 className="text-2xl md:text-3xl font-bold">
            Testimonials – Admin Panel
          </h1>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-auto"
          >
            <option value="new">Newest First</option>
            <option value="old">Oldest First</option>
          </select>
        </div>

        <Section title="Pending Testimonials" color="orange">
          {pending.map((t) => (
            <Card
              key={t._id}
              t={t}
              onView={setViewItem}
              onEdit={setEditItem}
              onAccept={() => updateStatus(t._id, "accepted")}
              onReject={() => updateStatus(t._id, "rejected")}
              onDelete={handleDelete}
            />
          ))}
        </Section>

        <Section title="Accepted Testimonials" color="green">
          {accepted.map((t) => (
            <Card
              key={t._id}
              t={t}
              onView={setViewItem}
              onEdit={setEditItem}
              onReject={() => updateStatus(t._id, "rejected")}
              onDelete={handleDelete}
            />
          ))}
        </Section>

        <Section title="Rejected Testimonials" color="red">
          {rejected.map((t) => (
            <Card
              key={t._id}
              t={t}
              onView={setViewItem}
              onEdit={setEditItem}
              onAccept={() => updateStatus(t._id, "accepted")}
              onDelete={handleDelete}
            />
          ))}
        </Section>
      </div>

      {viewItem && <ViewModal t={viewItem} onClose={() => setViewItem(null)} />}
      {editItem && (
        <EditModal
          t={editItem}
          onClose={() => setEditItem(null)}
          onSave={updateTestimonial}
        />
      )}
    </main>
  );
}

/* ================= SECTION ================= */
const colors = {
  orange: "text-orange-600",
  green: "text-green-600",
  red: "text-red-600",
};

const Section = ({ title, color, children }) => (
  <section className="bg-white border rounded-lg p-4 md:p-6 space-y-4">
    <h2 className={`text-lg md:text-xl font-bold ${colors[color]}`}>
      {title}
    </h2>

    {children.length ? (
      <div className="space-y-4">{children}</div>
    ) : (
      <p className="text-gray-500">No data</p>
    )}
  </section>
);

/* ================= CARD ================= */
const Card = ({ t, onView, onEdit, onAccept, onReject, onDelete }) => (
  <div className="border rounded-lg p-4 space-y-4">
    {/* TOP CONTENT */}
    <div className="flex gap-4 min-w-0">
      <img
        src={t.image?.url}
        alt={t.name}
        className="w-14 h-14 rounded-full object-cover shrink-0"
      />

      <div className="min-w-0">
        <p className="font-semibold truncate">{t.name}</p>
        <p className="text-sm text-gray-500 truncate">{t.role}</p>
        <p className="text-xs text-gray-400">
          {formatDate(t.createdAt)}
        </p>

        {/* ✅ MESSAGE SHORT (MENU SAFE) */}
        <p
          title={t.message}
          className="text-sm mt-1 text-gray-700 truncate max-w-full"
        >
          {t.message}
        </p>
      </div>
    </div>

    {/* MENU / BUTTONS — BOTTOM RIGHT */}
    <div className="flex flex-wrap gap-2 justify-end">
      <button
        onClick={() => onView(t)}
        className="border px-3 py-2 rounded text-sm w-full sm:w-auto"
      >
        View
      </button>

      <button
        onClick={() => onEdit(t)}
        className="border px-3 py-2 rounded text-sm w-full sm:w-auto"
      >
        Edit
      </button>

      {onAccept && (
        <button
          onClick={onAccept}
          className="bg-green-600 text-white px-3 py-2 rounded text-sm w-full sm:w-auto"
        >
          Accept
        </button>
      )}

      {onReject && (
        <button
          onClick={onReject}
          className="bg-yellow-500 text-white px-3 py-2 rounded text-sm w-full sm:w-auto"
        >
          Reject
        </button>
      )}

      <button
        onClick={() => onDelete(t._id)}
        className="bg-red-600 text-white px-3 py-2 rounded text-sm w-full sm:w-auto"
      >
        Delete
      </button>
    </div>
  </div>
);

/* ================= VIEW MODAL ================= */
const ViewModal = ({ t, onClose }) => (
  <Modal onClose={onClose}>
    <img
      src={t.image?.url}
      className="w-24 h-24 rounded-full mx-auto object-cover"
    />
    <h3 className="text-xl font-bold text-center mt-4">{t.name}</h3>
    <p className="text-center text-sm text-gray-500">{t.role}</p>
    <p className="mt-4 text-center break-words">{t.message}</p>
  </Modal>
);

/* ================= EDIT MODAL ================= */
const EditModal = ({ t, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: t.name,
    role: t.role,
    message: t.message,
  });

  const save = async () => {
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      await onSave({ id: t._id, formData: fd }).unwrap();
      toast.success("Updated");
      onClose();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <Modal onClose={onClose}>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border w-full mb-2 px-3 py-2 rounded"
      />
      <input
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        className="border w-full mb-2 px-3 py-2 rounded"
      />
      <textarea
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="border w-full mb-4 px-3 py-2 rounded"
      />
      <button
        onClick={save}
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
      >
        Update
      </button>
    </Modal>
  );
};

/* ================= MODAL ================= */
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2">
    <div className="bg-white rounded-lg p-6 w-full max-w-[420px] relative">
      <button onClick={onClose} className="absolute top-2 right-3 text-xl">
        ✕
      </button>
      {children}
    </div>
  </div>
);
