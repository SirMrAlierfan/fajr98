import React, { useState } from "react";
import GeneralAdminPanel from "./GeneralAdminPanel";
import { BASE_PAGES, BASE_MAJORS } from "@/lib/adminApi";

export default function AdminDashboard({ isAdmin = true }) {
  // 📌 تعریف پنل‌ها همراه با apiBaseUrl و collectionKey
  const panels = [
    { key: "general", title: "صفحات عمومی", apiBase: BASE_PAGES, collectionKey: "pages" },
    { key: "majors", title: "معرفی رشته‌ها", apiBase: BASE_MAJORS, collectionKey: "majors" },
  ];

  const [mode, setMode] = useState(panels[0].key);
  const active = panels.find((p) => p.key === mode) || panels[0];

  return (
    <div>
      <div className="flex gap-3 mb-6">
        {panels.map((p) => (
          <button
            key={p.key}
            className={`px-3 py-1 rounded ${mode === p.key ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            onClick={() => setMode(p.key)}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* 📌 حالا collectionKey هم پاس داده میشه */}
      <GeneralAdminPanel
        key={`${active.apiBase}-${active.collectionKey}`}   // 👈 مهم
        apiBaseUrl={active.apiBase}
        collectionKey={active.collectionKey}
        isAdmin={isAdmin}
      />

    </div>
  );
}
