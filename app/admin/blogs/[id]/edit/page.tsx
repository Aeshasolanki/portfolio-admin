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
            : (form.title || "")
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-") +
              "-" +
              Date.now(),
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) =>
        formData.append(key, value as string)
      );

      if (image) formData.append("image", image);

      await fetch(`${API_URL}/${idParam}`, {
        method: "PUT",
        body: formData,
      });

      router.push("/admin/blogs");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!idParam) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Invalid Blog ID
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
            ✏️ Edit Blog
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Update and manage your blog content
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
                  { label: "Title", name: "title" },
                  { label: "Slug", name: "slug" },
                  { label: "Author Name", name: "author_name" },
                  { label: "Category", name: "category" },
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <input
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

                {/* Status */}
                <div className="relative">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-white/20 rounded-2xl px-4 py-4 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 outline-none transition"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Short Description */}
                <div className="md:col-span-2 relative">
                  <textarea
                    name="short_description"
                    value={form.short_description}
                    onChange={handleChange}
                    rows={3}
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
                    Short Description
                  </label>
                </div>

                {/* Content */}
                <div className="md:col-span-2 relative">
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={6}
                    placeholder=" "
                    className="peer w-full bg-transparent border border-white/20 rounded-2xl px-4 pt-6 pb-3 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 outline-none transition"
                  />
                  <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all 
                    peer-placeholder-shown:top-4 
                    peer-placeholder-shown:text-base 
                    peer-placeholder-shown:text-gray-500
                    peer-focus:top-2 
                    peer-focus:text-sm 
                    peer-focus:text-purple-400">
                    Content
                  </label>
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2 flex flex-col items-center gap-4">

                  {currentImageUrl && !image && (
                    <div className="relative group">
                      <div className="absolute inset-0 rounded-2xl bg-cyan-400 blur-2xl opacity-20 group-hover:opacity-40 transition" />
                      <img
                        src={currentImageUrl.replace(
                          "localhost:5000",
                          "portfolio-backend-clhc.onrender.com"
                        )}
                        alt="Current"
                        className="relative w-40 h-28 rounded-2xl object-cover border border-white/20 shadow-lg"
                      />
                    </div>
                  )}

                  {image && (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-40 h-28 rounded-2xl object-cover border border-white/20 shadow-lg"
                    />
                  )}

                  <label className="cursor-pointer bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 rounded-xl font-medium hover:scale-105 transition">
                    {image ? "Change Image" : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        setImage(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-5 pt-8 border-t border-white/10">
                <button
                  onClick={() => router.push("/admin/blogs")}
                  className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={saveBlog}
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
