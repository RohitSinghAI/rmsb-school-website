"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }) {
  const router = useRouter();

  // ✅ SAFE SELECTOR
  const user = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  return children;
}
