// src/app/sitemap.js
import { listPages, listMajors } from "@/lib/adminApi";

export default async function sitemap() {
  const baseUrl = "https://fajr98.ir";

  // گرفتن صفحات و رشته‌ها از API
  const [pages, majors] = await Promise.all([
    listPages(),
    listMajors(),
  ]);

  // صفحات استاتیک
  const staticRoutes = [
    { url: "/", priority: 1.0 },
    
  ];

  // صفحات داینامیک
  const pageRoutes = (pages || []).map((p) => ({
    url: `/pages/${p.slug}`,
    lastModified: p.updatedAt || p.publishedAt || new Date().toISOString(),
    priority: 0.7,
  }));

  // رشته‌ها
  const majorRoutes = (majors || []).map((m) => ({
    url: `/majors/${m.slug}`,
    lastModified: m.updatedAt || m.publishedAt || new Date().toISOString(),
    priority: 0.7,
  }));

  // ترکیب همه
  return [
    ...staticRoutes.map((r) => ({
      url: `${baseUrl}${r.url}`,
      lastModified: new Date().toISOString(), // برای صفحات استاتیک همیشه امروز
    })),
    ...pageRoutes.map((r) => ({
      url: `${baseUrl}${r.url}`,
      lastModified: r.lastModified,
    })),
    ...majorRoutes.map((r) => ({
      url: `${baseUrl}${r.url}`,
      lastModified: r.lastModified,
    })),
  ];
}
