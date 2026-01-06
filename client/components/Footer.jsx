"use client";

import { useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 800);
  }

  return (
    <footer
      className="bg-gradient-to-b from-slate-900 to-black text-white
                 pt-14 md:pt-16 pb-8 md:pb-10 overflow-x-hidden"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                   grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
      >
        {/* Brand */}
        <div>
          <h4 className="font-extrabold text-xl md:text-2xl tracking-wide">
            RMSB MISSION SCHOOL
          </h4>

          <p className="text-slate-400 mt-3 text-sm md:text-base leading-relaxed">
            Empowering students with world-class education and a nurturing
            learning environment.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="w-9 h-9 lg:w-10 lg:h-10
                             flex items-center justify-center
                             rounded-full bg-white/10
                             hover:bg-indigo-600 transition"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="font-semibold text-base md:text-lg mb-3">
            Quick Links
          </h5>

          <ul className="space-y-2 text-sm md:text-base text-slate-300">
            <li>
              <Link href="/about" className="hover:text-indigo-400">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/teachers" className="hover:text-indigo-400">
                Our Faculty
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-indigo-400">
                Events
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-indigo-400">
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        {/* Academics */}
        <div>
          <h5 className="font-semibold text-base md:text-lg mb-3">
            Academics
          </h5>

          <ul className="space-y-2 text-sm md:text-base text-slate-300">
            <li>
              <Link href="/admission" className="hover:text-indigo-400">
                Admissions
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-indigo-400">
                Courses
              </Link>
            </li>
            <li>
              <Link href="/scholarships" className="hover:text-indigo-400">
                Scholarships
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-indigo-400">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact + Newsletter */}
        <div>
          <h5 className="font-semibold text-base md:text-lg mb-3">
            Contact Us
          </h5>

          <ul className="space-y-3 text-sm md:text-base text-slate-300">
            <li className="flex items-start gap-2">
              <HiLocationMarker className="text-lg mt-0.5 shrink-0" />
              <span className="break-words">
                123 School Road, City
              </span>
            </li>

            <li className="flex items-center gap-2">
              <HiPhone className="text-lg shrink-0" />
              <span className="break-words">
                +91 98765 43210
              </span>
            </li>

            <li className="flex items-center gap-2">
              <HiMail className="text-lg shrink-0" />
              <span className="break-words">
                support@rmsbmissionschool.edu
              </span>
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-5">
            <h6 className="font-semibold text-sm md:text-base mb-2">
              Newsletter
            </h6>

            {subscribed ? (
              <div
                className="rounded-md bg-green-600/20
                           border border-green-600/30
                           p-3 text-sm text-green-200"
              >
                Thanks — you're subscribed!
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="mt-2 flex flex-col md:flex-col lg:flex-row gap-2"
              >
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 rounded-md bg-white/10
                             border border-white/20
                             w-full placeholder:text-slate-300
                             text-sm outline-none"
                />

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700
                             px-4 py-2 rounded-md
                             text-sm whitespace-nowrap"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t border-white/10 mt-10 pt-6
                   text-center text-xs sm:text-sm text-slate-500"
      >
        © {new Date().getFullYear()} RMSB MISSION SCHOOL — Crafted with ❤️ for
        future leaders.
      </div>
    </footer>
  );
}
