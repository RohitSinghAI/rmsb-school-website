"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import AdminFooter from "@/components/AdminFooter";

export default function DashboardClientLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <AdminSidebar />

      {/* RIGHT CONTENT */}
      <div className="ml-0 md:ml-72 flex flex-col min-h-screen w-full">
        {/* mobile sidebar bar height = 56px */}
        <div className="md:hidden h-10" />

        <AdminHeader />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
