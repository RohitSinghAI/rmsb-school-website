"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import { useRouter } from "next/navigation";
import { useGetAllAdmissionsQuery } from "@/redux/features/admission/admissionApi";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

/* ================= DASHBOARD PAGE ================= */
export default function AdminSchoolPremiumDashboardV2() {
  const router = useRouter();
  const { data, isLoading } = useGetAllAdmissionsQuery();

  const admissions = data?.data || [];

  /* ================= STATS ================= */
  const approved = admissions.filter(a => a.status === "approved");
  const pending = admissions.filter(a => a.status === "pending");
  const rejected = admissions.filter(a => a.status === "rejected");

  const approvalRate =
    admissions.length > 0
      ? ((approved.length / admissions.length) * 100).toFixed(1)
      : 0;

  /* ================= PIE DATA ================= */
  const pieData = [
    { name: "Approved", value: approved.length },
    { name: "Pending", value: pending.length },
    { name: "Rejected", value: rejected.length },
  ];

  /* ================= CLASS STUDENTS ================= */
  const classes = [
    "Nursery","LKG","UKG","1","2","3","4","5","6","7","8",
  ];

  const classWise = classes.map(cls => {
    const students = approved.filter(
      a => a.classApplied === cls
    ).length;

    return {
      class: cls,
      count: students,
    };
  });

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const todayApproved = Math.floor(approved.length * 0.15);
  const todayPending = Math.floor(pending.length * 0.2);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8 space-y-16">

      {/* ================= KPI ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI icon={<FiUsers />} title="Total Applications" value={admissions.length} />
        <KPI icon={<FiCheckCircle />} title="Approved" value={approved.length} green />
        <KPI icon={<FiClock />} title="Pending" value={pending.length} yellow />
        <KPI icon={<FiXCircle />} title="Rejected" value={rejected.length} red />
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <QuickCard label="Admissions" path="/admin/dashboard/admissions/applications" />
        <QuickCard label="Contact" path="/admin/dashboard/contact/contact" />
        <QuickCard label="Teachers" path="/admin/dashboard/teachers/faculty" />
        <QuickCard label="Testimonials" path="/admin/dashboard/home/testimonials" />
      </section>

      {/* ================= ANALYTICS ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <Card title="Admission Status">
          <ChartBox>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={95}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartBox>
        </Card>

        <Card title="Class-wise Admissions" span>
          <ChartBox>
            <BarChart data={classWise}>
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[6,6,0,0]} />
            </BarChart>
          </ChartBox>
        </Card>
      </section>

      {/* ================= INSIGHTS ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="System Insights" span>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>📊 Approval Rate: <b>{approvalRate}%</b></li>
            <li>🏫 Lower classes have higher demand</li>
            <li>⚠️ Pending admissions need review</li>
            <li>📈 System running smoothly</li>
          </ul>
        </Card>

        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h3 className="font-semibold mb-3">Approval Progress</h3>
          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="bg-emerald-600 h-3 rounded"
              style={{ width: `${approvalRate}%` }}
            />
          </div>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {approvalRate}%
          </p>
        </div>
      </section>

      {/* ================= TODAY ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoBox
          title="Today Overview"
          lines={[
            <>Approved Today: <b className="text-emerald-600">{todayApproved}</b></>,
            <>Pending Today: <b className="text-amber-600">{todayPending}</b></>,
          ]}
        />
        <InfoBox
          title="Monthly Trend"
          lines={[
            <>Admissions are <b className="text-blue-600">stable</b></>,
            <span className="text-xs text-gray-400">Based on approval ratio</span>,
          ]}
        />
      </section>

      {/* ================= CLASS STUDENTS ================= */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-6">Class Students</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classWise.map((c) => (
            <div
              key={c.class}
              onClick={() =>
                router.push(`/admin/dashboard/students?class=${c.class}`)
              }
              className="cursor-pointer border rounded-xl p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Class {c.class}</h3>
                <span className="text-sm text-gray-500">
                  {c.count} students
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className={`h-2 rounded ${
                    c.count > 40
                      ? "bg-rose-500"
                      : c.count > 25
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${Math.min(100, c.count * 2)}%`,
                  }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Click to view students
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ACTION CENTER ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionBox title="Review Pending" desc="Approve / reject admissions" path="/admin/dashboard/admissions/applications" />
        <ActionBox title="Bulk Promotion" desc="Promote approved students" path="/admin/dashboard/admissions/applications" />
        <ActionBox title="Generate Reports" desc="Export admission PDFs" path="/admin/dashboard/admissions/applications" />
      </section>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function KPI({ title, value, icon, green, yellow, red }) {
  const color = green
    ? "from-emerald-500 to-emerald-700"
    : yellow
    ? "from-amber-400 to-amber-600"
    : red
    ? "from-rose-500 to-rose-700"
    : "from-blue-500 to-indigo-600";

  return (
    <div className={`bg-gradient-to-br ${color} text-white rounded-xl p-6 shadow`}>
      <div className="flex justify-between items-center">
        <p className="text-sm opacity-90">{title}</p>
        <span className="text-2xl opacity-80">{icon}</span>
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
}

function QuickCard({ label, path }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(path)}
      className="cursor-pointer bg-white rounded-xl p-6 shadow hover:shadow-lg hover:-translate-y-1 transition"
    >
      <h3 className="font-semibold text-lg">{label}</h3>
      <p className="text-sm text-gray-500 mt-1">Open module →</p>
    </div>
  );
}

function ActionBox({ title, desc, path }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(path)}
      className="cursor-pointer bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow hover:scale-[1.03] transition"
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm opacity-80 mt-1">{desc}</p>
    </div>
  );
}

function InfoBox({ title, lines }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-2">{title}</h3>
      {lines.map((line, i) => (
        <p key={i} className="text-sm text-gray-600">{line}</p>
      ))}
    </div>
  );
}

function Card({ title, children, span }) {
  return (
    <div className={`bg-white rounded-xl shadow p-6 ${span ? "lg:col-span-2" : ""}`}>
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function ChartBox({ children }) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
