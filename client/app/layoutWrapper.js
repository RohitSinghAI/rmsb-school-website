"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <main className="bg-[#fdfcf9]">{children}</main>
            {!isAdminRoute && <Footer />}
        </>
    );
}
