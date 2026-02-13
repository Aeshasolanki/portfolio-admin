"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBlogPage() {
  const router = useRouter();
  const API_URL = "https://portfolio-backend-clhc.onrender.com/api/blogs";

  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    content: "",
    author_name: "",
    category: "",
    status: "published",
  });

  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      slug:
        name === "title" && !prev.slug
          ? value.toLowerCase().trim().replace(/\s+/g, "-") + "-" + Date.now()
          : prev.slug,
    }));
  };

  const saveBlog = async () => {
    try {
      setSaving(true);
      const payload = {
        ...form,
        slug:
          form.slug && form.slug.trim().length > 0
            ? form.slug.trim()
            : (form.title || "").toLowerCase().trim().replace(/\s+/g, "-") + "-" + Date.now(),
      };

      if (!payload.title || !payload.content || !payload.slug) {
        alert("Please fill Title and Content (Slug will be auto-generated).");
        setSaving(false);
        return;
      }

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) =>
        formData.append(key, value as string)
      );
      if (image) formData.append("image", image);

      const res = await fetch(API_URL, { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(typeof data?.error === "string" ? data.error : "Failed to create blog");
        setSaving(false);
        return;
      }
      router.push("/admin/blogs");
    } catch (err) {
      console.error(err);
      alert("Unexpected error while creating blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] to-[#0f122a] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            📝 Add New Blog
          </h1>
          <p className="text-gray-400">Create a fresh blog entry</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0f172a]/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-cyan-500/20 hover:shadow-cyan-500/50 transition-all duration-500">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-300 font-medium">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Blog title"
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
                placeholder="blog-slug"
                className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
            </div>

            {/* Short Description */}
            <div className="md:col-span-2 flex flex-col space-y-2">
              <label className="text-sm text-gray-300 font-medium">
                Short Description
              </label>
              <textarea
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                rows={3}
                placeholder="Summary of the blog"
                className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2 flex flex-col space-y-2">
              <label className="text-sm text-gray-300 font-medium">Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={5}
                placeholder="Full content"
                className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
            </div>

            {/* Author */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-300 font-medium">Author Name</label>
              <input
                name="author_name"
                value={form.author_name}
                onChange={handleChange}
                placeholder="Author"
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

            {/* Status */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-300 font-medium">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-300 font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 w-full text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
              {image && <p className="text-xs text-cyan-400">Selected: {image.name}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6 justify-end">
            <button
              onClick={saveBlog}
              disabled={saving}
              className="px-8 py-3 rounded-2xl font-semibold text-black bg-cyan-400 hover:bg-cyan-500 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Blog"}
            </button>
            <button onClick={() => router.push("/admin/blogs")} className="px-8 py-3 rounded-2xl font-semibold text-white bg-gray-700 hover:bg-gray-600 transition">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
