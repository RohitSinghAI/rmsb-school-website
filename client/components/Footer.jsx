"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";

import { useGetNavbarQuery } from "@/redux/features/navbar/page";
import { useGetAllContactInfoQuery } from "@/redux/features/contact/contactInfoApi";

export default function Footer() {
  const { data: navbarData } = useGetNavbarQuery();
  const brand = navbarData?.navbar?.brand;

  const { data: contactData } = useGetAllContactInfoQuery();
  const contact = contactData?.data?.[0];

  return (
    <footer className="relative bg-gradient-to-br from-[#0b0f1a] via-[#0d1222] to-[#070a14] text-white pt-28 sm:pt-32 pb-14 overflow-hidden">

      {/* Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 blur-[160px]" />
      <div className="absolute top-40 -right-40 w-[400px] h-[400px] bg-purple-600/20 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Brand */}
            <div className="lg:col-span-5">
              <p className="uppercase tracking-[0.35em] text-xs text-indigo-300">
                {brand?.subtitle || "Education & Excellence"}
              </p>

              <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                {brand?.title || "RMSB School"}
              </h2>

              <p className="mt-6 text-slate-300 max-w-md leading-relaxed text-sm sm:text-base">
                Where innovation meets education, shaping future-ready leaders
                with global perspective.
              </p>

              {/* Socials */}
              <div className="flex gap-5 mt-10">
                {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
                  (Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      aria-label="Social link"
                      className="w-10 h-10 rounded-full bg-white/10 border border-white/20
                                 flex items-center justify-center
                                 hover:bg-indigo-600 hover:border-indigo-500
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 transition"
                    >
                      <Icon size={15} />
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-3">
              <h5 className="text-xs uppercase tracking-widest text-indigo-300 mb-6">
                Explore
              </h5>

              <ul className="space-y-4 text-sm text-slate-200">
                {[
                  ["About Us", "/about"],
                  ["Faculty", "/teachers"],
                  ["Gallery", "/gallery"],
                  ["Admissions", "/admission"],
                  ["Contact", "/contact"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="hover:text-indigo-400 transition relative after:absolute after:left-0 after:-bottom-1
                                 after:h-[1px] after:w-0 after:bg-indigo-400 hover:after:w-full after:transition-all"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-4">
              <h5 className="text-xs uppercase tracking-widest text-indigo-300 mb-6">
                Contact
              </h5>

              <ul className="space-y-6 text-sm text-slate-200">
                <li className="flex gap-4 items-start">
                  <HiLocationMarker className="text-indigo-400 text-xl shrink-0 mt-1" />
                  <span className="leading-relaxed">
                    {contact?.address || "School Address"}
                  </span>
                </li>

                <li className="flex gap-4 items-center">
                  <HiPhone className="text-indigo-400 text-xl shrink-0" />
                  <span>{contact?.phone || "+91 XXXXX XXXXX"}</span>
                </li>

                <li className="flex gap-4 items-center break-all">
                  <HiMail className="text-indigo-400 text-xl shrink-0" />
                  <span>{contact?.email || "info@school.com"}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 sm:mt-16 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {brand?.title || "RMSB School"}.
          All rights reserved.
        </div>

      </div>
    </footer>
  );
}
