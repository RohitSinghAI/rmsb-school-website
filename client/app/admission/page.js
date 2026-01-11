"use client";

import { useCreateAdmissionMutation } from "@/redux/features/admission/admissionApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdmissionPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [createAdmission, { isLoading }] = useCreateAdmissionMutation();

  /* ================= FILE STATE ================= */
  const [files, setFiles] = useState({
    studentImage: null,
    birthCertificate: null,
    reportCard: null,
    transferCertificate: null,
  });

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("admissionForm")
        : null;

    return saved
      ? JSON.parse(saved)
      : {
          studentName: "",
          dob: "",
          gender: "",
          classApplied: "",
          parentName: "",
          phone: "",
          email: "",
          address: "",
          visitDate: "",
          visitTime: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("admissionForm", JSON.stringify(form));
  }, [form]);

  const update = (k, v) => setForm({ ...form, [k]: v });

  /* ================= FILE VALIDATION ================= */
  const validateFile = (file) => {
    if (!file) return true;

    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG or PDF allowed");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be under 2MB");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    try {
      if (!files.birthCertificate) {
        return toast.error("Birth Certificate is required");
      }

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      await createAdmission(formData).unwrap();

      toast.success("Admission submitted successfully");
      setSubmitted(true);
      localStorage.removeItem("admissionForm");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen text-[#1c1c1c]">
      {/* HERO */}
      <section className="relative h-[70vh] md:h-[100vh] flex items-end md:items-center">
        <img
          src="/image.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative px-6 md:px-16 pb-16 max-w-3xl mx-auto md:text-center">
          <p className="uppercase tracking-[0.35em] text-white/70 text-sm">
            Admissions
          </p>
          <h1 className="mt-6 text-3xl md:text-5xl font-light text-white">
            Student Admission Application
          </h1>
        </div>
      </section>

      {/* FORM */}
      <section className="px-4 md:px-16 -mt-16 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-14">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-8">
            Step {step} of 4
          </p>

          {submitted ? (
            <div className="bg-green-50 p-10 rounded-xl text-green-800">
              <h3 className="text-xl font-medium">Admission Submitted</h3>
              <p className="mt-3 text-sm">
                Our team will contact you shortly.
              </p>
            </div>
          ) : (
            <>
              {/* STEP 1 */}
              {step === 1 && (
                <FormSection title="Student Information">
                  <Input
                    label="Student Name"
                    value={form.studentName}
                    onChange={(e) =>
                      update("studentName", e.target.value)
                    }
                  />
                  <Input
                    type="date"
                    label="Date of Birth"
                    value={form.dob}
                    onChange={(e) => update("dob", e.target.value)}
                  />

                  <Select
                    label="Gender"
                    value={form.gender}
                    onChange={(e) => update("gender", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>

                  {/* ✅ ONLY UPDATED PART */}
                  <Select
                    label="Class Applying For"
                    value={form.classApplied}
                    onChange={(e) =>
                      update("classApplied", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
                      <option key={c} value={String(c)}>
                        Class {c}
                      </option>
                    ))}
                  </Select>

                  <File
                    label="Student Photograph"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (validateFile(f))
                        setFiles({ ...files, studentImage: f });
                    }}
                  />
                </FormSection>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <FormSection title="Parent Information">
                  <Input
                    label="Parent Name"
                    value={form.parentName}
                    onChange={(e) =>
                      update("parentName", e.target.value)
                    }
                  />
                  <Input
                    label="Phone Number"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </FormSection>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <FormSection title="Address & Documents">
                  <textarea
                    rows="3"
                    className="w-full border-b py-3 bg-transparent md:col-span-2"
                    placeholder="Full Address"
                    value={form.address}
                    onChange={(e) =>
                      update("address", e.target.value)
                    }
                  />

                  <File
                    label="Birth Certificate (Required)"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (validateFile(f))
                        setFiles({ ...files, birthCertificate: f });
                    }}
                  />

                  <File
                    label="Previous Report Card"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (validateFile(f))
                        setFiles({ ...files, reportCard: f });
                    }}
                  />

                  <File
                    label="Transfer Certificate"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (validateFile(f))
                        setFiles({
                          ...files,
                          transferCertificate: f,
                        });
                    }}
                  />
                </FormSection>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <FormSection title="Visit Appointment & Review">
                  <Input
                    type="date"
                    label="Preferred Visit Date"
                    value={form.visitDate}
                    onChange={(e) =>
                      update("visitDate", e.target.value)
                    }
                  />
                  <Input
                    type="time"
                    label="Preferred Time"
                    value={form.visitTime}
                    onChange={(e) =>
                      update("visitTime", e.target.value)
                    }
                  />
                </FormSection>
              )}

              {/* ACTIONS */}
              <div className="flex justify-between pt-10">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="text-sm"
                  >
                    ← Back
                  </button>
                )}

                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="ml-auto px-8 py-3 bg-black text-white rounded-full"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={isLoading}
                    className="ml-auto px-8 py-3 bg-black text-white rounded-full"
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <div className="h-24" />
    </main>
  );
}

/* ================= UI COMPONENTS ================= */

const FormSection = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-light mb-8">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {children}
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs uppercase tracking-widest text-gray-500">
      {label}
    </label>
    <input
      {...props}
      className="w-full mt-3 border-b py-3 bg-transparent"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="text-xs uppercase tracking-widest text-gray-500">
      {label}
    </label>
    <select
      {...props}
      className="w-full mt-3 border-b py-3 bg-transparent"
    >
      {children}
    </select>
  </div>
);

const File = ({ label, onChange }) => (
  <div>
    <label className="text-xs uppercase tracking-widest text-gray-500">
      {label}
    </label>
    <input
      type="file"
      className="mt-3 text-sm"
      onChange={onChange}
    />
  </div>
);
