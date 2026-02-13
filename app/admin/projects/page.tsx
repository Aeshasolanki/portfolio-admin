"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const BASE_URL = "https://portfolio-backend-clhc.onrender.com";

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/apps`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const goToEdit = (id: number) => router.push(`/admin/projects/${id}/edit`);

  const deleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      setDeletingId(id);
      await fetch(`${BASE_URL}/api/apps/${id}`, { method: "DELETE" });
      await fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] to-[#0f122a] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-lg">
            🚀 Projects Admin
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Manage your projects in a clean and premium dashboard
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Project Library</h2>
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 rounded-md font-semibold text-black bg-slate-200 hover:bg-slate-300 transition"
          >
            + Add Project
          </Link>
        </div>

        {/* PROJECT LIST */}
        <div className="flex flex-col space-y-6">
          {projects.length > 0 ? (
            projects.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row items-start bg-[#0f172a] border border-white/10 rounded-xl p-6 md:p-8 shadow hover:bg-[#111a2e] transition cursor-pointer"
                onClick={() => goToEdit(p.id)}
              >
                {/* Icon */}
                {p.icon_url && (
                  <img
                    src={p.icon_url.replace("localhost:5000", "portfolio-backend-clhc.onrender.com")}
                    alt={p.name}
                    className="w-24 h-24 rounded-md object-cover border border-white/10 mb-4 md:mb-0 md:mr-6"
                  />
                )}

                {/* Details */}
                <div className="flex-1 flex flex-col space-y-3">
                  <h3 className="text-2xl font-semibold text-white tracking-wide">{p.name}</h3>
                  {p.tagline && <p className="text-gray-400 italic">{p.tagline}</p>}

                  <ul className="text-gray-300 mt-1 space-y-1 text-sm">
                    <li><span className="text-cyan-400 font-semibold">Slug:</span> {p.slug}</li>
                    <li><span className="text-cyan-400 font-semibold">Category:</span> {p.category}</li>
                    {p.description && <li><span className="text-cyan-400 font-semibold">Description:</span> {p.description}</li>}
                    {p.description_secondary && <li><span className="text-cyan-400 font-semibold">Additional:</span> {p.description_secondary}</li>}
                    {p.app_store_url && (
                      <li>
                        <span className="text-cyan-400 font-semibold">App Store:</span>{" "}
                        <a href={p.app_store_url} target="_blank" className="underline text-cyan-300 hover:text-cyan-400 break-all">{p.app_store_url}</a>
                      </li>
                    )}
                  </ul>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-md font-semibold transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(p.id);
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-md font-semibold transition"
                      disabled={deletingId === p.id}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {deletingId === p.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10 text-lg">
              No projects found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
