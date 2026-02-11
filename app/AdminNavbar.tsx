"use client";

import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="bg-gray-800 p-4 flex space-x-6 text-white">
      <Link
        href="/admin/projects"
        className="hover:text-blue-400 font-semibold"
      >
        Projects
      </Link>
      <Link
        href="/admin/blogs"
        className="hover:text-blue-400 font-semibold"
      >
        Blogs
      </Link>
    </nav>
  );
}
