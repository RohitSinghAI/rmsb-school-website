"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useRegisterAdminMutation } from "../../../redux/features/adminAuth/adminAuthApi";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [registerAdmin, { isLoading }] = useRegisterAdminMutation();

  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return toast.error("All fields are required");
    }

    if (!strongPassword.test(form.password)) {
      return toast.error("Password must be strong");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await registerAdmin({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      toast.success("Registration successful");
      setTimeout(() => router.push("/admin/login"), 1200);
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9] px-4 sm:px-6">
      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {/* Header */}
        <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-4 sm:pb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading text-gray-900">
            Administrator Access
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Secure system registration
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-10 pb-6 sm:pb-8 space-y-4 sm:space-y-5"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 text-sm sm:text-base rounded-md border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 text-sm sm:text-base rounded-md border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm sm:text-base rounded-md border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-3 text-xs sm:text-sm text-gray-600"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPass ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm sm:text-base rounded-md border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-4 top-3 text-xs sm:text-sm text-gray-600"
            >
              {showConfirmPass ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md text-sm sm:text-base font-medium transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gray-900 hover:bg-black text-white"
            }`}
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="pb-5 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/admin/login")}
              className="text-gray-900 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
