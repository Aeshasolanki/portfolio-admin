"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCcw } from "lucide-react";

export default function AdminDashboard() {
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [inquiryCount, setInquiryCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://portfolio-backend-clhc.onrender.com";

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const [projects, blogs, inquiries] = await Promise.all([
        fetch(`${BASE_URL}/api/apps`).then((r) => r.json()).catch(() => []),
        fetch(`${BASE_URL}/api/blogs`).then((r) => r.json()).catch(() => []),
        fetch(`${BASE_URL}/api/inquiries`)
          .then((r) => r.json())
          .catch(() => []),
      ]);

      setProjectCount(Array.isArray(projects) ? projects.length : 0);
      setBlogCount(Array.isArray(blogs) ? blogs.length : 0);
      setInquiryCount(Array.isArray(inquiries) ? inquiries.length : 0);
    } catch (err) {
      console.error(err);
      setProjectCount(0);
      setBlogCount(0);
      setInquiryCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Projects",
      count: projectCount,
      link: "/admin/projects",
      gradient: "from-cyan-500 via-blue-500 to-indigo-600",
      icon: "🚀",
      description: "Manage portfolio projects",
    },
    {
      title: "Blogs",
      count: blogCount,
      link: "/admin/blogs",
      gradient: "from-purple-500 via-pink-500 to-rose-600",
      icon: "📝",
      description: "Create & edit blog posts",
    },
    {
      title: "Inquiries",
      count: inquiryCount,
      link: "/admin/inquiries",
      gradient: "from-emerald-500 via-teal-500 to-green-600",
      icon: "📩",
      description: "View client messages",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white px-6 py-12 relative overflow-hidden">
      
      {/* Animated Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full bottom-0 right-0 animate-pulse" />

      <div className="max-w-7xl mx-auto space-y-14 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Admin Control Center
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Monitor and manage everything from one powerful dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchCounts}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
            >
              <RefreshCcw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-xl">
              <p className="text-sm text-gray-400">Welcome back 👋</p>
              <p className="font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative rounded-3xl p-[1px] bg-gradient-to-br hover:scale-105 transition-all duration-300"
            >
              <div
                className={`absolute inset-0 rounded-3xl opacity-30 group-hover:opacity-70 blur-xl bg-gradient-to-br ${card.gradient}`}
              />

              <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="text-5xl">{card.icon}</div>
                  <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-gray-300">
                    Overview
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-semibold">{card.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {card.description}
                  </p>
                </div>

                <p className="text-5xl font-bold tracking-tight">
                  {card.count !== null ? card.count : "…"}
                </p>

                <Link
                  href={card.link}
                  className="inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Go to {card.title} →
                </Link>
              </div>
            </div>
          ))}
        </div>

       
       
       
      </div>
    </div>
  );
}
