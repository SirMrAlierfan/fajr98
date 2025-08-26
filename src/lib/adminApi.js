// src/lib/adminApi.js

// 📌 پایگاه API برای صفحات
export const BASE_PAGES =
  process.env.BASE_PAGES ||
  "https://68a5f7fd2a3deed2960f7ee9.mockapi.io";

// 📌 پایگاه API برای رشته‌ها
export const BASE_MAJORS =
  process.env.BASE_MAJORS ||
  "https://687cd574918b642243300b2e.mockapi.io/api/links";

// ==================== ابزار مشترک ====================
async function handleRes(res, errorMsg) {
  if (!res.ok) throw new Error(errorMsg);
  return res.json();
}

// ==================== Pages ====================

// لیست صفحات
export async function listPages() {
  const res = await fetch(`${BASE_PAGES}/pages`, { cache: "no-store" });
  return handleRes(res, "خطا در دریافت لیست صفحات");
}

// دریافت یک صفحه بر اساس slug
export async function getPage(slug) {
  if (!slug) throw new Error("slug لازم است");
  const res = await fetch(
    `${BASE_PAGES}/pages?slug=${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  const data = await handleRes(res, "خطا در بارگذاری صفحه");
  return data.length > 0 ? data[0] : null;
}

// ذخیره یا آپدیت صفحه
export async function savePage(data) {
  if (!data) throw new Error("داده‌ای برای ذخیره وجود ندارد");

  if (data.id) {
    // آپدیت
    const res = await fetch(`${BASE_PAGES}/pages/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleRes(res, "خطا در ذخیره صفحه");
  } else {
    // ایجاد جدید
    const res = await fetch(`${BASE_PAGES}/pages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleRes(res, "خطا در ایجاد صفحه");
  }
}

// حذف صفحه
export async function deletePage(id) {
  if (!id) throw new Error("id لازم است");
  const res = await fetch(`${BASE_PAGES}/pages/${id}`, { method: "DELETE" });
  return handleRes(res, "خطا در حذف صفحه");
}

// ==================== Majors ====================

// لیست رشته‌ها
export async function listMajors() {
  const res = await fetch(`${BASE_MAJORS}/majors`, { cache: "no-store" });
  return handleRes(res, "خطا در دریافت لیست رشته‌ها");
}

// ذخیره یا آپدیت رشته
export async function saveMajor(data) {
  if (!data) throw new Error("داده‌ای برای ذخیره وجود ندارد");

  if (data.id) {
    // آپدیت
    const res = await fetch(`${BASE_MAJORS}/majors/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleRes(res, "خطا در ذخیره رشته");
  } else {
    // ایجاد جدید
    const res = await fetch(`${BASE_MAJORS}/majors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleRes(res, "خطا در ایجاد رشته");
  }
}

// حذف رشته
export async function deleteMajor(id) {
  if (!id) throw new Error("id لازم است");
  const res = await fetch(`${BASE_MAJORS}/majors/${id}`, { method: "DELETE" });
  return handleRes(res, "خطا در حذف رشته");
}
// ==================== Admin ====================

// لاگین
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
