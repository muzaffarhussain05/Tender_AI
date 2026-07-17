import { motion } from "framer-motion";
import { TrendingUp, BarChart3, MapPin, Bot, Building2 } from "lucide-react";
import Header from "../components/Header";
import { useApp } from "../context/AppContext";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

const monthlyData = [
  { month: "Jan", tenders: 85, searches: 42, saved: 8 },
  { month: "Feb", tenders: 92, searches: 55, saved: 11 },
  { month: "Mar", tenders: 110, searches: 67, saved: 14 },
  { month: "Apr", tenders: 98, searches: 60, saved: 12 },
  { month: "May", tenders: 125, searches: 78, saved: 18 },
  { month: "Jun", tenders: 140, searches: 89, saved: 22 },
  { month: "Jul", tenders: 158, searches: 95, saved: 28 },
];

const categoryData = [
  { name: "IT & Software", value: 38, color: "#0058be" },
  { name: "Construction", value: 24, color: "#0891b2" },
  { name: "Healthcare", value: 18, color: "#059669" },
  { name: "Infrastructure", value: 12, color: "#7c3aed" },
  { name: "Energy", value: 8, color: "#d97706" },
];

const orgData = [
  { org: "Dept. Homeland Security", tenders: 24 },
  { org: "NHS Foundation", tenders: 19 },
  { org: "Saudi Aramco", tenders: 16 },
  { org: "Smart Dubai Auth.", tenders: 14 },
  { org: "City of Vancouver", tenders: 11 },
];

const locationData = [
  { location: "UAE", count: 45 },
  { location: "KSA", count: 38 },
  { location: "USA", count: 32 },
  { location: "UK", count: 27 },
  { location: "Pakistan", count: 21 },
  { location: "Canada", count: 18 },
];

const aiUsage = [
  { date: "Jul 09", queries: 12, matches: 8 },
  { date: "Jul 10", queries: 18, matches: 13 },
  { date: "Jul 11", queries: 8, matches: 5 },
  { date: "Jul 12", queries: 24, matches: 19 },
  { date: "Jul 13", queries: 16, matches: 11 },
  { date: "Jul 14", queries: 28, matches: 22 },
  { date: "Jul 15", queries: 31, matches: 25 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }),
};

export default function Analytics() {
  const { dashboardStats, savedTenders } = useApp();

  const statCards = [
    { label: "Total Tenders Analyzed", value: dashboardStats.totalTenders.toLocaleString(), delta: "+12% vs last month", icon: BarChart3, color: "#0058be" },
    { label: "AI Queries This Month", value: "312", delta: "+28% vs last month", icon: Bot, color: "#7c3aed" },
    { label: "Avg Match Score", value: "84.2%", delta: "+3.1% improvement", icon: TrendingUp, color: "#059669" },
    { label: "Saved Tenders", value: savedTenders.length.toString(), delta: "Actively tracked", icon: Building2, color: "#0891b2" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header searchPlaceholder="Search analytics..." />
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-[#0b1c30]">Analytics</h1>
          <p className="text-sm text-[#6b7280]">Procurement intelligence and market insights</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + "18" }}>
                  <s.icon size={17} style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0b1c30] mb-1">{s.value}</div>
              <div className="text-[10px] text-[#6b7280]">{s.label}</div>
              <div className="text-[10px] text-green-600 mt-1">{s.delta}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-medium text-[#0b1c30] mb-1">Monthly Tender Volume</h3>
          <p className="text-xs text-[#6b7280] mb-4">Tenders, searches, and saves over time</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                {[["t", "#0058be"], ["s", "#7c3aed"], ["v", "#059669"]].map(([key, color]) => (
                  <linearGradient key={key} id={`g${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="tenders" name="Tenders" stroke="#0058be" fill="url(#gt)" strokeWidth={2} />
              <Area type="monotone" dataKey="searches" name="Searches" stroke="#7c3aed" fill="url(#gs)" strokeWidth={2} />
              <Area type="monotone" dataKey="saved" name="Saved" stroke="#059669" fill="url(#gv)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-[#0b1c30] mb-1">Category Distribution</h3>
            <p className="text-xs text-[#6b7280] mb-3">Tenders by sector this period</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {categoryData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-[#45464d]">{d.name}</span>
                    </div>
                    <span className="text-xs font-medium text-[#0b1c30]">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-[#0b1c30] mb-1">Top Organizations</h3>
            <p className="text-xs text-[#6b7280] mb-3">Most active tender issuers</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={orgData} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="org" tick={{ fontSize: 10, fill: "#45464d" }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="tenders" fill="#0058be" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-[#0058be]" />
              <h3 className="font-medium text-[#0b1c30]">Locations</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="location" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="count" name="Tenders" fill="#0891b2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bot size={14} className="text-[#7c3aed]" />
              <h3 className="font-medium text-[#0b1c30]">AI Usage (Last 7 Days)</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={aiUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="queries" name="Queries" stroke="#7c3aed" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="matches" name="Matches Found" stroke="#059669" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
