"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [inquiryCount, setInquiryCount] = useState<number | null>(null);

  const BASE_URL = "https://portfolio-backend-clhc.onrender.com";

  useEffect(() => {
    const fetchCounts = async () => {
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
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Projects",
      count: projectCount,
      link: "/admin/projects",
      gradient: "from-cyan-500 to-blue-600",
      icon: "🚀",
    },
    {
      title: "Blogs",
      count: blogCount,
      link: "/admin/blogs",
      gradient: "from-purple-500 to-pink-600",
      icon: "📝",
    },
    {
      title: "Inquiries",
      count: inquiryCount,
      link: "/admin/inquiries",
      gradient: "from-emerald-500 to-teal-600",
      icon: "📩",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Manage your portfolio, blogs, and inquiries in one place
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-xl">
            <p className="text-sm text-gray-400">Welcome back 👋</p>
            <p className="font-semibold">Admin Panel</p>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl hover:scale-105 transition-all duration-300"
            >
              {/* Gradient glow */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition rounded-2xl bg-gradient-to-br ${card.gradient}`}
              />

              <div className="relative z-10 space-y-4">
                <div className="text-4xl">{card.icon}</div>

                <h2 className="text-xl font-semibold">{card.title}</h2>

                <p className="text-4xl font-bold">
                  {card.count !== null ? card.count : "Loading..."}
                </p>

                <Link
                  href={card.link}
                  className="inline-block mt-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Manage {card.title} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        
      </div>
    </div>
  );
}
