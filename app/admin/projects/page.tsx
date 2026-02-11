"use client";

import AdminNavbar from "@/app/AdminNavbar";
import { useEffect, useState } from "react";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
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

const fetchProjects = async () => {
  const res = await fetch("https://portfolio-backend-clhc.onrender.com/api/apps");
  const data = await res.json();
  setProjects(data.apps);
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

    await fetch("https://portfolio-backend-clhc.onrender.com/api/apps", {
      method: "POST",
      body: formData,
    });

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
  };

  const deleteProject = async (id: number) => {
    await fetch(`https://portfolio-backend-clhc.onrender.com/api/apps/${id}`, {
      method: "DELETE",
    });
    fetchProjects();
  };

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <AdminNavbar/>
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

      {/* ===== Add Project Form ===== */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              value={(form as any)[key]}
              onChange={handleChange}
              placeholder={key.replace("_", " ")}
              className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <input
            type="file"
            onChange={(e) => setIcon(e.target.files?.[0] || null)}
            className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
          />
        </div>

        <button
          onClick={addProject}
          className="bg-blue-600 hover:bg-blue-700 transition mt-6 px-6 py-2 rounded font-semibold"
        >
          Add Project
        </button>
      </div>

      {/* ===== Projects Table ===== */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Slug</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Tagline</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Description Secondary</th>
                <th className="p-3 text-left">App Store URL</th>
                <th className="p-3 text-left">Icon</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p: any) => (
                <tr key={p.id} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.name}</td>
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
                        src={p.icon_url}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      "No icon"
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteProject(p.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center p-4 text-gray-400">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
