import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Globe, Bell, Database, Upload, Trash2, Info, ChevronRight, Check } from "lucide-react";
import Header from "../components/Header";
import { useApp } from "../context/AppContext";

export default function Settings() {
  const { settings, updateSettings } = useApp();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      id: "theme",
      label: "Appearance",
      icon: Sun,
      content: (
        <div className="grid grid-cols-3 gap-3">
          {[
            { val: "light", icon: Sun, label: "Light" },
            { val: "dark", icon: Moon, label: "Dark" },
            { val: "system", icon: Monitor, label: "System" },
          ].map(({ val, icon: Icon, label }) => (
            <button
              key={val}
              onClick={() => updateSettings({ theme: val })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                settings.theme === val ? "border-[#0058be] bg-[#eff4ff]" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon size={20} className={settings.theme === val ? "text-[#0058be]" : "text-gray-400"} />
              <span className={`text-sm font-medium ${settings.theme === val ? "text-[#0058be]" : "text-[#45464d]"}`}>{label}</span>
              {settings.theme === val && (
                <div className="w-4 h-4 rounded-full bg-[#0058be] flex items-center justify-center">
                  <Check size={10} color="white" />
                </div>
              )}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "api",
      label: "API Settings",
      icon: Globe,
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">Server URL</label>
            <input
              value={settings.serverUrl}
              onChange={(e) => updateSettings({ serverUrl: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#c6c6cd] rounded-lg text-sm outline-none focus:border-[#0058be] font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">AI Model</label>
            <select
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#c6c6cd] rounded-lg text-sm outline-none"
            >
              <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
              <option value="claude-opus-4-8">Claude Opus 4.8</option>
              <option value="claude-haiku-4-5">Claude Haiku 4.5</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#eff4ff] border border-[#c6c6cd] rounded-lg text-sm outline-none"
            >
              {["English", "Arabic", "Urdu", "French", "Spanish"].map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      content: (
        <div className="space-y-3">
          {[
            { key: "email", label: "Email Notifications", desc: "Receive tender alerts via email" },
            { key: "push", label: "Push Notifications", desc: "Desktop alerts for closing tenders" },
            { key: "weekly", label: "Weekly Digest", desc: "Summary report every Monday" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-[#0b1c30]">{label}</div>
                <div className="text-xs text-[#6b7280]">{desc}</div>
              </div>
              <button
                onClick={() => updateSettings({ notifications: { ...settings.notifications, [key]: !settings.notifications[key] } })}
                className={`relative w-10 h-5 rounded-full transition-colors ${settings.notifications[key] ? "bg-[#0058be]" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.notifications[key] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "data",
      label: "Data Management",
      icon: Database,
      content: (
        <div className="space-y-3">
          {[
            { icon: Upload, label: "Export Data", desc: "Download all your data as JSON", color: "text-[#0058be]" },
            { icon: Upload, label: "Import Data", desc: "Restore from a backup file", color: "text-[#059669]" },
            { icon: Trash2, label: "Clear Cache", desc: "Free up local storage space", color: "text-red-500" },
          ].map(({ icon: Icon, label, desc, color }) => (
            <button key={label} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
              <div className="flex items-center gap-3">
                <Icon size={16} className={color} />
                <div className="text-left">
                  <div className="text-sm font-medium text-[#0b1c30]">{label}</div>
                  <div className="text-xs text-[#6b7280]">{desc}</div>
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-400" />
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "about",
      label: "About",
      icon: Info,
      content: (
        <div className="space-y-2 text-sm text-[#45464d]">
          {[
            ["Application", "Tender AI"],
            ["Version", "1.0.0"],
            ["Build", "2024.07.15"],
            ["License", "Enterprise"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-[#6b7280]">{label}</span>
              <span className="font-medium text-[#0b1c30]">{value}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header searchPlaceholder="Search settings..." />
      <div className="flex-1 overflow-y-auto p-5 max-w-3xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#0b1c30]">Settings</h1>
            <p className="text-sm text-[#6b7280]">Configure your Tender AI experience</p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              saved ? "bg-green-500 text-white" : "bg-[#0058be] text-white hover:bg-[#0047a1]"
            }`}
          >
            {saved ? <><Check size={14} /> Saved!</> : "Save Changes"}
          </button>
        </div>

        {sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center">
                <section.icon size={15} className="text-[#0058be]" />
              </div>
              <h3 className="font-semibold text-[#0b1c30] text-sm">{section.label}</h3>
            </div>
            <div className="px-5 py-4">{section.content}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
