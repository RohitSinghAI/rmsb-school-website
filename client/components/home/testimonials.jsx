"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  useCreateTestimonialMutation,
  useGetAllTestimonialsQuery,
} from "@/redux/features/home/testimonialApi";

const ITEMS_PER_PAGE = 3;

export default function TestimonialsPage() {
  const { data, isLoading } = useGetAllTestimonialsQuery();
  const [createTestimonial, { isLoading: isCreating }] =
    useCreateTestimonialMutation();

  const testimonials =
    data?.testimonials?.filter((t) => t.status === "accepted") || [];

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = testimonials.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  /* ================= SUBMIT ================= */
  const addTestimonial = async (form) => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("message", form.message);
      if (form.image) formData.append("image", form.image);

      await createTestimonial(formData).unwrap();
      toast.success("Thank you! We will contact you shortly.");
      setPage(1);
      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit");
      return false;
    }
  };

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <main className="min-h-screen w-full px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-12 w-full">

        {/* GRID */}
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT */}
          <section className="w-full">
            <h2 className="text-2xl font-bold mb-6">
              Why Choose Our School
            </h2>

            {currentItems.length === 0 ? (
              <p className="text-gray-500">No testimonials yet.</p>
            ) : (
              <div className="space-y-4">
                {currentItems.map((t) => (
                  <div
                    key={t._id}
                    className="bg-white border rounded-lg p-5"
                  >
                    <p className="text-gray-700 break-words">
                      “{t.message}”
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      {t.image?.url ? (
                        <img
                          src={t.image.url}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={t.name}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                          {t.name?.[0]}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="font-semibold truncate">
                          {t.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {t.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-1 border rounded disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-1 border rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </section>

          {/* RIGHT – S SIZE SAFE */}
          <section className="w-full bg-white border rounded-lg p-6 md:sticky md:top-6 h-fit">
            <h2 className="text-xl font-bold mb-4">
              Fill the form and our team will contact you.
            </h2>
            <CreateForm onSubmit={addTestimonial} loading={isCreating} />
          </section>
        </div>

        {/* SLIDER */}
        {testimonials.length > 0 && (
          <section className="bg-white border rounded-lg p-6 w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              What Our Community Says
            </h2>
            <TestimonialSlider data={testimonials} />
          </section>
        )}
      </div>
    </main>
  );
}

/* ================= FORM ================= */

const CreateForm = ({ onSubmit, loading }) => {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    message: "",
    image: null,
  });

  const submit = async () => {
    if (loading) return;

    if (!form.name || !form.message) {
      toast.error("Name and message are required");
      return;
    }

    const success = await onSubmit(form);

    if (success) {
      setForm({
        name: "",
        role: "",
        message: "",
        image: null,
      });

      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 w-full">
      <input
        placeholder="Name *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />

      <input
        placeholder="Role"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />

      <textarea
        placeholder="Message *"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        rows={4}
        className="w-full border rounded px-3 py-2"
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="w-full"
        onChange={(e) =>
          setForm({ ...form, image: e.target.files[0] })
        }
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-indigo-700 text-white py-2 rounded disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

/* ================= SLIDER ================= */

const TestimonialSlider = ({ data }) => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || data.length === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % data.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [playing, data]);

  // Auto pause on mobile touch
  useEffect(() => {
    const stop = () => setPlaying(false);
    window.addEventListener("touchstart", stop);
    return () => window.removeEventListener("touchstart", stop);
  }, []);

  const t = data[index];

  return (
    <div className="text-center max-w-xl mx-auto w-full">
      <p className="italic text-gray-700 break-words">
        “{t.message}”
      </p>

      <div className="mt-4 font-semibold">
        {t.name}
        {t.role && (
          <span className="text-sm text-gray-500"> ({t.role})</span>
        )}
      </div>

      <button
        onClick={() => setPlaying((p) => !p)}
        className="mt-4 px-4 py-1 border rounded"
      >
        {playing ? "⏸️ Pause" : "▶️ Play"}
      </button>
    </div>
  );
};
