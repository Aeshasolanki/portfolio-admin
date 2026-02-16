"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Blog {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  content: string;
  author_name: string;
  category: string;
  status: string;
  image_url?: string;
}

export default function AdminBlogs() {
  const router = useRouter();
  const API_URL = "https://portfolio-backend-clhc.onrender.com/api/blogs";

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060b16] via-[#0b1120] to-[#111827] text-white px-6 py-14 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              📚 Blog Admin
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Manage and review all blog content
            </p>
          </div>

          <Link
            href="/admin/blogs/new"
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:scale-105 transition"
          >
            + Add Blog
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-[0_0_60px_rgba(0,255,255,0.08)]">

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-lg">
              No blogs found
            </p>
          ) : (
            <div className="space-y-12">
              {blogs.map((b) => (
                <div
                  key={b.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-400/50 transition"
                >
                  <div className="flex flex-col md:flex-row gap-8">

                    {/* Image */}
                    {b.image_url && (
                      <img
                        src={b.image_url.replace(
                          "localhost:5000",
                          "portfolio-backend-clhc.onrender.com"
                        )}
                        alt={b.title}
                        className="w-full md:w-48 h-48 object-cover rounded-2xl border border-white/10"
                      />
                    )}

                    <div className="flex-1 space-y-6">

                      {/* Title + Status */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-3xl font-bold text-white">
                          {b.title}
                        </h2>

                        <span
                          className={`px-4 py-1 rounded-full text-sm font-semibold ${
                            b.status === "published"
                              ? "bg-cyan-500/20 text-cyan-400"
                              : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      {/* Meta Info */}
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                        <p>
                          <span className="text-cyan-400 font-semibold">Slug:</span>{" "}
                          {b.slug}
                        </p>
                        <p>
                          <span className="text-cyan-400 font-semibold">Category:</span>{" "}
                          {b.category}
                        </p>
                        <p>
                          <span className="text-cyan-400 font-semibold">Author:</span>{" "}
                          {b.author_name}
                        </p>
                      </div>

                      {/* Short Description */}
                      <div>
                        <h4 className="text-cyan-400 font-semibold mb-2">
                          Short Description
                        </h4>
                        <p className="text-gray-400 whitespace-pre-wrap">
                          {b.short_description}
                        </p>
                      </div>

                      {/* Full Content */}
                      <div>
                        <h4 className="text-purple-400 font-semibold mb-2">
                          Full Content
                        </h4>
                        <p className="text-gray-300 whitespace-pre-wrap">
                          {b.content}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-4 pt-6 border-t border-white/10">
                        <Link
                          href={`/admin/blogs/${b.id}/edit`}
                          className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteBlog(b.id)}
                          className="px-6 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
