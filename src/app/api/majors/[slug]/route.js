import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req, { params }) {
  const { slug } = params;

  const [rows] = await db.execute(
    'SELECT * FROM contents WHERE page_name = ? ORDER BY date DESC LIMIT 1',
    [slug]
  );

  return NextResponse.json(rows[0] || {});
}
