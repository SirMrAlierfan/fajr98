'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from './AdminLayout';

export default function GeneralAdminPanel({ apiBaseUrl = '', collectionKey = 'pages', isAdmin = false }) {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const emptyForm = {
    id: '',
    slug: '',
    title: '',
    excerpt: '',
    publishedAt: '',
    cover: '',
    externalLink: '',
    blocks: [],
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
// وقتی کالکشن یا apiBaseUrl تغییر کرد، همه‌چی ریست شه
useEffect(() => {
  setPages([]);
  setForm(emptyForm);
  setSelectedId(null);
  setPreviewMode("desktop");
  setLoading(false);
  setLoadingList(true);

  listPagesReq()
    .then(setPages)
    .catch((err) => console.error(err))
    .finally(() => setLoadingList(false));
}, [apiBaseUrl, collectionKey]);

  
  async function getPageReq(slug) {
    const { base, key } = ensureApi();
    const byQuery = await fetch(`${base}/${key}?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (byQuery.ok) {
      const data = await byQuery.json();
      if (Array.isArray(data) && data.length) return data[0];
    }
    const byPath = await fetch(`${base}/${key}/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!byPath.ok) throw new Error('خطا در بارگذاری');
    return await byPath.json();
  } function ensureApi() {
    if (!apiBaseUrl) throw new Error("apiBaseUrl لازم است");
    const base = apiBaseUrl.replace(/\/+$/, "");
    const key = String(collectionKey || "pages").replace(/^\/+|\/+$/g, "");
    return { base, key };
  }

  async function listPagesReq() {
    const { base, key } = ensureApi();
    const res = await fetch(`${base}/${key}`, { cache: "no-store" });
    if (!res.ok) throw new Error("خطا در دریافت لیست");
    return await res.json();
  }

  // 📌 تغییر مهم: روی apiBaseUrl و collectionKey حساس شد
  useEffect(() => {
    setLoadingList(true);
    listPagesReq()
      .then(setPages)
      .catch((err) => console.error(err))
      .finally(() => setLoadingList(false));
  }, [apiBaseUrl, collectionKey]);

  async function savePageReq(page) {
    if (!isAdmin) throw new Error('دسترسی ندارید');
    const { base, key } = ensureApi();
    if (page.id) {
      const res = await fetch(`${base}/${key}/${encodeURIComponent(page.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      });
      if (!res.ok) throw new Error('خطا در بروزرسانی');
      return await res.json();
    } else {
      const res = await fetch(`${base}/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      });
      if (!res.ok) throw new Error('خطا در ایجاد');
      return await res.json();
    }
  }

  async function deletePageReq(id) {
    if (!isAdmin) throw new Error('دسترسی ندارید');
    const { base, key } = ensureApi();
    const res = await fetch(`${base}/${key}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('خطا در حذف');
    return true;
  }

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl, collectionKey]);

  async function loadList() {
    setLoadingList(true);
    try {
      const data = await listPagesReq();
      setPages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert(e.message || 'خطا در دریافت لیست');
    }
    setLoadingList(false);
  }

  async function loadPage(slug) {
    try {
      const data = await getPageReq(slug);
      setForm({
        id: data.id || '',
        slug: data.slug || '',
        title: data.title || '',
        excerpt: data.excerpt || '',
        publishedAt: data.publishedAt || '',
        cover: data.cover || '',
        externalLink: data.externalLink || '',
        blocks: data.blocks || [],
      });
      setSelectedId(data.id || null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      alert(e.message || 'خطا در بارگذاری');
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setSelectedId(null);
  }

  function addBlock(type) {
    if (!isAdmin) return;
    const newBlock = { type, value: type === 'gallery' ? [] : '', caption: '', id: Date.now() };
    setForm((f) => ({ ...f, blocks: [...(f.blocks || []), newBlock] }));
  }

  function updateBlock(i, patch) {
    if (!isAdmin) return;
    setForm((f) => {
      const b = [...(f.blocks || [])];
      b[i] = { ...b[i], ...patch };
      return { ...f, blocks: b };
    });
  }

  function removeBlock(i) {
    if (!isAdmin) return;
    setForm((f) => {
      const b = [...(f.blocks || [])];
      b.splice(i, 1);
      return { ...f, blocks: b };
    });
  }

  function moveBlock(i, dir) {
    if (!isAdmin) return;
    setForm((f) => {
      const b = [...(f.blocks || [])];
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= b.length) return f;
      [b[i], b[j]] = [b[j], b[i]];
      return { ...f, blocks: b };
    });
  }

  async function handleSave(e) {
    e?.preventDefault();
    if (!isAdmin) return alert('دسترسی ندارید');
    setLoading(true);
    try {
      const normalized = {
        ...form,
        blocks: (form.blocks || []).map((b) =>
          b.type === 'gallery' ? { ...b, value: Array.isArray(b.value) ? b.value : (b.value || []) } : b
        ),
      };
      const saved = await savePageReq(normalized);
      await loadList();
      if (saved && (saved.id || saved.slug)) {
        const slugToLoad = saved.slug || normalized.slug;
        if (slugToLoad) {
          await loadPage(slugToLoad);
        } else if (saved.id) {
          setSelectedId(saved.id);
          setForm((f) => ({ ...f, id: saved.id }));
        }
      } else {
        resetForm();
      }
      alert('ذخیره شد');
    } catch (err) {
      console.error(err);
      alert(err?.message || 'خطا در ذخیره');
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!isAdmin) return alert('دسترسی ندارید');
    if (!confirm('حذف شود؟')) return;
    try {
      await deletePageReq(id);
      if (selectedId === id) resetForm();
      await loadList();
      alert('حذف شد');
    } catch (e) {
      console.error(e);
      alert(e.message || 'خطا در حذف');
    }
  }

  const preview = useMemo(
    () => ({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      publishedAt: form.publishedAt,
      cover: form.cover,
      externalLink: form.externalLink,
      blocks: form.blocks || [],
    }),
    [form]
  );

  function openAdminPage(slug) {
    const key = String(collectionKey || 'pages').replace(/^\/+|\/+$/g, '');
    router.push(`/admin/${key}/${encodeURIComponent(slug)}`);
  }

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gray-50">
        <div className="lg:col-span-1 p-4 border rounded-2xl shadow bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">📑 صفحات</h3>
            <div className="flex items-center gap-2">
              <button onClick={loadList} className="text-sm text-blue-600">↻</button>
              {isAdmin && <button onClick={resetForm} className="text-sm text-green-600">➕ جدید</button>}
            </div>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {loadingList ? (
              <div className="text-sm text-gray-500">در حال بارگذاری...</div>
            ) : pages.length === 0 ? (
              <div className="text-sm text-gray-500">موردی نیست</div>
            ) : (
              pages.map((p) => (
                <div
                  key={p.id || p.slug}
                  onClick={() => p.slug && loadPage(p.slug)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${selectedId === p.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="truncate">
                    <button
                      className="font-semibold truncate text-right hover:underline"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        if (p.slug) openAdminPage(p.slug);
                      }}
                      title="رفتن به صفحه ادمین"
                    >
                      {p.title || 'بدون عنوان'}
                    </button>
                    <div className="text-xs text-gray-500 truncate">/{p.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        p.slug && loadPage(p.slug);
                      }}
                      className="text-sm text-blue-600"
                      title="نمایش"
                    >
                      👁️
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            p.slug && openAdminPage(p.slug);
                          }}
                          className="text-sm text-indigo-600"
                          title="ورود به صفحه ادمین"
                        >
                          ⚙️
                        </button>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleDelete(p.id);
                          }}
                          className="text-sm text-red-600"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 p-6 border rounded-2xl shadow bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold mb-4">
              {form.id ? (isAdmin ? '✏️ ویرایش صفحه' : '🔎 پیش‌نمایش صفحه') : (isAdmin ? '➕ افزودن صفحه' : '🔎 پیش‌نمایش جدید')}
            </h3>
            {!isAdmin && <div className="text-sm text-gray-500">تماشاگر</div>}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <input
              placeholder="slug"
              value={form.slug}
              onChange={(e) => isAdmin && setForm({ ...form, slug: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
              readOnly={!isAdmin}
            />

            <input
              placeholder="عنوان"
              value={form.title}
              onChange={(e) => isAdmin && setForm({ ...form, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
              readOnly={!isAdmin}
            />

            <textarea
              placeholder="خلاصه"
              value={form.excerpt}
              onChange={(e) => isAdmin && setForm({ ...form, excerpt: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
              rows={3}
              readOnly={!isAdmin}
            />

            <input
              type="date"
              value={form.publishedAt?.slice(0, 10) || ''}
              onChange={(e) => isAdmin && setForm({ ...form, publishedAt: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
              readOnly={!isAdmin}
            />

            <input
              placeholder="کاور"
              value={form.cover}
              onChange={(e) => isAdmin && setForm({ ...form, cover: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
              readOnly={!isAdmin}
            />

            <input
              placeholder="لینک خارجی"
              value={form.externalLink}
              onChange={(e) => isAdmin && setForm({ ...form, externalLink: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
              readOnly={!isAdmin}
            />

            {isAdmin && (
              <div className="pt-2">
               <div className="flex flex-wrap gap-2 my-5">
                  <button type="button" onClick={() => addBlock('title')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">عنوان</button>
                  <button type="button" onClick={() => addBlock('text')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">متن</button>
                  <button type="button" onClick={() => addBlock('image')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">عکس</button>
                  <button type="button" onClick={() => addBlock('gallery')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">گالری</button>
                  <button type="button" onClick={() => addBlock('video')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">ویدئو</button>
                  <button type="button" onClick={() => addBlock('embed')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">Embed</button>
                  <button type="button" onClick={() => addBlock('link')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">لینک</button>
                  <button type="button" onClick={() => addBlock('html')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">HTML</button>
                  <button
                    type="button"
                    onClick={() => addBlock('capacity')}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                  >
                    ظرفیت
                  </button>

                </div>

                <div className="space-y-3">
                  {(form.blocks || []).map((b, i) => (
                    <div key={b.id || i} className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-2">
                          <strong className="capitalize">{b.type}</strong>
                          <span className="text-xs text-gray-500">#{i + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => moveBlock(i, 'up')} className="text-sm">▲</button>
                          <button type="button" onClick={() => moveBlock(i, 'down')} className="text-sm">▼</button>
                          <button type="button" onClick={() => removeBlock(i)} className="text-red-600">حذف</button>
                        </div>
                      </div>

                      <div className="mt-2 space-y-2">
                        {b.type === 'text' && (
                          <textarea value={b.value} onChange={(e) => updateBlock(i, { value: e.target.value })} className="w-full p-2 border rounded" rows={4} />
                        )}

                        {b.type === 'title' && (
                          <input value={b.value} onChange={(e) => updateBlock(i, { value: e.target.value })} className="w-full p-2 border rounded" />
                        )}

                        {b.type === 'image' && (
                          <div className="space-y-2">
                            <input placeholder="آدرس تصویر" value={b.value} onChange={(e) => updateBlock(i, { value: e.target.value })} className="w-full p-2 border rounded" />
                            <input placeholder="کپشن (اختیاری)" value={b.caption} onChange={(e) => updateBlock(i, { caption: e.target.value })} className="w-full p-2 border rounded" />
                          </div>
                        )}

                        {/* === Block: Gallery === */}
                        {b.type === "gallery" && (
                          <div className="p-4 border rounded mb-4 bg-gray-50">
                            <h4 className="font-bold mb-2">📷 گالری تصاویر</h4>
                            {(b.value || []).map((img, j) => (
                              <div key={j} className="flex items-center gap-2 mb-2">
                                <input
                                  type="text"
                                  value={img}
                                  onChange={(e) => {
                                    const newBlocks = [...form.blocks];
                                    newBlocks[i].value[j] = e.target.value;
                                    setForm({ ...form, blocks: newBlocks });
                                  }}
                                  placeholder={`آدرس تصویر ${j + 1}`}
                                  className="flex-1 border rounded px-2 py-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newBlocks = [...form.blocks];
                                    newBlocks[i].value.splice(j, 1);
                                    setForm({ ...form, blocks: newBlocks });
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  حذف
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const newBlocks = [...form.blocks];
                                if (!Array.isArray(newBlocks[i].value)) newBlocks[i].value = [];
                                newBlocks[i].value.push("");
                                setForm({ ...form, blocks: newBlocks });
                              }}
                              className="px-3 py-1 bg-blue-500 text-white rounded mt-2"
                            >
                              ➕ افزودن عکس
                            </button>
                          </div>
                        )}


                        {b.type === 'video' && (
                          <input placeholder="آدرس ویدئو" value={b.value} onChange={(e) => updateBlock(i, { value: e.target.value })} className="w-full p-2 border rounded" />
                        )}

                        {b.type === 'embed' && (
                          <textarea placeholder="کد embed" value={b.value} onChange={(e) => updateBlock(i, { value: e.target.value })} className="w-full p-2 border rounded" rows={3} />
                        )}

                        {b.type === 'link' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              placeholder="آدرس"
                              value={b.value?.url || b.value || ''}
                              onChange={(e) =>
                                updateBlock(i, {
                                  value: { ...(typeof b.value === 'object' ? b.value : {}), url: e.target.value },
                                })
                              }
                              className="w-full p-2 border rounded"
                            />
                            <input
                              placeholder="متن لینک"
                              value={(typeof b.value === 'object' ? b.value.text : '') || ''}
                              onChange={(e) =>
                                updateBlock(i, {
                                  value: { ...(typeof b.value === 'object' ? b.value : {}), text: e.target.value },
                                })
                              }
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                        {b.type === 'capacity' && (
                          <div className="space-y-2">
                            <input
                              type="number"
                              placeholder="ظرفیت پر شده (مثلا 27)"
                              value={b.value?.current || ''}
                              onChange={(e) =>
                                updateBlock(i, { value: { ...(b.value || {}), current: e.target.value } })
                              }
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="number"
                              placeholder="کل ظرفیت (مثلا 33)"
                              value={b.value?.total || ''}
                              onChange={(e) =>
                                updateBlock(i, { value: { ...(b.value || {}), total: e.target.value } })
                              }
                              className="w-full p-2 border rounded"
                            />
                            <input
                              placeholder="متن توضیحی (اختیاری)"
                              value={b.value?.label || ''}
                              onChange={(e) =>
                                updateBlock(i, { value: { ...(b.value || {}), label: e.target.value } })
                              }
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}


                        {b.type === 'html' && (
                          <textarea value={b.value} onChange={(e) => updateBlock(i, { value: e.target.value })} className="w-full p-2 border rounded" rows={5} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                 
              </div>
            )}

            <div className="flex gap-2">
              {isAdmin ? (
                <>
                  <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow">
                    {loading ? 'در حال ذخیره...' : '💾 ذخیره'}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 transition text-white px-4 py-2 rounded-lg shadow">
                    لغو
                  </button>
                </>
              ) : (
                <div className="text-sm text-gray-500">وارد ادمین شوید</div>
              )}

              <button
                type="button"
                onClick={() => setPreviewMode((m) => (m === 'desktop' ? 'mobile' : 'desktop'))}
                className="ml-auto text-sm bg-gray-100 hover:bg-gray-200 transition px-3 py-2 rounded-lg"
              >
                پیش‌نمایش: {previewMode}
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 border rounded-2xl shadow bg-white">
            <h3 className="text-lg font-bold mb-3">پیش‌نمایش</h3>
            <div className={`border rounded-lg overflow-hidden shadow ${previewMode === 'mobile' ? 'w-[360px] mx-auto' : ''}`}>
              <div className="bg-white">
                {form.cover ? (
                  <div className="h-40 w-full overflow-hidden">
                    <img src={form.cover} alt={form.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="p-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                    <h2 className="text-xl font-bold">{form.title || 'عنوان صفحه'}</h2>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-2xl font-bold">{form.title || 'عنوان صفحه'}</h2>
                  {form.excerpt && <p className="text-gray-600 mt-2">{form.excerpt}</p>}

                  <div className="mt-4 space-y-4 text-sm text-gray-800">
                    {(preview.blocks || []).map((b, i) => {
                      if (!b) return null;
                      const type = (b.type || 'text').toLowerCase();
                      if (type === 'text') return <div key={i} className="whitespace-pre-line">{b.value}</div>;
                      if (type === 'title') return <h3 key={i} className="text-lg font-semibold">{b.value}</h3>;
                      if (type === 'image')
                        return (
                          <div key={i}>
                            <img src={b.value} alt={b.caption || ''} className="w-full rounded" />
                            {b.caption && <div className="text-xs text-gray-500">{b.caption}</div>}
                          </div>
                        );
                      if (type === 'gallery' && Array.isArray(b.value))
                        return (
                          <div key={i} className="grid grid-cols-2 gap-2">
                            {b.value.map((s, j) => (
                              <img key={j} src={s} className="w-full h-24 object-cover rounded" />
                            ))}
                          </div>
                        );
                      if (type === 'video')
                        return (
                          <div key={i} className="aspect-video">
                            <video controls className="w-full rounded">
                              <source src={b.value} />
                            </video>
                          </div>
                        );
                      if (type === 'embed')
                        return (
                          <div key={i} className="aspect-video">
                            <iframe src={b.value} className="w-full h-full" title={`embed-${i}`} />
                          </div>
                        );
                      if (type === 'capacity') {
                        const val = b.value || {};
                        return (
                          <div key={i} className="p-3 border rounded bg-gray-50 text-center">
                            <div className="text-sm text-gray-600">{val.label || 'ظرفیت'}</div>
                            <div className="text-lg font-bold text-indigo-600">
                              {val.current || 0}/{val.total || 0}
                            </div>
                          </div>
                        );
                      }

                      if (type === 'link')
                        return (
                          <div key={i}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={typeof b.value === 'object' ? b.value.url : b.value}
                              className="text-blue-600 underline"
                            >
                              {typeof b.value === 'object' ? b.value.text : b.value}
                            </a>
                          </div>
                        );
                      return (
                        <pre key={i} className="bg-gray-50 p-2 rounded">
                          {JSON.stringify(b)}
                        </pre>
                      );
                    })}
                  </div>

                  {form.externalLink && (
                    <div className="mt-4">
                      <a href={form.externalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        🌐 مشاهده لینک خارجی
                      </a>
                    </div>
                  )}

                  {form.publishedAt && <div className="mt-2 text-sm text-gray-500">📅 {form.publishedAt.slice(0, 10)}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
