"use client";

import { useGetAllFacultyQuery } from "@/redux/features/teacher/page";
import { useState } from "react";

const teachers = [
  {
    id: 1,
    name: "Dr. Anjali Sharma",
    subject: "Mathematics",
    experience: "12 Years",
    qualification: "PhD, M.Sc",
    image: "https://i.pravatar.cc/300?img=32",
    bio: "Expert in mathematics with strong focus on conceptual clarity and problem solving.",
  },
  {
    id: 2,
    name: "Mr. Rahul Verma",
    subject: "Physics",
    experience: "8 Years",
    qualification: "M.Sc, B.Ed",
    image: "https://i.pravatar.cc/300?img=12",
    bio: "Specializes in practical physics learning with real-life experiments.",
  },
  {
    id: 3,
    name: "Ms. Pooja Singh",
    subject: "English",
    experience: "10 Years",
    qualification: "M.A, B.Ed",
    image: "https://i.pravatar.cc/300?img=47",
    bio: "Focused on literature, communication skills, and creative writing.",
  },
  {
    id: 4,
    name: "Dr. Arjun Mehta",
    subject: "Computer Science",
    experience: "9 Years",
    qualification: "PhD, M.Tech",
    image: "https://i.pravatar.cc/300?img=68",
    bio: "Teaches programming, AI basics, and modern computer technologies.",
  },
];

export default function TeachersPage() {
  const [active, setActive] = useState(null);

  const { data: facultyData } = useGetAllFacultyQuery()
  const teachers = facultyData?.data || [];
  return (
    <main className="text-[#1c1c1c] min-h-screen">

      {/* FACULTY HERO */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-end md:items-center">
        <img
          src="/image.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative px-6 md:px-16 pb-16 max-w-3xl mx-auto md:text-center">
          <p className="uppercase tracking-[0.35em] text-white/70 text-sm">
            Faculty
          </p>

          <h1 className="mt-6 text-3xl md:text-5xl font-light text-white">
            Teachers Who Shape Futures
          </h1>

          {/* Added text below heading */}
          <p className="mt-6 text-white/80 text-sm md:text-base">
            Our educators are mentors and guides, dedicated to shaping
            confident learners and future leaders through knowledge,
            inspiration, and integrity.
          </p>
        </div>
      </section>

      {/* ================= TEACHERS SECTION (OLD STYLE) ================= */}
      <section className="px-6 md:px-20 py-28 bg-white">
        <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2">

          {teachers.map((t) => (
            <div
              key={t.id}
              onClick={() => setActive(t)}
              className="group bg-slate-50 rounded-3xl p-6 shadow hover:shadow-2xl transition cursor-pointer flex gap-6"
            >
              <img
                src={t.image?.url}
                alt={t.name}
                className="w-32 h-32 rounded-2xl object-cover group-hover:scale-105 transition"
              />

              <div>
                <h3 className="text-xl font-semibold group-hover:underline">
                  {t.name}
                </h3>
                <p className="text-sm text-gray-500">{t.subject}</p>

                <p className="mt-3 text-sm text-gray-600">
                  <strong>Experience:</strong> {t.experience}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Qualification:</strong> {t.department}
                </p>

                <span className="inline-block mt-4 text-sm font-medium underline underline-offset-4">
                  View Profile →
                </span>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ================= MODAL ================= */}
      {active && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-semibold">{active.name}</h3>
              <button
                onClick={() => setActive(null)}
                className="text-gray-500 hover:bg-gray-100 rounded-full px-3 py-1"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {active.subject}
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              {active.bio}
            </p>

            <div className="mt-6 text-sm text-gray-600 space-y-1">
              <p><strong>Experience:</strong> {active.experience}</p>
              <p><strong>Qualification:</strong> {active.department}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TEACHING APPROACH ================= */}
      <section className="px-6 md:px-20 py-28">
        <div className="max-w-6xl mx-auto">

          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Our Teaching Approach
            </h2>
            <p className="mt-5 text-gray-600 text-lg leading-relaxed">
              Our teachers follow a student-centered approach that focuses on
              understanding, application, and continuous improvement.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <div className="bg-white rounded-3xl p-8 shadow">
              <h3 className="text-xl font-semibold">Concept First Learning</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We emphasize strong fundamentals so students clearly understand
                concepts before moving to advanced topics.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow">
              <h3 className="text-xl font-semibold">Personal Attention</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Teachers closely monitor student progress and provide individual
                guidance wherever needed.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow">
              <h3 className="text-xl font-semibold">Practical Application</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Real-world examples, activities, and discussions help students
                connect learning with everyday life.
              </p>
            </div>
          </div>

        </div>
      </section>


    </main>
  );
}
