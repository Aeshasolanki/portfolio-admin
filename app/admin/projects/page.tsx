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
    <div className="min-h-screen bg-gradient-to-br from-[#060b16] via-[#0b1120] to-[#111827] text-white px-6 py-14 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="relative max-w-6xl mx-auto space-y-14">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            🚀 Projects Admin
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your projects in a premium dashboard
          </p>
        </div>

        {/* TOP BAR */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">Project Library</h2>

          <Link
            href="/admin/projects/new"
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:scale-105 transition"
          >
            + Add Project
          </Link>
        </div>

        {/* PROJECT LIST */}
        <div className="grid gap-8">
          {projects.length > 0 ? (
            projects.map((p) => (
              <div
                key={p.id}
                onClick={() => goToEdit(p.id)}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row items-start gap-8">

                  {/* Icon */}
                  {p.icon_url && (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-cyan-400 blur-2xl opacity-20 group-hover:opacity-40 transition" />
                      <img
                        src={p.icon_url.replace(
                          "localhost:5000",
                          "portfolio-backend-clhc.onrender.com"
                        )}
                        alt={p.name}
                        className="relative w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-xl"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 space-y-3">

                    <h3 className="text-3xl font-bold text-white">
                      {p.name}
                    </h3>

                    {p.tagline && (
                      <p className="text-gray-400 italic">
                        {p.tagline}
                      </p>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 text-sm mt-4 text-gray-300">

                      <div>
                        <span className="text-cyan-400 font-semibold">Slug:</span>{" "}
                        {p.slug}
                      </div>

                      <div>
                        <span className="text-cyan-400 font-semibold">Category:</span>{" "}
                        {p.category}
                      </div>

                      {p.description && (
                        <div className="md:col-span-2">
                          <span className="text-cyan-400 font-semibold">Description:</span>{" "}
                          {p.description}
                        </div>
                      )}

                      {p.description_secondary && (
                        <div className="md:col-span-2">
                          <span className="text-purple-400 font-semibold">Additional:</span>{" "}
                          {p.description_secondary}
                        </div>
                      )}

                      {p.app_store_url && (
                        <div className="md:col-span-2">
                          <span className="text-cyan-400 font-semibold">App Store:</span>{" "}
                          <a
                            href={p.app_store_url}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="underline text-cyan-300 hover:text-cyan-400 break-all"
                          >
                            {p.app_store_url}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-6">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(p.id);
                        }}
                        disabled={deletingId === p.id}
                        className="px-6 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 transition disabled:opacity-60"
                      >
                        {deletingId === p.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500 text-lg">
              No projects found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
