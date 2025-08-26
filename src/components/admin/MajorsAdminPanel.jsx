'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { listMajors, getMajor, saveMajor, deleteMajor } from '@/lib/adminApi';
import AdminLayout from './AdminLayout';

export default function MajorsAdminPanel() {
  const [majors, setMajors] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const emptyForm = {
    id: '',
    slug: '',
    title: '',
    excerpt: '',
    image: '',
    blocks: [],
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadList();
  }, []);

  // ======== بارگذاری لیست رشته‌ها ========
  async function loadList() {
    setLoadingList(true);
    try {
      const data = await listMajors();
      setMajors(data || []);
    } catch (e) {
      console.error(e);
      alert('❌ خطا در دریافت لیست رشته‌ها');
    }
    setLoadingList(false);
  }

  // ======== بارگذاری رشته برای ویرایش ========
  async function loadMajorData(slug) {
    try {
      const data = await getMajor(slug);
      if (!data) return alert('رشته پیدا نشد');
      setForm({
        id: data.id || '',
        slug: data.slug || '',
        title: data.title || '',
        excerpt: data.excerpt || '',
        image: data.image || '',
        blocks: data.blocks || [],
      });
      setSelectedId(data.id || null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      alert('❌ خطا در بارگذاری رشته');
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setSelectedId(null);
  }

  // ======== مدیریت بلوک‌ها ========
  function addBlock(type) {
    const newBlock = {
      id: Date.now(),
      type,
      value: type === 'gallery' ? [] : '',
      caption: '',
    };
    setForm((f) => ({ ...f, blocks: [...f.blocks, newBlock] }));
  }

  function updateBlock(i, patch) {
    setForm((f) => {
      const b = [...f.blocks];
      b[i] = { ...b[i], ...patch };
      return { ...f, blocks: b };
    });
  }

  function removeBlock(i) {
    setForm((f) => ({ ...f, blocks: f.blocks.filter((_, idx) => idx !== i) }));
  }

  function moveBlock(i, dir) {
    setForm((f) => {
      const b = [...f.blocks];
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= b.length) return f;
      [b[i], b[j]] = [b[j], b[i]];
      return { ...f, blocks: b };
    });
  }

  // ======== ذخیره ========
  async function handleSave(e) {
    e?.preventDefault();
    setLoading(true);
    try {
      const normalized = {
        ...form,
        blocks: (form.blocks || []).map((b) =>
          b.type === 'gallery' ? { ...b, value: Array.isArray(b.value) ? b.value : [] } : b
        ),
      };

      const saved = await saveMajor(normalized);
      await loadList();

      if (saved && saved.id) {
        await loadMajorData(normalized.slug);
      } else {
        resetForm();
      }

      alert('✅ ذخیره شد');
    } catch (err) {
      console.error(err);
      alert(err?.message || '❌ خطا در ذخیره رشته');
    }
    setLoading(false);
  }

  // ======== حذف ========
  async function handleDelete(id) {
    if (!confirm('آیا مطمئن هستید که می‌خواهید حذف کنید؟')) return;
    try {
      await deleteMajor(id);
      alert('🗑️ حذف شد');
      if (selectedId === id) resetForm();
      await loadList();
    } catch (e) {
      console.error(e);
      alert(e.message || '❌ خطا در حذف رشته');
    }
  }

  // ======== پیش‌نمایش ========
  const preview = useMemo(() => form, [form]);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 gap-6 p-6 bg-gray-50">

        {/* ستون لیست رشته‌ها */}
        <div className="p-4 border rounded-2xl shadow bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">📚 لیست رشته‌ها</h3>
            <div className="flex items-center gap-2">
              <button onClick={loadList} className="text-sm text-blue-600">↻</button>
              <button onClick={resetForm} className="text-sm text-green-600">➕ جدید</button>
            </div>
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-auto">
            {loadingList ? <div>در حال بارگذاری...</div> :
              majors.map((m) => (
                <div
                  key={m.id}
                  onClick={() => loadMajorData(m.slug)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${selectedId === m.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="truncate">
                    <div className="font-semibold truncate text-right">{m.title || 'بدون عنوان'}</div>
                    <div className="text-xs text-gray-500 truncate">/{m.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(ev) => { ev.stopPropagation(); loadMajorData(m.slug); }} className="text-sm text-blue-600" title="ویرایش">✏️</button>
                    <button onClick={(ev) => { ev.stopPropagation(); handleDelete(m.id); }} className="text-sm text-red-600" title="حذف">🗑️</button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* فرم ویرایش */}
        <div className="p-6 border rounded-2xl shadow bg-white">
          <h3 className="text-xl font-bold mb-4">{form.id ? '✏️ ویرایش رشته' : '➕ افزودن رشته'}</h3>

          <form onSubmit={handleSave} className="space-y-4">
            <input placeholder="پیوند (slug)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200" />
            <input placeholder="عنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200" />
            <textarea placeholder="خلاصه کوتاه" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200" rows={3} />
            <input placeholder="آدرس تصویر اصلی" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200" />

            {/* دکمه‌های افزودن بلوک */}
            <div className="flex flex-wrap gap-2 mb-2">
              {['title','text','image','gallery','video','embed','link','html'].map(t => (
                <button type="button" key={t} onClick={() => addBlock(t)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">
                  افزودن {t === 'text' ? 'متن' : t === 'title' ? 'عنوان' : t === 'image' ? 'عکس' : t === 'gallery' ? 'گالری' : t === 'video' ? 'ویدئو' : t === 'embed' ? 'Embed' : t === 'link' ? 'لینک' : 'HTML'}
                </button>
              ))}
            </div>

            {/* ویرایش بلوک‌ها */}
            <div className="space-y-3">
              {form.blocks.map((b,i) => (
                <div key={b.id || i} className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-2">
                      <strong className="capitalize">{b.type}</strong>
                      <span className="text-xs text-gray-500">#{i+1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => moveBlock(i,'up')} className="text-sm">▲</button>
                      <button type="button" onClick={() => moveBlock(i,'down')} className="text-sm">▼</button>
                      <button type="button" onClick={() => removeBlock(i)} className="text-red-600">حذف</button>
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    {b.type === 'text' && <textarea value={b.value} onChange={(e) => updateBlock(i,{value:e.target.value})} className="w-full p-2 border rounded" rows={4} />}
                    {b.type === 'title' && <input value={b.value} onChange={(e) => updateBlock(i,{value:e.target.value})} className="w-full p-2 border rounded" />}
                    {b.type === 'image' && <div className="space-y-2">
                      <input placeholder="آدرس تصویر" value={b.value} onChange={(e)=>updateBlock(i,{value:e.target.value})} className="w-full p-2 border rounded"/>
                      <input placeholder="کپشن (اختیاری)" value={b.caption} onChange={(e)=>updateBlock(i,{caption:e.target.value})} className="w-full p-2 border rounded"/>
                    </div>}
                    {b.type === 'gallery' && <div className="space-y-2">
                      <p className="text-xs text-gray-500">هر خط یک آدرس تصویر</p>
                      <textarea value={(b.value||[]).join('\n')} onChange={(e)=>updateBlock(i,{value:e.target.value.split('\n').map(s=>s.trim()).filter(Boolean)})} className="w-full p-2 border rounded" rows={4}/>
                    </div>}
                    {b.type === 'video' && <input placeholder="آدرس ویدئو" value={b.value} onChange={(e)=>updateBlock(i,{value:e.target.value})} className="w-full p-2 border rounded"/>}
                    {b.type === 'embed' && <textarea placeholder="کد Embed" value={b.value} onChange={(e)=>updateBlock(i,{value:e.target.value})} className="w-full p-2 border rounded" rows={3}/>}
                    {b.type === 'link' && <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input placeholder="آدرس" value={typeof b.value==='object'?b.value.url:b.value||''} onChange={(e)=>updateBlock(i,{value:{...(typeof b.value==='object'?b.value:{}),url:e.target.value}})} className="w-full p-2 border rounded"/>
                      <input placeholder="متن لینک" value={typeof b.value==='object'?b.value.text:''} onChange={(e)=>updateBlock(i,{value:{...(typeof b.value==='object'?b.value:{}),text:e.target.value}})} className="w-full p-2 border rounded"/>
                    </div>}
                    {b.type === 'html' && <textarea value={b.value} onChange={(e)=>updateBlock(i,{value:e.target.value})} className="w-full p-2 border rounded" rows={5}/>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
                {loading ? 'در حال ذخیره...' : '💾 ذخیره'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow">
                لغو
              </button>
            </div>
          </form>

          {/* پیش‌نمایش پایین */}
          <div className="mt-8 p-4 border rounded-2xl shadow bg-white">
            <h3 className="text-lg font-bold mb-3">👀 پیش‌نمایش رشته</h3>
            <div className="border rounded-lg overflow-hidden shadow bg-white">
              {form.image ? (
                <div className="h-40 w-full overflow-hidden">
                  <img src={form.image} alt={form.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                  <h2 className="text-xl font-bold">{form.title || 'عنوان رشته'}</h2>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-2xl font-bold">{form.title || 'عنوان رشته'}</h2>
                {form.excerpt && <p className="text-gray-600 mt-2">{form.excerpt}</p>}

                <div className="mt-4 space-y-4 text-sm text-gray-800">
                  {preview.blocks.map((b,i)=>{
                    const type=(b.type||'text').toLowerCase();
                    if(type==='text') return <div key={i} className="whitespace-pre-line">{b.value}</div>;
                    if(type==='title') return <h3 key={i} className="text-lg font-semibold">{b.value}</h3>;
                    if(type==='image') return <div key={i}><img src={b.value} alt={b.caption||''} className="w-full rounded"/>{b.caption && <div className="text-xs text-gray-500">{b.caption}</div>}</div>;
                    if(type==='gallery' && Array.isArray(b.value)) return <div key={i} className="grid grid-cols-2 gap-2">{b.value.map((s,j)=><img key={j} src={s} className="w-full h-24 object-cover rounded"/>)}</div>;
                    if(type==='video') return <div key={i} className="aspect-video"><video controls className="w-full rounded"><source src={b.value}/></video></div>;
                    if(type==='embed') return <div key={i} className="aspect-video"><iframe src={b.value} className="w-full h-full" title={`embed-${i}`}/></div>;
                    if(type==='link') return <div key={i}><a target="_blank" rel="noopener noreferrer" href={typeof b.value==='object'?b.value.url:b.value} className="text-blue-600 underline">{typeof b.value==='object'?b.value.text:b.value}</a></div>;
                    if(type==='html') return <div key={i} dangerouslySetInnerHTML={{__html:b.value}} className="prose"/>;
                    return <pre key={i} className="bg-gray-50 p-2 rounded">{JSON.stringify(b)}</pre>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
