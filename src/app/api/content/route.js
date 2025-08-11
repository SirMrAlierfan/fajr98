// src/app/api/content/route.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("page")

    if (!slug) {
      return Response.json({ error: "پارامتر page الزامی است" }, { status: 400 })
    }

    const page = await prisma.page.findUnique({
      where: { slug },
      include: { contents: { orderBy: { order: 'asc' } } }
    })

    if (!page) return Response.json({}, { status: 404 })

    return Response.json(page)
  } catch (err) {
    console.error("❌ API Error:", err)
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}
