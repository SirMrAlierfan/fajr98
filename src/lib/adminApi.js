// src/lib/adminApi.js

// ==================== Base URLs ====================
// مقدار اینها از .env میاد
export const BASE_PAGES = process.env.NEXT_PUBLIC_BASE_PAGES;
export const BASE_MAJORS = process.env.NEXT_PUBLIC_BASE_MAJORS;

// ==================== ابزار مشترک ====================
async function handleRes(res, errorMsg) {
  // تلاش می‌کنیم پاسخ JSON رو پارس کنیم؛ اگر پاسخ 204 باشه یا JSON نبود، مناسب هندل می‌کنیم
  if (!res.ok) {
    // سعی کنیم ارور سرور رو بخونیم (اگر JSON باشه)
    let errText = errorMsg;
    try {
      const j = await res.json();
      if (j && j.error) errText = j.error;
      else if (j && j.message) errText = j.message;
    } catch (_) {
      // ignore
    }
    throw new Error(errText);
  }

  // اگر پاسخ بدون بدنه باشه
  if (res.status === 204) return null;

  // سعی به خواندن JSON
  try {
    return await res.json();
  } catch (e) {
    // اگر JSON نبود برگرد متن خام
    try {
      return await res.text();
    } catch {
      return null;
    }
  }
}

// ==================== Base map ====================
const BASES = {
  pages: BASE_PAGES,
  majors: BASE_MAJORS,
};

// helper داخلی برای ساختن آدرس کامل
function baseFor(type) {
  const base = BASES[type];
  if (!base) throw new Error(`نوع ناشناخته یا آدرس پایه تنظیم نشده: ${type}`);
  return base.replace(/\/+$/, ""); // بدون اسلش انتهایی
}

// ==================== CRUD عمومی ====================

// دریافت لیست آیتم‌ها
export async function listItems(type) {
  const base = baseFor(type);
  const res = await fetch(`${base}/${type}`, { cache: "no-store" });
  return handleRes(res, `خطا در دریافت لیست ${type}`);
}

// دریافت یک آیتم بر اساس slug
export async function getItem(type, slug) {
  if (!slug) throw new Error("slug لازم است");
  const base = baseFor(type);
  // query by slug
  const res = await fetch(`${base}/${type}?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
  const data = await handleRes(res, `خطا در بارگذاری ${type}`);
  return Array.isArray(data) ? (data.length > 0 ? data[0] : null) : data;
}

// ایجاد یا آپدیت آیتم
export async function saveItem(type, data) {
  if (!data) throw new Error("داده‌ای برای ذخیره وجود ندارد");
  const base = baseFor(type);

  if (data.id) {
    // آپدیت
    const res = await fetch(`${base}/${type}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleRes(res, `خطا در ذخیره ${type}`);
  } else {
    // ایجاد جدید
    const res = await fetch(`${base}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleRes(res, `خطا در ایجاد ${type}`);
  }
}

// حذف آیتم
export async function deleteItem(type, id) {
  if (!id) throw new Error("id لازم است");
  const base = baseFor(type);
  const res = await fetch(`${base}/${type}/${id}`, { method: "DELETE" });
  return handleRes(res, `خطا در حذف ${type}`);
}

// ==================== Backwards-compatible wrappers ====================
// (برای اینکه لازم نباشه بقیهٔ سورس رو تغییر بدی)

export const listPages = () => listItems("pages");
export const listMajors = () => listItems("majors");

export const getPage = (slug) => getItem("pages", slug);
export const getMajor = (slug) => getItem("majors", slug);

export const savePage = (data) => saveItem("pages", data);
export const saveMajor = (data) => saveItem("majors", data);

export const deletePage = (id) => deleteItem("pages", id);
export const deleteMajor = (id) => deleteItem("majors", id);

// ==================== Admin (login) ====================
export async function login(password) {
  if (!password) throw new Error("رمز عبور لازم است");

  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "خطا در ورود");
  }

  return res.json();
}

/**
 * استفاده:
 * const page = await getItem("pages", "my-slug");
 * const major = await getItem("majors", "cs");
 *
 * یا با wrapper قدیمی:
 * const page = await getPage("my-slug");
 */
