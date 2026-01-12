"use client";
import { useEffect } from "react";

export default function AuthSessionHandler() {
  useEffect(() => {
    const logout = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    };

    window.addEventListener("beforeunload", logout);
    window.addEventListener("popstate", logout);

    return () => {
      window.removeEventListener("beforeunload", logout);
      window.removeEventListener("popstate", logout);
    };
  }, []);

  return null;
}
