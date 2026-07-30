import React, { useEffect, useRef } from "react";
import { LayoutDashboard, Search, Headset, Lock, Cpu, Bot } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const headlineRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!headlineRef.current) return;
      const x = (window.innerWidth / 2 - e.pageX) / 50;
      const y = (window.innerHeight / 2 - e.pageY) / 50;
      headlineRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const navCards = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      description: "Return to your operational hub.",
      path: "/dashboard",
    },
    {
      icon: Search,
      title: "Search Tenders",
      description: "Find relevant procurement leads.",
      path: "/tender-search",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Return to Ai Assistant.",
      path: "/ai-assistant",
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-100 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-slate-200/40 to-transparent blur-3xl" />
      </div>

      {/* 404 Canvas */}
      <section className="relative z-10 flex-1 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl w-full">
          {/* 404 Visual Anchor */}
          <div className="relative mb-8 h-40 flex items-center justify-center">
            <h2
              ref={headlineRef}
              className="text-[160px] leading-none font-bold text-slate-900/5 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
            >
              404
            </h2>
            <div className="relative z-10 space-y-4">
              <span className="text-xs font-medium text-blue-600 uppercase tracking-widest bg-blue-600/10 px-4 py-1.5 rounded-full border border-blue-600/20 inline-block">
                Error: Not Found
              </span>
              <h3 className="text-3xl font-bold text-slate-900">
                Procurement Data Stream Interrupted
              </h3>
            </div>
          </div>

          <p className="text-base text-slate-600 mb-12 max-w-md mx-auto leading-relaxed">
            The page you are looking for doesn't exist or has been moved to a
            different department within our enterprise cloud.
          </p>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {navCards.map(({ icon: Icon, title, description, path }) => (
              <Link
                to={path}
                key={title}
                href="#"
                className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-600 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {title}
                </h4>
                <p className="text-sm text-slate-600 mt-1">{description}</p>
              </Link>
            ))}
          </div>

          {/* Status Footer */}
        </div>
      </section>

      {/* Bottom illustration */}
      <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 flex items-end justify-around">
          {[
            { h: "h-24", delay: "0.1s", dur: "3s" },
            { h: "h-12", delay: "0.5s", dur: "2.5s" },
            { h: "h-32", delay: "0.3s", dur: "4s" },
            { h: "h-16", delay: "0.7s", dur: "3.5s" },
            { h: "h-20", delay: "0.2s", dur: "2.8s" },
            { h: "h-28", delay: "0.9s", dur: "3.2s" },
            { h: "h-14", delay: "0.4s", dur: "3.7s" },
            { h: "h-32", delay: "0.6s", dur: "2.9s" },
          ].map((bar, i) => (
            <div
              key={i}
              className={`w-1 ${bar.h} bg-blue-600/30 rounded-t-full animate-bounce`}
              style={{ animationDelay: bar.delay, animationDuration: bar.dur }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
