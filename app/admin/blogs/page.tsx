"use client";


import { useEffect, useState } from "react";

interface BlogForm {
  title: string;
  slug: string;
  short_description: string;
  content: string;
  author_name: string;
  category: string;
  tags: string;
  status: string;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [form, setForm] = useState<BlogForm>({
    title: "",
    slug: "",
    short_description: "",
    content: "",
    author_name: "CEO",
    category: "",
    tags: "",
    status: "published",
  });
  const [loading, setLoading] = useState(false);

  const API_URL = "https://portfolio-backend-clhc.onrender.com/api/blogs";

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/blogs`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setBlogs([]);
      alert("Failed to fetch blogs. Make sure backend is running.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      slug:
        name === "title" && !prev.slug
          ? value.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now()
          : prev.slug,
    }));
  };

  // Add blog
  const addBlog = async () => {
    if (!form.title || !form.content) return alert("Title and content required");

    const payload = { ...form, tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [] };

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Failed to add blog: " + (data.message || JSON.stringify(data)));
        setLoading(false);
        return;
      }

      setForm({
        title: "",
        slug: "",
        short_description: "",
        content: "",
        author_name: "CEO",
        category: "",
        tags: "",
        status: "published",
      });

      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Server error while adding blog");
    }
    setLoading(false);
  };

  // Delete blog
  const deleteBlog = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`https://portfolio-backend-clhc.onrender.com/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Server error while deleting blog");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
     
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-8">Admin Blogs</h1>

        {/* Add Blog Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-semibold mb-4">Add New Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border rounded px-3 py-2 bg-gray-700 text-white" />
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug" className="border rounded px-3 py-2 bg-gray-700 text-white" />
            <input name="short_description" value={form.short_description} onChange={handleChange} placeholder="Short Description" className="border rounded px-3 py-2 bg-gray-700 text-white col-span-2" />
            <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" className="border rounded px-3 py-2 bg-gray-700 text-white col-span-2" rows={4} />
            <input name="author_name" value={form.author_name} onChange={handleChange} placeholder="Author" className="border rounded px-3 py-2 bg-gray-700 text-white" />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border rounded px-3 py-2 bg-gray-700 text-white" />
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="border rounded px-3 py-2 bg-gray-700 text-white" />
            <input name="status" value={form.status} onChange={handleChange} placeholder="Status" className="border rounded px-3 py-2 bg-gray-700 text-white" />
          </div>

          <button onClick={addBlog} disabled={loading} className={`bg-blue-600 hover:bg-blue-700 mt-6 px-6 py-2 rounded font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Adding..." : "Add Blog"}
          </button>
        </div>

        {/* Blogs Table */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Blogs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Slug</th>
                  <th className="p-3 text-left">Short Description</th>
                  <th className="p-3 text-left">Content</th>
                  <th className="p-3 text-left">Author</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Tags</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(blogs) && blogs.length > 0 ? (
                  blogs.map((b) => (
                    <tr key={b.id} className="border-t border-gray-700 hover:bg-gray-700">
                      <td className="p-3">{b.id}</td>
                      <td className="p-3">{b.title}</td>
                      <td className="p-3">{b.slug}</td>
                      <td className="p-3">{b.short_description}</td>
                      <td className="p-3">{b.content}</td>
                      <td className="p-3">{b.author_name}</td>
                      <td className="p-3">{b.category}</td>
                      <td className="p-3">{b.tags ? JSON.parse(b.tags).join(", ") : ""}</td>
                      <td className="p-3">{b.status}</td>
                      <td className="p-3">
                        <button onClick={() => deleteBlog(b.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-semibold">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center p-4 text-gray-400">No blogs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
