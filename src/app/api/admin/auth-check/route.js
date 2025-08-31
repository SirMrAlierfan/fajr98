import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "توکن موجود نیست" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "توکن نامعتبر است" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
