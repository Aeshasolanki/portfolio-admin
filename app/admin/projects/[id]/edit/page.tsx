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
        const project = Array.isArray(data)
          ? data.find((p: any) => p.id === idParam)
          : null;

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

      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value as string)
      );

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
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Invalid Project ID
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060b16] via-[#0b1120] to-[#111827] text-white px-6 py-14 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="relative max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            ✏️ Edit Project
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Modify and enhance your project details
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-[0_0_60px_rgba(0,255,255,0.08)]">

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-8">

              <div className="grid md:grid-cols-2 gap-8">

                {[
                  { label: "Project Name", name: "name" },
                  { label: "Slug", name: "slug" },
                  { label: "Category", name: "category" },
                  { label: "Tagline", name: "tagline" },
                  { label: "App Store URL", name: "app_store_url", type: "url" },
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={(form as any)[field.name]}
                      onChange={handleChange}
                      placeholder=" "
                      className="peer w-full bg-transparent border border-white/20 rounded-2xl px-4 pt-6 pb-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition"
                    />
                    <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all 
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base 
                      peer-placeholder-shown:text-gray-500
                      peer-focus:top-2 
                      peer-focus:text-sm 
                      peer-focus:text-cyan-400">
                      {field.label}
                    </label>
                  </div>
                ))}

                {/* Description */}
                <div className="md:col-span-2 relative">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder=" "
                    rows={4}
                    className="peer w-full bg-transparent border border-white/20 rounded-2xl px-4 pt-6 pb-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition"
                  />
                  <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all 
                    peer-placeholder-shown:top-4 
                    peer-placeholder-shown:text-base 
                    peer-placeholder-shown:text-gray-500
                    peer-focus:top-2 
                    peer-focus:text-sm 
                    peer-focus:text-cyan-400">
                    Description
                  </label>
                </div>

                {/* Secondary Description */}
                <div className="md:col-span-2 relative">
                  <textarea
                    name="description_secondary"
                    value={form.description_secondary}
                    onChange={handleChange}
                    placeholder=" "
                    rows={3}
                    className="peer w-full bg-transparent border border-white/20 rounded-2xl px-4 pt-6 pb-3 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 outline-none transition"
                  />
                  <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all 
                    peer-placeholder-shown:top-4 
                    peer-placeholder-shown:text-base 
                    peer-placeholder-shown:text-gray-500
                    peer-focus:top-2 
                    peer-focus:text-sm 
                    peer-focus:text-purple-400">
                    Additional Details
                  </label>
                </div>

                {/* Icon Upload */}
                <div className="md:col-span-2 flex flex-col items-center gap-4">

                  {currentIconUrl && !icon && (
                    <div className="relative group">
                      <div className="absolute inset-0 rounded-full bg-cyan-400 blur-2xl opacity-30 group-hover:opacity-60 transition" />
                      <img
                        src={currentIconUrl.replace(
                          "localhost:5000",
                          "portfolio-backend-clhc.onrender.com"
                        )}
                        alt="Project Icon"
                        className="relative w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-xl"
                      />
                    </div>
                  )}

                  <label className="cursor-pointer bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 rounded-xl font-medium hover:scale-105 transition">
                    {icon ? "Change Icon" : "Upload New Icon"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        setIcon(e.target.files?.[0] || null)
                      }
                    />
                  </label>

                  {icon && (
                    <p className="text-sm text-cyan-400">
                      Selected: {icon.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-5 pt-8 border-t border-white/10">
                <button
                  onClick={() => router.push("/admin/projects")}
                  className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={saveProject}
                  disabled={saving}
                  className="px-10 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:scale-105 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
