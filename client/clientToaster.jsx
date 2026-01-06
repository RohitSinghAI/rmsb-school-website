"use client";

import { Toaster } from "react-hot-toast";

export default function ClientToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#111",
          color: "#fff",
          borderRadius: "14px",
          padding: "14px 18px",
          fontSize: "15px",
        },
      }}
    />
  );
}
