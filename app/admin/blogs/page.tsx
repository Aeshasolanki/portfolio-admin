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
    }
  };

  const goToEdit = (id: number) => router.push(`/admin/blogs/${id}/edit`);

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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] to-[#0f122a] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              📝 Blogs Admin
            </h1>
            <p className="text-gray-400">Manage and organize your portfolio blogs</p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="px-6 py-3 rounded-2xl font-semibold text-black bg-cyan-400 hover:bg-cyan-500 transition"
          >
            + Add Blog
          </Link>
        </div>

        {/* Blogs List */}
        <div className="space-y-6">
          {blogs.length > 0 ? (
            blogs.map((b) => (
              <div
                key={b.id}
                className="bg-[#0f172a]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:shadow-lg hover:shadow-cyan-400/40 transition cursor-pointer"
                onClick={() => goToEdit(b.id)}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Blog Image */}
                  {b.image_url && (
                    <img
                      src={b.image_url.replace("localhost:5000", "portfolio-backend-clhc.onrender.com")}
                      alt={b.title}
                      className="w-full md:w-28 h-28 object-cover rounded-2xl border border-white/10"
                    />
                  )}

                  {/* Blog Details */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-bold text-cyan-400">{b.title}</h3>
                    <p className="text-gray-300 line-clamp-2">{b.short_description}</p>

                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                      <p><span className="text-purple-400">Slug:</span> {b.slug}</p>
                      <p><span className="text-purple-400">Category:</span> {b.category}</p>
                    </div>

                    <p className="text-gray-400 line-clamp-3">{b.content}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                      <p><span className="text-cyan-400">Author:</span> {b.author_name}</p>
                      <p><span className="text-cyan-400">Status:</span> {b.status}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3 justify-end">
                  <Link
                    href={`/admin/blogs/${b.id}/edit`}
                    className="px-5 py-2 rounded-2xl font-semibold text-white bg-slate-700 hover:bg-slate-600 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlog(b.id);
                    }}
                    className="px-5 py-2 rounded-2xl font-semibold text-white bg-red-600 hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-20 text-lg">No blogs found</p>
          )}
        </div>
      </div>
    </div>
  );
}
