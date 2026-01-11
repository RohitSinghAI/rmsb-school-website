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
  const HighlightCard = ({ title, desc }) => {
    return (
      <div className="group bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">

        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-2xl mb-6">
          📘
        </div>

        {/* Text */}
        <h3 className="text-xl font-semibold text-slate-800 mb-3">
          {title}
        </h3>

        <p className="text-slate-500 leading-relaxed text-sm">
          {desc}
        </p>

        {/* Divider */}
        <div className="mt-6 h-[2px] w-10 bg-blue-500 group-hover:w-20 transition-all duration-500"></div>
      </div>
    );
  };

  const Stat = ({ value, label }) => {
    return (
      <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500 to-blue-500 transition">

        <div className="rounded-2xl bg-white/95 backdrop-blur-xl px-4 sm:px-6 py-8 sm:py-10">

          {/* Value */}
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mb-2 group-hover:text-indigo-600 transition">
            {value}
          </h3>

          {/* Label */}
          <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-medium">
            {label}
          </p>

          {/* Accent */}
          <div className="mt-4 sm:mt-6 mx-auto h-1 w-8 sm:w-10 bg-indigo-600 group-hover:w-16 sm:group-hover:w-20 transition-all duration-500 rounded-full"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <Hero />
      {/* ================= HIGHLIGHTS ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
              School Highlights
            </h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              Empowering students with knowledge, values, and global exposure.
            </p>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {highlights.map((item, index) => (
              <HighlightCard key={index} title={item.title} desc={item.desc} />
            ))}
          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Title */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800">
              Our Achievements
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Numbers that reflect excellence in education
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 text-center">
            {stats.map((stat, index) => (
              <Stat
                key={index}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ================= FACULTY ================= */}
      <section className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Meet Our Faculty
          </h3>
          <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Experienced educators dedicated to nurturing excellence and values.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {faculty.map((f) => (
            <motion.div
              key={f._id}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-500"
            >

              {/* Image */}
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden ring-4 ring-indigo-50 group-hover:ring-indigo-200 transition">
                <Image
                  src={f.image?.url}
                  alt={f.name}
                  width={140}
                  height={140}
                  className="object-cover"
                />
              </div>

              {/* Name */}
              <h4 className="mt-5 text-lg font-semibold text-slate-800">
                {f.name}
              </h4>

              {/* Subject */}
              <p className="text-sm text-indigo-600 font-medium">
                {f.subject}
              </p>

              {/* Department */}
              <p className="text-xs text-slate-500 mt-2 tracking-wide uppercase">
                {f.department}
              </p>

            </motion.div>
          ))}
        </div>

      </section>
      {/* ================= EVENTS ================= */}
      <section className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Upcoming Events
          </h3>
          <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Mark your calendar for important campus activities and celebrations.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {events.map((ev, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="group relative bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500"
            >

              {/* Date Badge */}
              <div className="inline-block mb-4 rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-600">
                {new Date(ev.date).toLocaleDateString()}
              </div>

              {/* Title */}
              <h4 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                {ev.title}
              </h4>

              {/* Description */}
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {ev.description}
              </p>

              {/* Bottom Accent */}
              <div className="mt-5 h-[2px] w-8 bg-indigo-600 group-hover:w-16 transition-all duration-500"></div>

            </motion.div>
          ))}
        </div>

      </section>

      {/* ================= GALLERY ================= */}
      <section className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Campus Gallery
          </h3>
          <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Moments captured from classrooms, laboratories, and campus life.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {gallery.slice(0, 4).map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >

              {/* Image */}
              <div className="relative h-40 sm:h-48 md:h-52">
                <img
                  src={img.images}
                  alt={`gallery-${i}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>

              {/* View Label */}
              <div className="absolute bottom-3 left-3 text-xs text-white font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition">
                View Image
              </div>

            </motion.div>
          ))}
        </div>

      </section>

      {/* ================= FAQ + ADMISSION CTA ================= */}
      <section className="mt-20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* FAQ */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Frequently Asked Questions
            </h3>

            <div className="mt-6 space-y-4">
              {faqs.map((f, i) => (
                <details
                  key={i}
                  className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-800">
                    {f.q}
                    <span className="text-indigo-600 group-open:rotate-180 transition">
                      ▼
                    </span>
                  </summary>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Admission CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-900 p-8 sm:p-10 shadow-xl text-white">

            {/* Glow */}
            <div className="absolute -top-20 -right-20 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>

            <h4 className="text-2xl sm:text-3xl font-extrabold">
              Ready to Join?
            </h4>

            <p className="mt-3 text-indigo-100 max-w-md">
              Begin your admission journey with just three simple steps at RMSB School.
            </p>

            <ol className="mt-6 space-y-3 list-decimal list-inside text-indigo-100 text-sm">
              <li>Fill out the online application form</li>
              <li>Attend assessment or interview (if applicable)</li>
              <li>Confirm admission & submit documents</li>
            </ol>

            <a
              href="/admission"
              className="inline-flex items-center gap-2 mt-8 bg-yellow-300 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 transition shadow-lg"
            >
              Apply Now
              <span>→</span>
            </a>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsPage />
    </div>
  );
}


