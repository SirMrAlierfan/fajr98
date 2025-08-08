import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { password } = await req.json();

  const validPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;

  if (password === validPassword) {
    const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '1h' });

    const cookie = serialize('admin_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({ error: 'رمز اشتباه است' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
