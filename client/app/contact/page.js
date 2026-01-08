"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useCreateContactMutation } from "@/redux/features/contact/contactApi";
import { useGetAllContactInfoQuery } from "@/redux/features/contact/contactInfoApi";

export default function ContactPage() {
  const { data } = useGetAllContactInfoQuery();
  const [createContact, { isLoading }] = useCreateContactMutation();

  const info = data?.data?.[0];

  const [showStreetView, setShowStreetView] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createContact(form).unwrap();
      toast.success("Enquiry submitted successfully");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="text-[#1c1c1c] min-h-screen overflow-x-hidden">

      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-end md:items-center">
        <img
          src="/image.jpg"
          alt="School Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative px-6 md:px-16 pb-16 md:pb-0 max-w-xl md:max-w-3xl mx-auto md:text-center">
          <p className="uppercase tracking-[0.35em] text-white/70 text-sm">
            Contact Us
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl font-light text-white break-words">
            School Administration Office
          </h1>
          <p className="mt-6 text-white/80 text-lg md:text-xl">
            Admissions, academics, and parent support.
          </p>
        </div>
      </section>

      {/* ================= INFO CARDS ================= */}
      <section className="px-6 md:px-16 -mt-16 relative z-10">
        <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
          <LuxuryInfo label="Campus Address" value={info?.address} />
          <LuxuryInfo label="Office Phone" value={info?.phone} />
          <LuxuryInfo label="Official Email" value={info?.email} />
        </div>
      </section>

      {/* ================= FORM + DESKTOP INFO ================= */}
      <section className="px-6 md:px-16 mt-24 max-w-7xl mx-auto">
        <div className="grid gap-20 md:grid-cols-2 items-start">

          {/* LEFT INFO (DESKTOP ONLY) */}
          <div className="hidden md:block space-y-12 pt-10">
            <h2 className="text-3xl font-light">
              We’re Here to Help
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our administration office assists parents and guardians
              with admissions, academics, and all school-related enquiries.
            </p>

            <LuxuryInfo
              label="Office Hours"
              value="Monday – Friday · 9:00 AM – 4:00 PM"
            />
          </div>

          {/* FORM */}
          <form
            onSubmit={submit}
            className="bg-white rounded-3xl shadow-xl p-10 md:p-14"
          >
            <h3 className="text-2xl md:text-3xl font-light mb-10">
              Admission & General Enquiry
            </h3>

            <LuxuryField
              label="Parent / Guardian Name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />

            <LuxuryField
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />

            <LuxuryField
              label="Contact Number"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />

            <div className="mt-8">
              <label className="text-xs uppercase tracking-widest text-gray-500">
                Message
              </label>
              <textarea
                rows="4"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                required
                inputMode="text"
                className="w-full mt-3 border-b border-gray-300 focus:border-black outline-none py-3 bg-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="mt-12 w-full py-4 bg-[#1c1c1c] text-white rounded-full tracking-widest hover:bg-black transition"
            >
              {isLoading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        </div>
      </section>

      {/* ================= MAP + STREET VIEW ================= */}
      <section className="mt-32 px-6 md:px-16">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-7xl mx-auto">

          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-light">Campus Location</h3>

            {info?.streetViewUrl && (
              <button
                onClick={() => setShowStreetView(!showStreetView)}
                className="text-sm uppercase tracking-widest text-gray-600 hover:text-black"
              >
                {showStreetView ? "View Map" : "Street View"}
              </button>
            )}
          </div>

          {info?.mapUrl ? (
            showStreetView && info?.streetViewUrl ? (
              <iframe
                src={info.streetViewUrl}
                className="w-full h-[420px] md:h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <iframe
                src={info.mapUrl}
                className="w-full h-[420px] md:h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )
          ) : (
            <div className="h-[420px] flex items-center justify-center text-gray-500">
              Map not available
            </div>
          )}

          <div className="flex justify-end gap-6 px-6 py-4 bg-gray-50">
            {info?.mapLink && (
              <a
                href={info.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-700 hover:text-black"
              >
                Open in Google Maps
              </a>
            )}

            {info?.streetViewUrl && (
              <a
                href={info.streetViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-700 hover:text-black"
              >
                Open Street View
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="h-24" />
    </main>
  );
}

/* ================= COMPONENTS ================= */

const LuxuryInfo = ({ label, value }) => (
  <div className="bg-white rounded-2xl shadow-md p-6">
    <p className="text-xs uppercase tracking-widest text-gray-500">
      {label}
    </p>
    <p className="mt-2 text-lg font-light break-words">
      {value || "—"}
    </p>
  </div>
);

const LuxuryField = ({ label, ...props }) => (
  <div className="mt-8">
    <label className="text-xs uppercase tracking-widest text-gray-500">
      {label}
    </label>
    <input
      {...props}
      required
      inputMode="text"
      className="w-full mt-3 border-b border-gray-300 focus:border-black outline-none py-3 bg-transparent"
    />
  </div>
);
