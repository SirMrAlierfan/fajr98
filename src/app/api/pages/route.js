// src/app/api/pages/route.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { slug, title, content } = await req.json()

    if (!slug || !content) {
      return Response.json({ message: 'slug و content الزامی هستند.' }, { status: 400 })
    }

    // ذخیره یا آپدیت صفحه
    const page = await prisma.page.upsert({
      where: { slug },
      update: { title },
      create: { slug, title }
    })

    // حذف محتوای قبلی و ذخیره محتوای جدید
    await prisma.pageContent.deleteMany({ where: { pageId: page.id } })

    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content
    await prisma.pageContent.createMany({
      data: parsedContent.map((block, index) => ({
        type: block.type,
        content: block.value,
        order: index,
        pageId: page.id
      }))
    })

    return Response.json({ message: 'صفحه ذخیره شد.' })
  } catch (err) {
    console.error(err)
    return Response.json({ message: 'خطا در ذخیره‌سازی.' }, { status: 500 })
  }
}
