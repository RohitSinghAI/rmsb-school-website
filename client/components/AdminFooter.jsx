"use client";

import Link from "next/link";

export default function AdminFooter() {
  return (
    <footer className=" bgfixed bottom-0 right-0 left-0 md:left-72 z-40 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
          
          {/* LEFT */}
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-700">
              School Management System
            </span>
          </p>

          {/* RIGHT */}
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-blue-600">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-blue-600">
              Terms
            </Link>
            <Link href="/support" className="hover:text-blue-600">
              Support
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
