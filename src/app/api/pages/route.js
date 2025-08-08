import db from '@/lib/db'

export async function POST(req) {
  try {
    const { slug, title, content } = await req.json()

    if (!slug || !content) {
      return Response.json({ message: 'slug و content الزامی هستند.' }, { status: 400 })
    }

    await db.execute(
      `INSERT INTO pages (slug, title, content)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)`,
      [slug, title, content]
    )

    return Response.json({ message: 'صفحه ذخیره شد.' })
  } catch (err) {
    console.error(err)
    return Response.json({ message: 'خطا در ذخیره‌سازی.' }, { status: 500 })
  }
}
