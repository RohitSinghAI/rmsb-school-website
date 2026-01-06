"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useForgotPasswordMutation } from "@/redux/features/adminAuth/adminAuthApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      return toast.error("Email is required");
    }

    try {
      const res = await forgotPassword({ email: cleanEmail }).unwrap();
      toast.success("Reset link sent to your email");

      // 🔧 Dev only
      if (res?.resetToken) {
        console.log("RESET TOKEN 👉", res.resetToken);
      }

      setEmail("");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster position="top-right" />

      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-2 text-indigo-600">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your registered email to receive a reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              isLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
