"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import AdminFooter from "@/components/AdminFooter";

export default function DashboardClientLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 🔥 SINGLE SOURCE OF TRUTH
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <AdminSidebar />

      {/* RIGHT CONTENT */}
      <div className="ml-0 md:ml-72 flex flex-col min-h-screen w-full">
        {/* mobile sidebar bar height */}
        <div className="md:hidden h-10" />

        <AdminHeader />

        <main className="flex-1 overflow-y-auto pb-10">
          {children}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
