"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearAdmin } from "../redux/features/adminAuth/adminAuthSlice";
import { useLogoutAdminMutation } from "../redux/features/adminAuth/adminAuthApi";

export default function AdminHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutAdmin, { isLoading }] = useLogoutAdminMutation();

  const admin = useSelector((state) => state.adminAuth.admin);

  const handleLogout = async () => {
    if (isLoading) return;
    try {
      await logoutAdmin().unwrap();
      dispatch(clearAdmin());
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      
      {/* LEFT */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          School Management Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Admin Panel • Control & Monitoring
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-700">
            {admin?.name || "Admin"}
          </p>
          <p className="text-xs text-gray-500">
            Role: {admin?.role || "admin"}
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/dashboard/profile")}
          className="px-3 py-2 text-xs sm:text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
        >
          Profile
        </button>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`px-4 py-2 text-xs sm:text-sm rounded-md text-white transition ${
            isLoading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
}
