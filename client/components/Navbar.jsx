"use client";

import Link from "next/link";
import { useState } from "react";
import { useGetAdminProfileQuery } from "@/redux/features/adminAuth/adminAuthApi";
import { useGetNavbarQuery } from "@/redux/features/navbar/page";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetAdminProfileQuery();
  const isLoggedIn = !!data?.user;

  // 🔥 NAVBAR DATA FROM BACKEND
  const { data: navbarData } = useGetNavbarQuery();
  const navbar = navbarData?.navbar;

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/teachers", label: "Teachers" },
    { href: "/gallery", label: "Gallery" },
    { href: "/admission", label: "Admission" },
    { href: "/contact", label: "Contact" },
  ];

  // ⬇️ SAME STRUCTURE, JUST DYNAMIC
  const marqueeItems =
    navbar?.marqueeItems?.filter(item => item.isActive).map(item => item.text) || [];

  const brand = navbar?.brand;

  return (
    <>
      {/* 🔔 TOP NOTICE BAR (RESPONSIVE & CONTINUOUS) */}
      {marqueeItems.length > 0 && (
        <div className="w-full bg-indigo-700 text-white overflow-hidden">
          <div className="relative w-full overflow-hidden">
            <div
              className="flex whitespace-nowrap py-2 px-4 text-[11px] sm:text-xs md:text-sm"
              style={{ animation: "marquee 18s linear infinite" }}
            >
              {[...Array(2)].map((_, i) => (
                <span key={i} className="mx-8">
                  {marqueeItems.map((item, index) => (
                    <span key={index} className="mx-2">
                      {item} •
                    </span>
                  ))}
                </span>
              ))}
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
      )}

      {/* 🔹 NAVBAR */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">

          {/* Logo + Title */}
          {brand && (
            <Link
              href={brand.href || "/"}
              className="flex items-center gap-3"
            >
              {brand.logoImage?.url ? (
                <img
                  src={brand.logoImage.url}
                  alt="School Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain bg-white"
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {brand.logoText}
                </div>
              )}

              <div className="leading-tight">
                <h1 className="font-bold text-sm sm:text-base md:text-lg text-gray-800">
                  {brand.title}
                </h1>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                  {brand.subtitle}
                </p>
              </div>
            </Link>
          )}

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
