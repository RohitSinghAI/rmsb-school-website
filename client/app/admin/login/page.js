"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useLoginAdminMutation } from "../../../redux/features/adminAuth/adminAuthApi";

export default function AdminLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(formData).unwrap();
      toast.success("Login successful");
      setTimeout(() => router.push("/admin/dashboard"), 1200);
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9] px-4 sm:px-6">
      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {/* Header */}
        <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-4 sm:pb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading text-gray-900">
            Admin Login
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to continue to dashboard
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-10 pb-6 sm:pb-8 space-y-4 sm:space-y-5"
        >
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm sm:text-base rounded-md border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm sm:text-base rounded-md border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md text-sm sm:text-base font-medium transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gray-900 hover:bg-black text-white"
            }`}
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="pb-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/admin/register")}
              className="text-gray-900 font-medium hover:underline"
            >
              Register
            </button>
          </p>

          <p>
            <button
              onClick={() => router.push("/admin/forgot-password")}
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot Password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
