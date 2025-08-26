import { NextResponse } from "next/server";
import { listPages, listMajors } from "@/lib/adminApi";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase() || "";

  try {
    // گرفتن داده‌ها از دو منبع
    const [pages, majors] = await Promise.all([listPages(), listMajors()]);

    // ساختن نتایج
    const results = [
      ...pages.map(p => ({
        title: p.page_title || p.title || p.slug,
        path: `/${p.slug || p.page_name || ""}`,
        type: "page",
      })),
      ...majors.map(m => ({
        title: m.name || m.title,
        path: `/majors/${m.slug || m.id}`,
        type: "major",
      })),
    ];

    // فیلتر بر اساس سرچ
    const filtered = q
      ? results.filter(r => r.title?.toLowerCase().includes(q))
      : results;

    return NextResponse.json(filtered);
  } catch (err) {
    console.error("❌ Error in search API:", err);
    return NextResponse.json({ error: "خطا در جستجو" }, { status: 500 });
  }
}
