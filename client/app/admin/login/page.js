"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
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
      const res = await loginAdmin(formData).unwrap();

      // ❌ Safety check
      if (!res?.token) {
        toast.error("Login failed: token not received");
        return;
      }

      // ✅ Save token
      localStorage.setItem("adminToken", res.token);

      // ✅ Save admin info
      if (res?.user) {
        localStorage.setItem("adminInfo", JSON.stringify(res.user));
      }

      toast.success("Login successful");

      // ✅ Redirect
      router.replace("/admin/dashboard");

    } catch (err) {
      toast.error(err?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900">
            Admin Login
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to continue to dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md font-medium transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gray-900 hover:bg-black text-white"
            }`}
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="pb-6 text-center">
          <button
            onClick={() => router.push("/admin/forgotPassword")}
            className="text-sm text-gray-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

      </div>
    </div>
  );
}
