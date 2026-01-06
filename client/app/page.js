"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";
import Hero from "../components/home/Hero";
import { useGetAllSchoolHighlightsQuery } from "@/redux/features/home/schoolHighlightsApi";
import { useGetAllStatsQuery } from "@/redux/features/home/statsApi";
import { useGetAllFacultyQuery } from "@/redux/features/teacher/page";
import { useGetAllUpcomingEventsQuery } from "@/redux/features/home/upcomingEventApi";
import TestimonialsPage from "@/components/home/testimonials";
import { useGetAllGalleryQuery } from "@/redux/features/gallery/galleryImagesApi";



export default function HomePage() {
  const [courseFilter, setCourseFilter] = useState("All");

  {/* FEATURES DATA */ }
  const { data: highlightsData } = useGetAllSchoolHighlightsQuery()
  const highlights = highlightsData?.data || [];

  {/* FEATURES DATA */ }
  const { data: statsData } = useGetAllStatsQuery()
  const stats = statsData?.data || [];

  {/* FACULT DATA */ }
  const { data: facultyData } = useGetAllFacultyQuery()
  const faculty = facultyData?.data || [];

  {/* UPCOMINGEVENT DATA */ }
  const { data: UpcomingEventData } = useGetAllUpcomingEventsQuery()
  const events = UpcomingEventData?.data || [];

  // API call 
  const { data: galleryData } = useGetAllGalleryQuery();

  // ✅ FIXED: correct data
  const gallery = galleryData?.gallery || [];

  const faqs = [
    { q: "What is the admission process?", a: "Submit the online form, attend an assessment (if applicable), and complete document verification." },
    { q: "Do you provide transport?", a: "Yes — GPS-enabled buses on major routes. Safety-first policy with trained attendants." },
    { q: "Are meals provided?", a: "Nutritious mid-day meals and snack options — special diets handled on request." },
  ];

  return (
    <div className="">
      <Hero />
      {/* ================= HIGHLIGHTS ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-14">
            School Highlights
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <HighlightCard
                key={index}
                title={item.title}
                desc={item.desc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((stat, index) => (
            <Stat
              key={index}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </section>

      {/* TEACHERS */}
      <section className="mt-16 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-extrabold">Meet Our Faculty</h3>
          <p className="text-slate-500">Experienced educators committed to student success.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {faculty.map((f, i) => (
            <motion.div key={f.name} whileHover={{ y: -6 }} className="bg-white rounded-2xl p-4 text-center shadow">
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-md">
                <Image src={f.image?.url} alt={f.name} width={140} height={140} className="object-cover" />
              </div>
              <div className="mt-4 font-semibold">{f.name}</div>
              <div className="text-sm text-indigo-600">{f.subject}</div>
              <div className="text-xs text-slate-500 mt-2">{f.department}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EVENTS TIMELINE */}
      <section className="mt-16 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-extrabold">Upcoming Events</h3>
          <p className="text-slate-500">Mark your calendar for campus happenings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map(ev => (
            <motion.div key={ev.date} whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow">
              <div className="text-sm text-slate-500">{new Date(ev.date).toLocaleDateString()}</div>
              <h4 className="mt-2 font-semibold">{ev.title}</h4>
              <p className="text-sm text-slate-600 mt-2">{ev.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="mt-16 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-extrabold">Campus Gallery</h3>
          <p className="text-slate-500">
            Moments from classrooms, labs and events.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.slice(0, 4).map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="rounded-xl overflow-hidden shadow"
            >
              <div className="relative h-40">
                <img
                  src={img.images}
                  alt={`gallery-${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ + Admission CTA */}
      <section className="mt-16 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-extrabold">Frequently Asked Questions</h3>
            <div className="mt-4 space-y-3">
              {faqs.map((f, i) => (
                <details key={f.q} className="bg-white p-4 rounded-xl shadow">
                  <summary className="font-medium cursor-pointer">{f.q}</summary>
                  <div className="mt-2 text-sm text-slate-600">{f.a}</div>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-indigo-700 text-white rounded-2xl p-8 shadow">
            <h4 className="text-2xl font-extrabold">Ready to join?</h4>
            <p className="mt-2 text-indigo-100">Start your admission — 3 easy steps to enroll at RMSB Sch.</p>
            <ol className="mt-4 space-y-2 list-decimal list-inside text-indigo-100">
              <li>Fill online application</li>
              <li>Attend assessment / interview (if required)</li>
              <li>Confirm & submit documents</li>
            </ol>

            <a href="/admission" className="mt-6 inline-block bg-yellow-300 text-black px-6 py-3 rounded-full font-semibold">Apply Now</a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsPage />
    </div>
  );
}
function HighlightCard({ title, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
function Stat({ value, label }) {
  return (
    <div>
      <h3 className="text-4xl font-bold text-blue-600">{value}</h3>
      <p className="text-slate-600 mt-2 text-sm">{label}</p>
    </div>
  );
}

