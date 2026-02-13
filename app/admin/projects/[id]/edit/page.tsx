"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : null;

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    tagline: "",
    description: "",
    description_secondary: "",
    app_store_url: "",
  });
  const [icon, setIcon] = useState<File | null>(null);
  const [currentIconUrl, setCurrentIconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const BASE_URL = "https://portfolio-backend-clhc.onrender.com";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/apps`);
        const data = await res.json();
        const project = Array.isArray(data) ? data.find((p: any) => p.id === idParam) : null;
        if (project) {
          setForm({
            name: project.name || "",
            slug: project.slug || "",
            category: project.category || "",
            tagline: project.tagline || "",
            description: project.description || "",
            description_secondary: project.description_secondary || "",
            app_store_url: project.app_store_url || "",
          });
          setCurrentIconUrl(project.icon_url || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (idParam) load();
  }, [idParam]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProject = async () => {
    if (!idParam) return;
    try {
      setSaving(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value as string));
      if (icon) formData.append("icon", icon);

      await fetch(`${BASE_URL}/api/apps/${idParam}`, {
        method: "PUT",
        body: formData,
      });

      router.push("/admin/projects");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!idParam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0f1a] to-[#0f122a] text-white px-6">
        <p className="text-gray-400 text-lg">Invalid project ID</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] to-[#0f122a] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            ✏️ Edit Project
          </h1>
          <p className="text-gray-400">Update your project details below</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0f172a]/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-cyan-500/20 hover:shadow-cyan-500/50 transition-all duration-500">
          {loading ? (
            <p className="text-gray-400 text-center py-10">Loading project...</p>
          ) : (
            <div className="space-y-6">
              {/* Grid Inputs */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-gray-300 font-medium">Project Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Project name"
                    className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                </div>

                {/* Slug */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-gray-300 font-medium">Slug</label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="project-slug"
                    className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-gray-300 font-medium">Category</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                </div>

                {/* Tagline */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-gray-300 font-medium">Tagline</label>
                  <input
                    name="tagline"
                    value={form.tagline}
                    onChange={handleChange}
                    placeholder="Short tagline"
                    className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 flex flex-col space-y-2">
                  <label className="text-sm text-gray-300 font-medium">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Main description"
                    className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                </div>

                {/* Secondary Description */}
                <div className="md:col-span-2 flex flex-col space-y-2">
                  <label className="text-sm text-gray-300 font-medium">Additional Details</label>
                  <textarea
                    name="description_secondary"
                    value={form.description_secondary}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Extra info"
                    className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                </div>

                {/* App Store URL */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-gray-300 font-medium">App Store URL</label>
                  <input
                    type="url"
                    name="app_store_url"
                    value={form.app_store_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                </div>

                {/* Icon Upload */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-gray-300 font-medium">Icon</label>
                  {currentIconUrl && !icon && (
                    <img
                      src={currentIconUrl.replace("localhost:5000", "portfolio-backend-clhc.onrender.com")}
                      alt="Current icon"
                      className="w-24 h-24 rounded-xl object-cover border border-white/20 shadow"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIcon(e.target.files?.[0] || null)}
                    className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                  {icon && <p className="text-xs text-cyan-400">New icon: {icon.name}</p>}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-6 justify-end">
                <button
                  onClick={saveProject}
                  disabled={saving}
                  className="px-8 py-3 rounded-2xl font-semibold text-black bg-cyan-400 hover:bg-cyan-500 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => router.push("/admin/projects")} className="px-8 py-3 rounded-2xl font-semibold text:white bg-gray-700 hover:bg-gray-600 transition">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
