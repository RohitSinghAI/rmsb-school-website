"use client";

import { useGetAllGalleryQuery } from "@/redux/features/gallery/galleryImagesApi";
import { useState } from "react";

const categories = ["All", "Campus", "Events", "Sports", "Classrooms"];

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  // API call 
  const { data: galleryData, isLoading } = useGetAllGalleryQuery();

  // ✅ FIXED: correct data key + safe fallback
  const galleryImages = galleryData?.gallery || [];

  // ✅ FIXED: filtering logic
  const filtered =
    active === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === active);

  return (
    <main className="bg-[#f9fafb] text-[#1c1c1c] min-h-screen">

      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-end md:items-center">
        <img
          src="/image.jpg"
          alt="Gallery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative px-6 md:px-16 pb-16 md:pb-0 max-w-3xl mx-auto md:text-center">
          <p className="uppercase tracking-[0.35em] text-white/70 text-sm">
            Gallery
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl font-light text-white">
            Moments from Our Campus
          </h1>
          <p className="mt-6 text-white/80 text-lg">
            A simple look into learning, events, sports,
            and everyday school life.
          </p>
        </div>
      </section>

      {/* ================= CATEGORY TABS ================= */}
      <section className="px-6 md:px-16 mt-20">
        <div className="flex flex-wrap gap-6 justify-center text-sm uppercase tracking-widest text-gray-500">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`pb-2 transition ${active === cat
                  ? "text-black border-b-2 border-black"
                  : "hover:text-black"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ================= IMAGE GRID ================= */}
      <section className="px-6 md:px-16 mt-20 max-w-7xl mx-auto">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading gallery...</p>
        ) : (
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((img) => (
              <div
                key={img._id}
                onClick={() => setLightbox(img.images)}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden rounded-2xl shadow-md bg-white">
                  <img
                    src={img.images}
                    alt="Gallery"
                    className="w-full h-56 object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>

                <p className="mt-3 text-xs uppercase tracking-widest text-gray-500">
                  {img.category}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= LIGHTBOX ================= */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-6"
        >
          <img
            src={lightbox}
            alt="Preview"
            className="max-h-[90vh] rounded-3xl shadow-2xl"
          />
        </div>
      )}

      {/* ================= CTA ================= */}
      <section className="px-6 md:px-16 mt-32 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-12 md:p-16 text-center">
          <h3 className="text-3xl md:text-4xl font-light">
            Visit Our School
          </h3>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            See our campus, classrooms, and facilities in person.
          </p>

          <a
            href="/contact"
            className="inline-block mt-10 px-10 py-4 bg-[#1c1c1c] text-white rounded-full tracking-widest hover:bg-black transition"
          >
            Contact Admissions
          </a>
        </div>
      </section>

      <div className="h-24" />
    </main>
  );
}
