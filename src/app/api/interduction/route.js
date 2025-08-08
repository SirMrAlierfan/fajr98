import { connectToDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const data = await req.json();
  const { slug, title, content, image } = data;

  if (!slug || !title || !content) {
    return NextResponse.json({ error: 'فیلدهای اجباری ناقص هستند' }, { status: 400 });
  }

  try {
    const db = await connectToDB();
    const query = `
      INSERT INTO interduction_sections (slug, title, content, image)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title=?, content=?, image=?;
    `;
    await db.execute(query, [slug, title, content, image, title, content, image]);

    return NextResponse.json({ message: 'با موفقیت ذخیره شد' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'خطا در ذخیره داده' }, { status: 500 });
  }
}
