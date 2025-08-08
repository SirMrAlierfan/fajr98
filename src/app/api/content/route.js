// src/app/api/content/route.js
import db from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");

    if (!page) return Response.json({ error: "Missing page param" }, { status: 400 });

    const [rows] = await db.execute(
      "SELECT * FROM contents WHERE page_name = ? ORDER BY date DESC LIMIT 1",
      [page]
    );

    return Response.json(rows[0] || {});
  } catch (err) {
    console.error("❌ API Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
