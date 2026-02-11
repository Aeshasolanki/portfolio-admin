"use client";

import AdminNavbar from "@/app/AdminNavbar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [icon, setIcon] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    tagline: "",
    description: "",
    description_secondary: "",
    app_store_url: "",
  });

  const BASE_URL = "https://portfolio-backend-clhc.onrender.com";

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/apps`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addProject = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    if (icon) formData.append("icon", icon);

    try {
      await fetch(`${BASE_URL}/api/apps`, { method: "POST", body: formData });
      setForm({
        name: "",
        slug: "",
        category: "",
        tagline: "",
        description: "",
        description_secondary: "",
        app_store_url: "",
      });
      setIcon(null);
      fetchProjects();
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await fetch(`${BASE_URL}/api/apps/${id}`, { method: "DELETE" });
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div className="p-10 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white">
      <AdminNavbar />
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-extrabold mb-10 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
      >
        Admin Panel
      </motion.h1>

      {/* ===== Add Project Form ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl mb-12 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-400">
          Add New Project
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.keys(form).map((key) => (
            <motion.input
              key={key}
              name={key}
              value={(form as any)[key]}
              onChange={handleChange}
              placeholder={key.replace("_", " ")}
              whileFocus={{ scale: 1.05, borderColor: "#4f46e5" }}
              className="border border-gray-600 rounded-xl px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          ))}
          <motion.input
            type="file"
            onChange={(e) => setIcon(e.target.files?.[0] || null)}
            whileHover={{ scale: 1.05 }}
            className="border border-gray-600 rounded-xl px-4 py-3 bg-gray-700 text-white"
          />
        </div>
        <motion.button
          onClick={addProject}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 mt-6 px-8 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition"
        >
          Add Project
        </motion.button>
      </motion.div>

      {/* ===== Projects Table ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-purple-400">
          Projects
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                {["ID", "Name", "Slug", "Category", "Tagline", "Description", "Description Secondary", "App Store URL", "Icon", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="p-3 text-left text-gray-200 uppercase tracking-wider text-sm"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {projects.filter((p) => p.name).map((p) => (
                <motion.tr
                  key={p.id}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="border-t border-gray-700"
                >
                  <td className="p-3">{p.id}</td>
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{p.slug}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.tagline}</td>
                  <td className="p-3">{p.description}</td>
                  <td className="p-3">{p.description_secondary}</td>
                  <td className="p-3">
                    <a
                      href={p.app_store_url}
                      target="_blank"
                      className="text-blue-400 underline"
                    >
                      Link
                    </a>
                  </td>
                  <td className="p-3">
                    {p.icon_url ? (
                      <img
                        src={p.icon_url.replace("localhost:5000", "portfolio-backend-clhc.onrender.com")}
                        alt={p.name || "Project Icon"}
                        className="w-12 h-12 object-cover rounded-xl border border-gray-600"
                      />
                    ) : (
                      "No icon"
                    )}
                  </td>
                  <td className="p-3">
                    <motion.button
                      onClick={() => deleteProject(p.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full font-semibold transition"
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center p-6 text-gray-400">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
