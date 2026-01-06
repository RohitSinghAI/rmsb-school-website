"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGetAllPrincipalsQuery } from "@/redux/features/about/principalApi";
import { useGetAllAboutUsQuery } from "@/redux/features/about/aboutUsApi";
import { useGetAllMissionVisionValuesQuery } from "@/redux/features/about/missionVisionValuesApi";
import { useGetAllJourneyTimelineQuery } from "@/redux/features/about/journeyTimelineApi";
import { useGetAllProgramsCurriculumQuery } from "@/redux/features/about/programsCurriculumApi";
import { useGetAllFacultyQuery } from "@/redux/features/teacher/page";
import { useGetAllFacilitiesQuery } from "@/redux/features/about/facilityApi";
import { useGetAllStatsQuery } from "@/redux/features/home/statsApi";
import { useGetAllTestimonialsQuery } from "@/redux/features/home/testimonialApi";
import { useGetAllContactInfoQuery } from "@/redux/features/contact/contactInfoApi";

const FeatureCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-sm text-slate-600">{children}</p>
  </div>
);

export default function AboutPage() {
  const [activeImage, setActiveImage] = useState(null);

  // Principal
  const { data: principalData } = useGetAllPrincipalsQuery();
  const principal = Array.isArray(principalData?.data) ? principalData.data : [];

  // About Us
  const { data: aboutUsData } = useGetAllAboutUsQuery();
  const aboutUs = Array.isArray(aboutUsData?.aboutUs) ? aboutUsData.aboutUs : [];
  // MissionVisionValues
  const { data: missionVisionValuesData } = useGetAllMissionVisionValuesQuery();
  const missionVisionValues = Array.isArray(missionVisionValuesData?.data) ? missionVisionValuesData.data : [];
  // JourneyTimeline
  const { data: journeyTimelineData } = useGetAllJourneyTimelineQuery()
  const journeyTimeline = Array.isArray(journeyTimelineData?.data) ? journeyTimelineData.data : [];
  // ProgramsCurriculum
  const { data: programsCurriculumData } = useGetAllProgramsCurriculumQuery();
  const programsCurriculum = Array.isArray(programsCurriculumData?.data) ? programsCurriculumData.data : [];
  const programs = programsCurriculum.filter(
    (i) => i.type?.toLowerCase() === "program"
  );
  const curriculum = programsCurriculum.filter(
    (i) => i.type?.toLowerCase() === "curriculum"
  );
  // FACULT DATA
  const { data: facultyData } = useGetAllFacultyQuery()
  const faculty = facultyData?.data || [];
  // facility
  const { data: facility = [] } = useGetAllFacilitiesQuery();
  {/* StatDATA */ }
  const { data: statsData } = useGetAllStatsQuery()
  const stats = statsData?.data || [];
  {/* UPCOMINGEVENT DATA */ }
  const { data: testimonialsData } = useGetAllTestimonialsQuery()
  const testimonials = testimonialsData?.testimonials || [];
  {/* contact info */ }
  const { data: contactInfoData } = useGetAllContactInfoQuery()
  const contacts = contactInfoData?.data || [];
  // if (isLoading) return <p>Loading...</p>;
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[100vh] sm:min-h-[90vh] md:min-h-[85vh] overflow-hidden">

        {/* ================= BACKGROUND IMAGE ================= */}
        <img
          src="/image.jpg"
          alt="Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* ================= DARK OVERLAY ================= */}
        <div className="absolute inset-0 bg-black/60 sm:bg-black/50" />

        {/* ================= CONTENT ================= */}
        <div className="relative z-10 flex items-center min-h-[100vh] sm:min-h-[90vh] md:min-h-[85vh]">
          <div className="px-5 sm:px-8 md:px-16 lg:px-24 max-w-3xl">

            <p className="uppercase tracking-[0.35em] text-white/70 text-[11px] sm:text-xs">
              Welcome to Excellence
            </p>

            <h1 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-tight">
              Where Learning <br className="hidden sm:block" />
              Shapes the Future
            </h1>

            <p className="mt-5 sm:mt-6 md:mt-8 text-white/80 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl">
              An inspiring educational environment focused on academic excellence,
              character building, and global readiness.
            </p>

            {/* ================= CTA BUTTONS ================= */}
            <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <a
                href="/admission"
                className="text-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-white text-black tracking-widest text-sm sm:text-base hover:bg-gray-100 transition"
              >
                Apply Now
              </a>

              <a
                href="/about"
                className="text-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full border border-white/70 text-white tracking-widest text-sm sm:text-base hover:bg-white/10 transition"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* ================= SCROLL INDICATOR ================= */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-widest">
          SCROLL
        </div>

      </section>
      {/* ================= PRINCIPAL WELCOME ================= */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {principal.map((p) => (
            <div
              key={p._id}
              className="
          text-center
          border border-gray-200
          rounded-3xl
          px-6 sm:px-10 md:px-16
          py-12 md:py-16
        "
            >

              {/* IMAGE */}
              <div className="flex justify-center mb-8">
                <img
                  src={p.image?.url}
                  alt={p.title || 'Principal'}
                  className="
              w-[180px] h-[180px]
              sm:w-[220px] sm:h-[220px]
              object-cover
              rounded-full
              border-4 border-gray-100
            "
                />
              </div>

              {/* TITLE */}
              <p className="uppercase tracking-[0.35em] text-gray-400 text-xs mb-3">
                Principal’s Message
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900">
                {p.title}
              </h2>

              <p className="mt-1 text-gray-500 text-sm sm:text-base">
                {p.designation}
              </p>

              {/* MESSAGE */}
              <div className="mt-8 space-y-5 max-w-3xl mx-auto">
                {Array.isArray(p.message) ? (
                  p.message.map((line, i) => (
                    <p
                      key={i}
                      className="text-gray-600 leading-relaxed text-sm sm:text-base"
                    >
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {p.message}
                  </p>
                )}
              </div>

              {/* SIGNATURE */}
              <div className="mt-10 pt-6 border-t border-gray-200 max-w-sm mx-auto">
                <span className="block font-medium text-gray-900">
                  — {p.title}
                </span>
                <span className="block text-sm text-gray-500">
                  {p.designation}
                </span>
              </div>

            </div>
          ))}

        </div>
      </section>
      {/* ================= SCHOOL ABOUT ================= */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {aboutUs.map((item) => (
            <div
              key={item._id}
              className="grid md:grid-cols-2 gap-12 md:gap-16 items-start"
            >

              {/* LEFT IMAGE */}
              <div>
                <img
                  src={item.image?.url || item.image}
                  alt={item.title}
                  className="
              w-full
              h-[260px] sm:h-[300px] md:h-[340px]
              object-cover
              rounded-xl
              border border-gray-200
            "
                />
              </div>

              {/* RIGHT CONTENT */}
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
                  About the School
                </p>

                <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-6 leading-tight">
                  {item.title}
                </h2>

                {/* DESCRIPTION */}
                {Array.isArray(item.description) ? (
                  item.description.map((text, i) => (
                    <p
                      key={i}
                      className={`text-gray-600 leading-relaxed text-sm sm:text-base ${i !== item.description.length - 1 ? "mb-4" : ""
                        }`}
                    >
                      {text}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
                    {item.description}
                  </p>
                )}

                <div className="mt-8">
                  <a
                    href="/about"
                    className="inline-block text-sm font-medium text-gray-700 border-b border-gray-300 hover:text-gray-900 hover:border-gray-500 transition"
                  >
                    Read more about our institution
                  </a>
                </div>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-extrabold mb-6">
            Mission, Vision & Values
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {missionVisionValues.map((item, i) => (
              <FeatureCard key={i} title={item.title}>
                {item.content}
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / History */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-extrabold mb-6">
            Our Journey
          </h3>

          <div className="space-y-6">
            {journeyTimeline.map((item, index) => (
              <article
                key={index}
                className="bg-white rounded-lg p-6 shadow"
              >
                <h4 className="font-semibold mb-2">
                  {item.title}
                </h4>
                <p className="text-slate-700">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Programs & Curriculum */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900">
              Programs & Curriculum
            </h3>
            <p className="mt-4 text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our academic programs are designed to support intellectual,
              emotional and social development at every stage of learning.
            </p>
          </div>

          {/* Academic Programs */}
          <div className="mb-16">
            <h4 className="text-lg font-semibold text-slate-900 mb-8">
              Academic Programs
            </h4>

            <div className="grid md:grid-cols-3 gap-8">
              {programsCurriculum
                .filter(
                  (item) =>
                    item.type?.toLowerCase() === "program"
                )
                .map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg p-6 border border-slate-200"
                  >
                    <h5 className="text-base font-semibold text-slate-900 mb-3">
                      {item.title}
                    </h5>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Student Development */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-8">
              Student Development & Support
            </h4>

            <div className="grid md:grid-cols-2 gap-8">
              {programsCurriculum
                .filter(
                  (item) =>
                    item.type?.toLowerCase() === "curriculum"
                )
                .map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg p-6 border border-slate-200"
                  >
                    <h5 className="text-base font-semibold text-slate-900 mb-3">
                      {item.title}
                    </h5>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================= FACULTY & LEADERSHIP ================= */}
      <section className="py-16 md:py-24 to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Heading */}
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Faculty & Leadership
          </h3>

          <p className="text-slate-600 mb-14 max-w-3xl leading-relaxed text-sm sm:text-base">
            Our teachers are experienced educators dedicated to academic excellence,
            student mentorship, and holistic development.
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {faculty.map((f, index) => (
              <div
                key={index}
                className="
            bg-white
            border border-slate-200
            rounded-2xl
            p-6
            text-center
            transition
            hover:shadow-xl
          "
              >

                {/* FACE IMAGE */}
                <div className="flex justify-center -mt-16 mb-4">
                  <div
                    className="
                w-28 h-28
                sm:w-32 sm:h-32
                md:w-36 md:h-36
                rounded-full
                overflow-hidden
                bg-white
                shadow-lg
                ring-4 ring-white
              "
                  >
                    <img
                      src={f.image?.url}
                      alt={f.name}
                      className="
                  w-full h-full
                  object-cover
                  object-top
                "
                    />
                  </div>
                </div>

                {/* NAME */}
                <div className="mt-2 font-semibold text-slate-900 text-sm sm:text-base">
                  {f.name}
                </div>

                {/* DEPARTMENT */}
                <div className="text-sm text-indigo-600 mt-1 font-medium">
                  {f.department}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <h3 className="text-2xl font-semibold text-slate-900 mb-4">
            Facilities
          </h3>

          <p className="text-slate-600 mb-10 max-w-3xl leading-relaxed">
            Our campuses include modern science and computer labs, maker spaces,
            auditoriums, sports fields, swimming pools and dedicated arts studios.
            Safety and accessibility are core priorities.
          </p>

          {/* ================= FACILITY CARDS (TEXT ONLY) ================= */}
          <div className="grid md:grid-cols-3 gap-8">
            {facility
              ?.filter(item => item.title || item.content)
              .map((item, index) => (
                <FeatureCard key={index} title={item.title}>
                  {item.content}
                </FeatureCard>
              ))}
          </div>

          {/* ================= FACILITY IMAGES (IMAGE ONLY) ================= */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {facility
              ?.filter(item => item.image?.url)
              .map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden border border-slate-200"
                >
                  <img
                    src={item.image.url}
                    alt={item.title || "Facility Image"}
                    className="w-full h-64 object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              ))}
          </div>

        </div>
      </section>

      {/* Alumni & Outcomes */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <h3 className="text-2xl font-semibold text-slate-900 mb-4">
            Alumni & Outcomes
          </h3>

          <p className="text-slate-600 mb-10 max-w-3xl leading-relaxed">
            Our alumni pursue diverse pathways — top universities, creative industries,
            technology and public service. They remain connected through mentorship,
            internships and philanthropic partnerships.
          </p>

          {/* Statistics */}
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
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

      {/* student say */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <h3 className="text-2xl font-extrabold mb-6">
            What families & students say
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials
              ?.filter(t => t.status === "accepted")   // ✅ only approved
              .map((t, i) => (
                <figure
                  key={t._id || i}
                  className="bg-slate-50 rounded-lg p-6 shadow hover:shadow-md transition"
                >
                  <blockquote className="italic text-slate-700">
                    “{t.message}”
                  </blockquote>

                  <figcaption className="mt-4 font-semibold text-sm text-slate-900">
                    {t.name}
                  </figcaption>
                </figure>
              ))}
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Visit us or get in touch
          </h3>

          <p className="text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Schedule a campus tour, attend an open day or speak with our admissions
            team for personalised guidance.
          </p>

          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact._id}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10"
              >
                {/* Address Card */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
                  <h4 className="font-semibold text-slate-900">Address</h4>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {contact.address || "Address not available"}
                  </p>
                </div>

                {/* Phone Card */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
                  <h4 className="font-semibold text-slate-900">Phone</h4>
                  {contact.phone ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="block text-sm text-slate-600 mt-2 hover:text-slate-900"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-600 mt-2">
                      Phone not available
                    </p>
                  )}
                </div>

                {/* Email Card */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
                  <h4 className="font-semibold text-slate-900">Email</h4>
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="block text-sm text-slate-600 mt-2 hover:text-slate-900"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-600 mt-2">
                      Email not available
                    </p>
                  )}
                </div>

                {/* Map Button (optional) */}
                {contact.mapUrl && (
                  <div className="col-span-full text-center">
                    <a
                      href={contact.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-indigo-600 text-sm font-medium hover:underline"
                    >
                      View on Map →
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-500">Contact information not available</p>
          )}

        </div>
      </section>
    </main>
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
