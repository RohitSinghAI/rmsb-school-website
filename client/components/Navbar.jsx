"use client";

import Link from "next/link";
import { useState } from "react";
import { useGetAdminProfileQuery } from "@/redux/features/adminAuth/adminAuthApi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetAdminProfileQuery();
  const isLoggedIn = !!data?.user;

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/teachers", label: "Teachers" },
    { href: "/gallery", label: "Gallery" },
    { href: "/admission", label: "Admission" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* 🔔 TOP NOTICE BAR (RESPONSIVE & CONTINUOUS) */}
      <div className="w-full bg-indigo-700 text-white overflow-hidden">
        <div className="relative w-full overflow-hidden">
          <div
            className="flex whitespace-nowrap py-2 px-4 text-[11px] sm:text-xs md:text-sm"
            style={{ animation: "marquee 18s linear infinite" }}
          >
            <span className="mx-8">
              📢 Admissions Open 2025 • 📚 Smart Classes • 🏫 Experienced Teachers • 🎓 Quality Education
            </span>
            <span className="mx-8">
              📢 Admissions Open 2025 • 📚 Smart Classes • 🏫 Experienced Teachers • 🎓 Quality Education
            </span>
          </div>
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}</style>
      </div>

      {/* 🔹 NAVBAR */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              S
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-sm sm:text-base md:text-lg text-gray-800">
                Stellar School
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                Management System
              </p>
            </div>
          </Link>

          {/* Desktop / Tablet Menu */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm lg:text-base text-gray-700 hover:text-indigo-600 font-medium"
              >
                {link.label}
              </Link>
            ))}

            {!isLoading && !isLoggedIn && (
              <>
                <Link
                  href="/admin/login"
                  className="px-3 lg:px-4 py-1.5 text-sm border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/admin/register"
                  className="px-3 lg:px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden border p-2 rounded text-lg"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-gray-700"
              >
                {link.label}
              </Link>
            ))}

            {!isLoading && !isLoggedIn && (
              <>
                <Link
                  href="/admin/login"
                  onClick={() => setOpen(false)}
                  className="block text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  href="/admin/register"
                  onClick={() => setOpen(false)}
                  className="block text-indigo-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
