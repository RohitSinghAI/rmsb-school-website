"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearAdmin } from "@/redux/features/adminAuth/adminAuthSlice";
import { useLogoutAdminMutation } from "@/redux/features/adminAuth/adminAuthApi";
import { useGetNavbarQuery } from "@/redux/features/navbar/page";

export default function AdminHeader() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [logoutAdmin, { isLoading }] = useLogoutAdminMutation();
  const admin = useSelector((state) => state.adminAuth.admin);

  // 🔥 SAME BRAND DATA AS NAVBAR & SIDEBAR
  const { data: navbarData } = useGetNavbarQuery();
  const brand = navbarData?.navbar?.brand;

  const handleLogout = async () => {
    if (isLoading) return;

    try {
      await logoutAdmin().unwrap();
      // ✅ Clear redux first
      dispatch(clearAdmin());
      // ✅ Small delay + hard redirect
      setTimeout(() => {
        router.replace("/");
      }, 100);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header
      className="sticky top-0 z-30 bg-white border-b shadow-sm
      px-4 sm:px-6 py-3"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* LEFT : BRAND */}
        <div className="leading-tight">
          <h1 className="text-base sm:text-xl font-bold text-gray-800">
            {brand?.title || "School Management System"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {brand?.subtitle || "Admin Dashboard"}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {/* ACTION BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/dashboard/profile")}
              className="px-3 py-2 text-xs sm:text-sm
              border border-slate-900 text-slate-900
              rounded-md hover:bg-slate-900 hover:text-white transition"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md text-white transition ${isLoading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
                }`}
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
