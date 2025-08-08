import db from '@/lib/db'

export async function GET(req, { params }) {
  const { slug } = params
  try {
    const [rows] = await db.execute("SELECT * FROM pages WHERE slug = ?", [slug])
    if (rows.length === 0) {
      return Response.json({ message: "Page not found." }, { status: 404 })
    }
    return Response.json(rows[0])
  } catch (error) {
    return Response.json({ message: "Error fetching page." }, { status: 500 })
  }
}
