"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetAdminProfileQuery } from "@/redux/features/adminAuth/adminAuthApi";

import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import AdminFooter from "@/components/AdminFooter";

export default function DashboardClientLayout({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // 🔥 BACKEND AUTH CHECK (COOKIE BASED)
  const { data, isLoading, isError } = useGetAdminProfileQuery();

  useEffect(() => {
    if (!isLoading) {
      if (isError || !data?.success) {
        router.replace("/admin/login");
      } else {
        setReady(true);
      }
    }
  }, [isLoading, isError, data, router]);

  // ⛔ jab tak backend confirm na kare
  if (isLoading || !ready) {
    return null; // loader rakh sakte ho
  }

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <AdminSidebar />

      <div className="ml-0 md:ml-72 flex flex-col min-h-screen w-full">
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
