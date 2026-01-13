"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiGrid,
  FiHome,
  FiBookOpen,
  FiDollarSign,
  FiSettings,
  FiUser,
  FiLogOut,
  FiPhone
} from "react-icons/fi";

import { useLogoutAdminMutation } from "@/redux/features/adminAuth/adminAuthApi";
import { useGetNavbarQuery } from "@/redux/features/navbar/page";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  const [menus, setMenus] = useState({
    homeNavbar: false,
    home: false,
    homeSlider: false,
    homeAbout: false,
    homeTeachers: false,
    homeGallery: false,
    homeAdmissions: false,
    homeContact: false,

    about: false,
    aboutSchool: false,
    aboutManagement: false,

    admissions: false,
    finance: false,
    settings: false,
  });

  const router = useRouter();
  const [logoutAdmin] = useLogoutAdminMutation();

  // 🔥 SAME BRAND SOURCE AS NAVBAR / HEADER / FOOTER
  const { data: navbarData } = useGetNavbarQuery();
  const brand = navbarData?.navbar?.brand;

  const toggleMenu = (key) =>
    setMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  const closeMobile = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await logoutAdmin().unwrap();
      closeMobile();
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
        <span className="font-semibold">
          {brand?.title || "Admin Panel"}
        </span>
        <button onClick={() => setOpen(true)}>☰</button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeMobile}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-slate-900 text-white
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="h-full flex flex-col">

          {/* HEADER (ONLY TEXT DYNAMIC) */}
          <div className="px-6 py-5 border-b border-slate-700">
            <h2 className="text-lg font-bold">
              {brand?.title || "School ERP"}
            </h2>
            <p className="text-xs text-slate-400">
              {brand?.subtitle || "Admin Management"}
            </p>
          </div>

          {/* MENU (UNCHANGED) */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2 text-sm">

            <NavItem href="/admin/dashboard" icon={<FiGrid />} label="Dashboard" close={closeMobile} />

            <Folder title="Home Section" icon={<FiHome />} open={menus.home} toggle={() => toggleMenu("home")}>
              <Folder title="Navbar" open={menus.homeNavbar} toggle={() => toggleMenu("homeNavbar")} nested>
                <NavItem href="/admin/dashboard/navbar" label="Navbar" close={closeMobile} />
              </Folder>

              <Folder title="Home" open={menus.homeSlider} toggle={() => toggleMenu("homeSlider")} nested>
                <NavItem href="/admin/dashboard/home/slider" label="Slider" close={closeMobile} />
                <NavItem href="/admin/dashboard/home/school-highlights" label="School Highlights" close={closeMobile} />
                <NavItem href="/admin/dashboard/home/stats" label="Stats" close={closeMobile} />
                <NavItem href="/admin/dashboard/home/upcoming-events" label="Upcoming Events" close={closeMobile} />
                <NavItem href="/admin/dashboard/home/testimonials" label="Testimonials" close={closeMobile} />
              </Folder>

              <Folder title="About" open={menus.homeAbout} toggle={() => toggleMenu("homeAbout")} nested>
                <NavItem href="/admin/dashboard/about/principalData" label="Principal" close={closeMobile} />
                <NavItem href="/admin/dashboard/about/aboutUs" label="About Us" close={closeMobile} />
                <NavItem href="/admin/dashboard/about/missionVisionValues" label="Mission" close={closeMobile} />
                <NavItem href="/admin/dashboard/about/journeyTimeline" label="Journey Timeline" close={closeMobile} />
                <NavItem href="/admin/dashboard/about/programsCurriculum" label="Programs Curriculum" close={closeMobile} />
                <NavItem href="/admin/dashboard/about/facility" label="Facility" close={closeMobile} />
              </Folder>

              <Folder title="Teachers" open={menus.homeTeachers} toggle={() => toggleMenu("homeTeachers")} nested>
                <NavItem href="/admin/dashboard/teachers/faculty" label="Faculty" close={closeMobile} />
              </Folder>

              <Folder title="Gallery" open={menus.homeGallery} toggle={() => toggleMenu("homeGallery")} nested>
                <NavItem href="/admin/dashboard/gallery" label="Gallery Image" close={closeMobile} />
              </Folder>

              <Folder title="Admissions" open={menus.homeAdmissions} toggle={() => toggleMenu("homeAdmissions")} nested>
                <NavItem href="#" label="Applications" close={closeMobile} />
              </Folder>

              <Folder title="Contact" open={menus.homeContact} toggle={() => toggleMenu("homeContact")} nested>
                <NavItem href="/admin/dashboard/contact/contactInfo" label="Contact Info" close={closeMobile} />
                <NavItem href="/admin/dashboard/contact/contact" label="Contact" close={closeMobile} />
              </Folder>
            </Folder>

            <Folder title="Admission" icon={<FiBookOpen />} open={menus.admissions} toggle={() => toggleMenu("admissions")}>
              <NavItem href="/admin/dashboard/admissions/applications" label="Applications" close={closeMobile} />
              {/* <NavItem href="/admin/students" label="Students" close={closeMobile} />
              <NavItem href="/admin/classes" label="Classes" close={closeMobile} /> */}
            </Folder>

            {/* <Folder title="Finance" icon={<FiDollarSign />} open={menus.finance} toggle={() => toggleMenu("finance")}>
              <NavItem href="/admin/fees" label="Fees" close={closeMobile} />
              <NavItem href="/admin/payments" label="Payments" close={closeMobile} />
            </Folder> */}

            <Folder title="Settings" icon={<FiSettings />} open={menus.settings} toggle={() => toggleMenu("settings")}>
              <NavItem href="/admin/dashboard/profile" icon={<FiUser />} label="Profile" close={closeMobile} />
            </Folder>

             <NavItem href="/admin/dashboard/contact/contact" icon={<FiPhone />} label="Contact" close={closeMobile} />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded
              hover:bg-red-600 text-red-300 mt-2"
            >
              <FiLogOut />
              Logout
            </button>

          </nav>

          {/* FOOTER (ONLY TEXT DYNAMIC) */}
          <div className="px-4 py-3 border-t border-slate-700 text-xs text-slate-400">
            © {new Date().getFullYear()} {brand?.title || "School"}
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------- SUB COMPONENTS ---------- */

function NavItem({ href, icon, label, close }) {
  return (
    <Link
      href={href}
      onClick={close}
      className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800"
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}

function Folder({ title, icon, open, toggle, children, nested }) {
  return (
    <div className={nested ? "ml-4" : ""}>
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-800"
      >
        <div className="flex items-center gap-3">
          {icon && icon}
          <span>{title}</span>
        </div>
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && <div className="ml-4 mt-1 space-y-1">{children}</div>}
    </div>
  );
}
