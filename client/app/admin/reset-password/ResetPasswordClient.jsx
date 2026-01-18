"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useResetPasswordMutation } from "@/redux/features/adminAuth/adminAuthApi";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return toast.error("Invalid or expired reset link");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await resetPassword({ token, password }).unwrap();
      toast.success("Password reset successful");

      setTimeout(() => {
        router.replace("/admin/login");
      }, 1500);
    } catch (err) {
      toast.error(err?.data?.message || "Reset failed");
    }
  };

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600">
        Invalid or expired reset link
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
