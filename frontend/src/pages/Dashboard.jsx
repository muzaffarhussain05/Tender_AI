import { motion } from "framer-motion";
import {
  FileText,
  CalendarCheck,
  Clock,
  Bookmark,
  Search,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Download,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import Header from "../components/Header";
import { useApp } from "../context/AppContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// const areaData = [
//   { month: "Jun", tenders: 95, saved: 12 },
//   { month: "Jun", tenders: 95, saved: 12 },
//   { month: "Jul", tenders: 110, saved: 18 },
//   { month: "Aug", tenders: 88, saved: 14 },
//   { month: "Sep", tenders: 130, saved: 22 },
//   { month: "Oct", tenders: 145, saved: 28 },
//   { month: "Nov", tenders: 122, saved: 20 },
//   { month: "Dec", tenders: 158, saved: 35 },
// ];

// const pieData = [
//   { name: "IT & Software", value: 38 },
//   { name: "Construction", value: 24 },
//   { name: "Healthcare", value: 18 },
//   { name: "Infrastructure", value: 12 },
//   { name: "Other", value: 8 },
// ];
const PIE_COLORS = ["#0058be", "#0891b2", "#059669", "#7c3aed", "#d97706"];

const aiSuggestions = [
  "3 new IT tenders match your active profile in UAE",
  "KSA Ministry of Health RFP closes in 4 days — review now",
  "Cloud infrastructure bids up 15% this month vs last quarter",
];

const quickActions = [
  {
    label: "New AI Analysis",
    icon: Sparkles,
    color: "bg-[#0058be]",
    action: "/ai-assistant",
  },
  {
    label: "Search Tenders",
    icon: Search,
    color: "bg-[#059669]",
    action: "/tender-search",
  },
  {
    label: "View Saved",
    icon: Bookmark,
    color: "bg-[#7c3aed]",
    action: "/saved-tenders",
  },
  {
    label: "Analytics",
    icon: TrendingUp,
    color: "bg-[#0891b2]",
    action: "/analytics",
  },
];

const statusColor = {
  OPEN: "bg-green-100 text-green-700",
  "CLOSING SOON": "bg-orange-100 text-orange-700",
  AWARDED: "bg-blue-100 text-blue-700",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
};

export default function Dashboard() {
  const {
    dashboardStats,
    
    currentUser,
    isLoading,
    loadDashboard,
    loadTenders,
    categoryDistribution,
    tenderActivity,
    recentTenders
  } = useApp();

  useEffect(() => {
    loadDashboard();
   
  }, []);

  const pieData =
    categoryDistribution?.items?.map((item) => ({
      name: item.category,
      value: item.percentage,
    })) ?? [];
  const areaData =
    tenderActivity?.items?.map((item) => ({
      month: item.month,
      save: item.saved,
      tenders: item.tenders,
    })) ?? [];

 
    
  const stats = [
    {
      label: "Total Tenders",
      value: dashboardStats?.total_tenders?.count ?? 0,
      icon: FileText,
      delta: `${dashboardStats?.total_tenders?.change ?? 0}%`,
      color: "#0058be",
    },
    {
      label: "Today's Tenders",
      value: dashboardStats?.today_tenders?.count ?? 0,
      icon: CalendarCheck,
      delta: `${dashboardStats?.today_tenders?.change ?? 0}`,
      color: "#059669",
    },
    {
      label: "Closing Soon",
      value: dashboardStats?.closing_soon?.count ?? 0,
      icon: Clock,
      delta: `${dashboardStats?.closing_soon?.change ?? 0}`,
      color: "#dc2626",
    },
    {
      label: "Saved",
      value: dashboardStats?.saved_tenders?.count ?? 0,
      icon: Bookmark,
      delta: `${dashboardStats?.saved_tenders?.change ?? 0}`,
      color: "#7c3aed",
    },
  ];

  // const recentTenders = recentTenders

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header searchPlaceholder="Search tenders, organizations..." />
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-[#0b1c30]">Dashboard</h1>
          <p className="text-sm text-[#6b7280]">
            Welcome back, {currentUser.name}. Here's your procurement overview.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6b7280]">{s.label}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: s.color + "18" }}
                >
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0b1c30]">{s.value}</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUpRight size={12} />
                {s.delta}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-12 bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-[#0b1c30]">Tender Activity</h3>
                <p className="text-xs text-[#6b7280]">
                  Monthly tender volume & saves
                </p>
              </div>
              <TrendingUp size={16} className="text-[#0058be]" />
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0058be" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0058be" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area
                  type="monotone"
                  dataKey="tenders"
                  stroke="#0058be"
                  fill="url(#tGrad)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="saved"
                  stroke="#7c3aed"
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-medium text-[#0b1c30]">Recent Tenders</h3>
              <a
                href="/tender-search"
                className="text-xs text-[#0058be] flex items-center gap-1 hover:underline"
              >
                View all <ChevronRight size={12} />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-[10px] font-semibold text-[#6b7280] uppercase px-4 py-2">
                      Status
                    </th>
                    <th className="text-left text-[10px] font-semibold text-[#6b7280] uppercase px-4 py-2">
                      Tender Details
                    </th>
                    <th className="text-left text-[10px] font-semibold text-[#6b7280] uppercase  py-2 hidden xl:table-cell">
                      Published Date
                    </th>
                    <th className="text-right text-[10px] font-semibold text-[#6b7280] uppercase px-4 py-2">
                      Closing Date
                    </th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {recentTenders.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[t.status]}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-[#0b1c30] leading-tight">
                          {t.title}
                        </div>
                        <div className="text-xs text-[#6b7280]">
                          {t.location}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#0058be] hidden xl:table-cell">
                        {new Date(t.publish_date).toISOString().split("T")[0]}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs font-semibold text-[#da0c0c]">
                            {
                              new Date(t.closing_date)
                                .toISOString()
                                .split("T")[0]
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                            <ExternalLink size={13} className="text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-[#0b1c30] mb-1">
              Category Distribution
            </h3>
            <p className="text-xs text-[#6b7280] mb-3">
              By tender type this month
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i] }}
                    />
                    <span className="text-xs text-[#45464d]">{d.name}</span>
                  </div>
                  <span className="text-xs font-medium text-[#0b1c30]">
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
