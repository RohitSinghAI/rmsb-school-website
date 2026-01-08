"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangePasswordMutation,
} from "@/redux/features/adminAuth/adminAuthApi";

export default function AdminProfilePage() {
  const reduxAdmin = useSelector((state) => state.adminAuth.admin);

  const { data, isLoading } = useGetAdminProfileQuery();
  const admin = data?.user || reduxAdmin;

  const [updateProfile, { isLoading: updating }] =
    useUpdateAdminProfileMutation();

  const [changePassword, { isLoading: changing }] =
    useChangePasswordMutation();

  const [name, setName] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (admin?.name) setName(admin.name);
  }, [admin]);

  /* ================= UPDATE PROFILE ================= */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");

    try {
      await updateProfile({ name }).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error("All password fields are required");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      await changePassword({
        oldPassword: currentPassword,
        newPassword,
      }).unwrap();

      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
      setShowPassword(false);
    } catch (error) {
      toast.error(error?.data?.message || "Password change failed");
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Admin Profile
        </h1>
        <p className="text-sm text-gray-500">
          Manage your account information and security
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-slate-900 text-white
              flex items-center justify-center text-2xl font-semibold">
              {admin?.name?.charAt(0)?.toUpperCase()}
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              {admin?.name}
            </h2>

            <p className="text-sm text-gray-500 break-all">
              {admin?.email}
            </p>

            <span className="mt-2 inline-block px-3 py-1 text-xs rounded-full
              bg-slate-100 text-slate-700">
              Role: {admin?.role}
            </span>
          </div>

          <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-2">
            <p>
              <strong>Account ID:</strong><br />
              <span className="text-xs break-all">{admin?._id}</span>
            </p>

            <p>
              <strong>Created:</strong><br />
              {admin?.createdAt && new Date(admin.createdAt).toLocaleString()}
            </p>

            <p>
              <strong>Last Updated:</strong><br />
              {admin?.updatedAt && new Date(admin.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* UPDATE PROFILE */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Basic Information
            </h3>

            <form onSubmit={handleProfileUpdate} className="space-y-4">

              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email Address"
                value={admin?.email}
                disabled
              />

              <button
                type="submit"
                disabled={updating || name === admin?.name}
                className="w-full sm:w-auto px-6 py-2 bg-slate-900 text-white
                rounded-md hover:bg-slate-800 transition text-sm disabled:opacity-60"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* CHANGE PASSWORD */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
              <h3 className="text-lg font-semibold">Change Password</h3>

              {!showPasswordForm && (
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full sm:w-auto px-4 py-2 text-sm border border-red-600
                  text-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
                >
                  Change Password
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form
                onSubmit={handlePasswordChange}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <Input
                  label="Current Password"
                  type={showPassword ? "text" : "password"}
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, currentPassword: e.target.value })
                  }
                  showToggle
                  onToggle={() => setShowPassword(!showPassword)}
                />

                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  showToggle
                  onToggle={() => setShowPassword(!showPassword)}
                />

                <Input
                  label="Confirm New Password"
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                  }
                  showToggle
                  onToggle={() => setShowPassword(!showPassword)}
                />

                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={changing}
                    className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white
                    rounded-md hover:bg-red-700 transition text-sm disabled:opacity-60"
                  >
                    {changing ? "Updating..." : "Update Password"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setShowPassword(false);
                      setPasswords({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="w-full sm:w-auto px-6 py-2 border border-gray-300
                    rounded-md text-gray-700 hover:bg-gray-100 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= INPUT ================= */
function Input({
  label,
  type = "text",
  value,
  onChange,
  disabled,
  showToggle,
  onToggle,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full border rounded-md px-3 py-2 text-sm pr-10
          ${disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "focus:ring-2 focus:ring-slate-900"
            }`}
        />

        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2
            text-xs text-gray-600 hover:text-gray-900"
          >
            {type === "password" ? "Show" : "Hide"}
          </button>
        )}
      </div>
    </div>
  );
}
