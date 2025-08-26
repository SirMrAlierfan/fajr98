"use client";

import { useState, useEffect } from "react";
import { listPages, listMajors } from "@/lib/adminApi";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState([]);
  const [majors, setMajors] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [filteredMajors, setFilteredMajors] = useState([]);

  // فقط یکبار همه داده‌ها رو بگیر
  useEffect(() => {
    async function fetchData() {
      try {
        const [pagesData, majorsData] = await Promise.all([
          listPages(),
          listMajors(),
        ]);
        setPages(pagesData);
        setMajors(majorsData);
      } catch (err) {
        console.error("❌ خطا در گرفتن داده‌ها:", err);
      }
    }
    fetchData();
  }, []);

  // فیلتر روی داده‌ها
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredPages([]);
      setFilteredMajors([]);
      return;
    }

    const q = query.toLowerCase();

    setFilteredPages(
      pages.filter((p) =>
        (p.page_title || p.title || p.slug)?.toLowerCase().includes(q)
      )
    );

    setFilteredMajors(
      majors.filter((m) =>
        (m.name || m.title || m.slug)?.toLowerCase().includes(q)
      )
    );
  }, [query, pages, majors]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="جستجو کنید..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
      />

      {(filteredPages.length > 0 || filteredMajors.length > 0) && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg text-right max-h-72 overflow-y-auto">
          {/* صفحات */}
          {filteredPages.length > 0 && (
            <div className="border-b border-gray-200">
              <h3 className="px-4 py-2 text-sm font-bold text-gray-600">📄 صفحات</h3>
              <ul>
                {filteredPages.map((item, index) => (
                  <li
                    key={`page-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => (window.location.href = `/${item.slug}`)}
                  >
                    {item.page_title || item.title || item.slug}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* رشته‌ها */}
          {filteredMajors.length > 0 && (
            <div>
              <h3 className="px-4 py-2 text-sm font-bold text-gray-600">🎓 رشته‌ها</h3>
              <ul>
                {filteredMajors.map((item, index) => (
                  <li
                    key={`major-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/majors/${item.slug || item.id}`)
                    }
                  >
                    {item.name || item.title || item.slug}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
