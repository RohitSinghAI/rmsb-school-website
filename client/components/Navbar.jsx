"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useGetAdminProfileQuery } from "@/redux/features/adminAuth/adminAuthApi";
import { useGetNavbarQuery } from "@/redux/features/navbar/page";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* AUTH */
  const { data, isLoading } = useGetAdminProfileQuery();
  const isLoggedIn = !!data?.user;

  /* NAVBAR DATA */
  const { data: navbarData } = useGetNavbarQuery();
  const navbar = navbarData?.navbar;
  const brand = navbar?.brand;

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/teachers", label: "Teachers" },
    { href: "/gallery", label: "Gallery" },
    { href: "/admission", label: "Admission" },
    { href: "/contact", label: "Contact" },
  ];

  /* MARQUEE */
  const marqueeItems =
    navbar?.marqueeItems?.filter(i => i.isActive).map(i => i.text) || [];

  /* SCROLL EFFECT (ONLY SHADOW) */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* CLOSE MOBILE MENU ON ROUTE CHANGE */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ===== NOTICE BAR ===== */}
      {marqueeItems.length > 0 && (
        <div className="fixed top-0 left-0 w-full z-50 bg-indigo-900 text-white">
          <div
            className="flex whitespace-nowrap py-2 text-[11px] sm:text-xs md:text-sm"
            style={{ animation: "marquee 18s linear infinite" }}
          >
            {[...Array(2)].map((_, i) => (
              <span key={i} className="mx-8">
                {marqueeItems.map((item, idx) => (
                  <span key={idx} className="mx-2">
                    {item} •
                  </span>
                ))}
              </span>
            ))}
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

      {/* ===== NAVBAR ===== */}
      <header
        className={`fixed left-0 w-full z-40 bg-[#fdfcf9] transition-shadow
          ${marqueeItems.length ? "top-[32px]" : "top-0"}
          ${scrolled ? "shadow-md" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* BRAND */}
          <Link href={brand?.href || "/"} className="flex items-center gap-3">
            {brand?.logoImage?.url ? (
              <img
                src={brand.logoImage.url}
                alt={brand?.title}
                className="w-11 h-11 rounded-full bg-[#fdfcf9] object-contain"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {brand?.logoText || "S"}
              </div>
            )}

            <div className="leading-tight">
              <h1 className="text-sm sm:text-base font-semibold text-gray-800">
                {brand?.title || "School Name"}
              </h1>
              <p className="text-xs text-gray-500">
                {brand?.subtitle || "Excellence in Education"}
              </p>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition ${active
                      ? "text-indigo-600"
                      : "text-gray-700 hover:text-indigo-600"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {!isLoading && !isLoggedIn && (
              <Link
                href="/admin/login"
                className="ml-3 px-4 py-2 rounded-full text-sm border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
              >
                Login
              </Link>
            )}
          </nav>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden px-3 py-2 rounded border border-gray-300 text-gray-700"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-[#fdfcf9] border-t shadow-lg">
            <div className="px-6 py-6 space-y-4">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block ${pathname === link.href
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-700"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {!isLoading && !isLoggedIn && (
                <Link
                  href="/admin/login"
                  className="block text-indigo-600 font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* SAFE OFFSET */}
      <div className="h-[96px]" />
    </>
  );
}
