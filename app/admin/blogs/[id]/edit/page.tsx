"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : null;

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
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const blog = Array.isArray(data)
          ? data.find((b: any) => b.id === idParam)
          : null;
        if (blog) {
          setForm({
            title: blog.title || "",
            slug: blog.slug || "",
            short_description: blog.short_description || "",
            content: blog.content || "",
            author_name: blog.author_name || "",
            category: blog.category || "",
            status: blog.status || "published",
          });
          setCurrentImageUrl(blog.image_url || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (idParam) load();
  }, [idParam]);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveBlog = async () => {
    if (!idParam) return;
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
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value as string));
      if (image) formData.append("image", image);

      const res = await fetch(`${API_URL}/${idParam}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(typeof data?.error === "string" ? data.error : "Failed to update blog");
        setSaving(false);
        return;
      }
      router.push("/admin/blogs");
    } catch (err) {
      console.error(err);
      alert("Unexpected error while updating blog");
    } finally {
      setSaving(false);
    }
  };

  if (!idParam) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] to-[#0f122a] text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-400 text-lg">Invalid blog id</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] to-[#0f122a] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            ✏️ Edit Blog
          </h1>
          <p className="text-gray-400">Update your blog details</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0f172a]/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-cyan-500/20 hover:shadow-cyan-500/50 transition-all duration-500">
          {loading ? (
            <p className="text-gray-400 text-center py-10">Loading...</p>
          ) : (
            <>
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
                  <label className="text-sm text-gray-300 font-medium">Short Description</label>
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
                  {currentImageUrl && (
                    <img
                      src={currentImageUrl.replace(
                        "localhost:5000",
                        "portfolio-backend-clhc.onrender.com"
                      )}
                      alt="Current"
                      className="w-24 h-24 object-cover rounded-xl border border-white/10 shadow-sm"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="bg-[#09131f]/60 border border-white/10 rounded-2xl px-4 py-3 w-full text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                  {image && <p className="text-xs text-cyan-400">New image: {image.name}</p>}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-6 justify-end">
                <button
                  onClick={saveBlog}
                  disabled={saving}
                  className="px-8 py-3 rounded-2xl font-semibold text-black bg-cyan-400 hover:bg-cyan-500 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => router.push("/admin/blogs")} className="px-8 py-3 rounded-2xl font-semibold text-white bg-gray-700 hover:bg-gray-600 transition">Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
