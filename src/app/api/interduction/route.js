// src/app/api/interduction/route.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/interduction        -> لیست همه
// GET /api/interduction?slug=x -> دریافت یک آیتم بر اساس slug
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const item = await prisma.interduction.findUnique({
        where: { slug },
      })
      if (!item) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
      return new Response(JSON.stringify(item), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    const list = await prisma.interduction.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return new Response(JSON.stringify(list), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('GET /api/interduction error', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}

// POST /api/interduction
// body JSON: { slug, title, content, image }
// این مسیر upsert انجام می‌دهد: اگر slug وجود داشت آپدیت می‌کند، در غیر اینصورت می‌سازد.
export async function POST(req) {
  try {
    const body = await req.json()
    const { slug, title, content, image } = body

    if (!slug || !title || content === undefined) {
      return new Response(JSON.stringify({ error: 'slug, title و content الزامی هستند' }), { status: 400 })
    }

    const item = await prisma.interduction.upsert({
      where: { slug },
      update: {
        title,
        content: typeof content === 'object' ? JSON.stringify(content) : content,
        image: image || null,
      },
      create: {
        slug,
        title,
        content: typeof content === 'object' ? JSON.stringify(content) : content,
        image: image || null,
      }
    })

    return new Response(JSON.stringify({ success: true, item }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('POST /api/interduction error', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}

// PUT /api/interduction
// مشابه POST ولی انتظار: body شامل id یا slug باشه و فقط آپدیت کنه
export async function PUT(req) {
  try {
    const body = await req.json()
    const { id, slug, title, content, image } = body

    if (!id && !slug) {
      return new Response(JSON.stringify({ error: 'id یا slug الزامی برای آپدیت است' }), { status: 400 })
    }

    const where = id ? { id: Number(id) } : { slug }
    const updated = await prisma.interduction.update({
      where,
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content: typeof content === 'object' ? JSON.stringify(content) : content } : {}),
        ...(image !== undefined ? { image: image || null } : {}),
      }
    })

    return new Response(JSON.stringify({ success: true, updated }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('PUT /api/interduction error', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}

// DELETE /api/interduction
// body JSON: { id } یا query ?slug=...
export async function DELETE(req) {
  try {
    // سعی می‌کنیم پارامترها را از body یا query بگیریم
    let id = null
    let slug = null
    try {
      const body = await req.json().catch(() => null)
      if (body && body.id) id = body.id
      if (body && body.slug) slug = body.slug
    } catch {}
    const { searchParams } = new URL(req.url)
    if (!id && !slug) {
      slug = slug || searchParams.get('slug')
    }

    if (!id && !slug) {
      return new Response(JSON.stringify({ error: 'برای حذف id یا slug لازم است' }), { status: 400 })
    }

    const where = id ? { id: Number(id) } : { slug }
    await prisma.interduction.delete({ where })
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('DELETE /api/interduction error', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
