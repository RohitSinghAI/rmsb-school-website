"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  useGetAdminProfileQuery,
  useLogoutAdminMutation,
} from "@/redux/features/adminAuth/adminAuthApi";
import { clearAdmin } from "@/redux/features/adminAuth/adminAuthSlice";

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetAdminProfileQuery();
  const [logoutAdmin, { isLoading: loggingOut }] =
    useLogoutAdminMutation();

  useEffect(() => {
    if (isError) {
      dispatch(clearAdmin());
      router.push("/");
    }
  }, [isError, dispatch, router]);


  if (isError) return null;

  const admin = data?.user || {};

  const handleLogout = async () => {
    try {
      await logoutAdmin().unwrap();
      dispatch(clearAdmin());
      router.push("/");
    } catch {
      dispatch(clearAdmin());
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-8 py-12 space-y-14">

        {/* ===== KPI CARDS ===== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat title="Total Students" value="1,248" />
          <Stat title="Active Teachers" value="78" />
          <Stat title="Monthly Revenue" value="₹8.4L" />
          <Stat title="Pending Admissions" value="23" />
        </section>

        {/* ===== PROFILE + SYSTEM HEALTH ===== */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* PROFILE */}
          <div className="bg-white rounded-2xl p-6 shadow border">
            <h2 className="text-lg font-semibold mb-4">Admin Profile</h2>
            <div className="space-y-2 text-gray-600">
              <p><b>Name:</b> {admin.name}</p>
              <p><b>Email:</b> {admin.email}</p>
              <p><b>Role:</b> Super Admin</p>
              <p className="text-green-600 font-semibold">Status: Active</p>
            </div>

            <button
              onClick={() => router.push("/admin/dashboard/profile")}
              className="mt-5 w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
            >
              View Profile
            </button>
          </div>

          {/* SYSTEM HEALTH */}
          <div className="bg-white rounded-2xl p-6 shadow border col-span-2">
            <h2 className="text-lg font-semibold mb-4">System Health</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <HealthCard label="Server" status="Online" />
              <HealthCard label="Database" status="Stable" />
              <HealthCard label="API" status="Operational" />
              <HealthCard label="Security" status="Secure" />
            </div>
          </div>
        </section>

        {/* ===== MODULES ===== */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Core Management Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatModule label="Students Management" path="/admin/students" />
            <StatModule label="Teachers & Staff" path="/admin/teachers" />
            <StatModule label="Classes & Timetable" path="/admin/classes" />
            <StatModule label="Admissions Control" path="/admin/admissions" />
            <StatModule label="Fees & Finance" path="/admin/fees" />
            <StatModule label="Reports & Analytics" path="/admin/reports" />
          </div>
        </section>

        {/* ===== ACTIVITY ===== */}
        <section className="bg-white rounded-2xl p-6 shadow border">
          <h2 className="text-lg font-semibold mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-3 text-gray-600">
            <li>✔ Admission approved for Class 10</li>
            <li>✔ Monthly finance report generated</li>
            <li>✔ New teacher onboarded</li>
            <li>✔ Timetable updated</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow border">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2 text-blue-600">{value}</p>
    </div>
  );
}

function StatModule({ label, path }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(path)}
      className="cursor-pointer bg-white border rounded-2xl p-6 shadow hover:border-blue-600 hover:scale-[1.02] transition"
    >
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-sm text-gray-500 mt-2">
        Manage and monitor {label.toLowerCase()}
      </p>
    </div>
  );
}

function HealthCard({ label, status }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-green-600">{status}</p>
    </div>
  );
}
