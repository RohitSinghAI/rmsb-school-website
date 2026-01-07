"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";

import { useGetNavbarQuery } from "@/redux/features/navbar/page";
import { useGetAllContactInfoQuery } from "@/redux/features/contact/contactInfoApi";

export default function Footer() {
  const { data: navbarData } = useGetNavbarQuery();
  const brand = navbarData?.navbar?.brand;

  const { data: contactData } = useGetAllContactInfoQuery();
  const contact = contactData?.data?.[0];

  return (
    <footer className="relative bg-gradient-to-br from-[#0b0f1a] via-[#0d1222] to-[#070a14] text-white pt-32 pb-14 overflow-hidden">

      {/* Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 blur-[160px]" />
      <div className="absolute top-40 -right-40 w-[400px] h-[400px] bg-purple-600/20 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* GLASS CARD */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-16">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Brand */}
            <div className="lg:col-span-5">
              <p className="uppercase tracking-[0.4em] text-xs text-indigo-300">
                {brand?.subtitle}
              </p>

              <h2 className="mt-6 text-4xl md:text-5xl font-semibold leading-tight">
                {brand?.title}
              </h2>

              <p className="mt-6 text-slate-300 max-w-md leading-relaxed">
                Where innovation meets education, shaping future-ready
                leaders with global perspective.
              </p>

              <div className="flex gap-6 mt-10">
                {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
                  (Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 rounded-full
                                 bg-white/10 border border-white/20
                                 flex items-center justify-center
                                 hover:bg-indigo-600 transition"
                    >
                      <Icon size={16} />
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
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/teachers">Faculty</Link></li>
                <li><Link href="/gallery">Gallery</Link></li>
                <li><Link href="/admission">Admissions</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-4">
              <h5 className="text-xs uppercase tracking-widest text-indigo-300 mb-6">
                Contact
              </h5>

              <ul className="space-y-6 text-sm text-slate-200">
                <li className="flex gap-4">
                  <HiLocationMarker className="text-indigo-400 text-xl shrink-0" />
                  <span>{contact?.address}</span>
                </li>

                <li className="flex gap-4 items-center">
                  <HiPhone className="text-indigo-400 text-xl shrink-0" />
                  <span>{contact?.phone}</span>
                </li>

                <li className="flex gap-4 items-center">
                  <HiMail className="text-indigo-400 text-xl shrink-0" />
                  <span>{contact?.email}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {brand?.title}. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
