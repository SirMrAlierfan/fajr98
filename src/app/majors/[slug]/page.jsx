/**
 * src/app/majors/[slug]/page.jsx
 *
 * Server component for "majors" (mirror of src/app/[slug]/page.jsx)
 * - No "use client"
 * - No interactive handlers (onClick/onSubmit/etc)
 * - Same styling, blocks, TOC, gallery, JSON-LD and metadata logic
 */

import React from "react";
import { getItem } from "@/lib/adminApi"; // unified API: getItem("majors", slug)
import GallerySlider from "@/components/GallerySlider";

/* ========================= Utilities ========================= */

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

function getFirstImage(blocks = []) {
  const img = (blocks || []).find(
    (b) => (b?.type || "").toLowerCase() === "image" && b.value
  );
  return img?.value || null;
}

function stripHtml(html = "") {
  return String(html).replace(/<[^>]+>/g, " ");
}

function collectPlainText(page) {
  const parts = [];
  if (page?.title) parts.push(page.title);
  if (page?.excerpt) parts.push(page.excerpt);
  if (page?.content) parts.push(stripHtml(page.content));
  (page?.blocks || []).forEach((b) => {
    if (!b) return;
    const t = (b.type || "").toLowerCase();
    if (t === "text" || t === "title") {
      if (typeof b.value === "string") parts.push(b.value);
    } else if (t === "html") {
      parts.push(stripHtml(b.value || ""));
    } else if (t === "link") {
      const val = b.value;
      if (typeof val === "string") parts.push(val);
      else if (val?.text) parts.push(val.text);
      else if (val?.url) parts.push(val.url);
    }
  });
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function readingStats(text) {
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const wpm = 200;
  const mins = Math.max(1, Math.round(words / wpm));
  return { words, mins };
}

function isYouTube(url = "") {
  try {
    const u = new URL(url);
    return u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be");
  } catch {
    return false;
  }
}
function youTubeEmbed(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const p = u.searchParams.get("v");
      if (p) return `https://www.youtube.com/embed/${p}`;
    }
  } catch { }
  return null;
}
function isAparat(url = "") {
  try {
    const u = new URL(url);
    return u.hostname.includes("aparat.com");
  } catch {
    return false;
  }
}

function aparatEmbed(url = "") {
  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/v/")) {
      const id = u.pathname.split("/v/")[1];
      return `https://www.aparat.com/video/video/embed/videohash/${id}/vt/frame`;
    }
  } catch {}
  return null;
}


function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function clamp(str = "", max = 160) {
  const s = String(str).trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trim() + "…";
}

function toPersianDate(dateLike) {
  try {
    if (!dateLike) return "—";
    const d = new Date(dateLike);
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(d);
  } catch {
    return "—";
  }
}

/* ========================= Global CSS ========================= */
function GlobalStyles() {
  const css = `
  :root{
    --bg: #f6f8fb;
    --card: #ffffff;
    --muted: #64748b;
    --accentA: #5b9df9;
    --accentB: #7c3aed;
  }

  *{ box-sizing:border-box; }
  html,body{ margin:0; padding:0; background:var(--bg); font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
  img{ max-width:100%; height:auto; display:block; }
  body, #__next { overflow-x:hidden; }

  .soft-bg { position:relative; }
  .soft-bg::before{
    content:"";
    position:absolute; inset:-10%;
    background:
      radial-gradient(60rem 60rem at 10% -10%, rgba(124,58,237,.06), transparent 60%),
      radial-gradient(40rem 40rem at 100% 20%, rgba(59,130,246,.05), transparent 70%),
      linear-gradient(180deg, #fbfdff, #f3f4f6);
    z-index:-1;
  }

  .card { background: var(--card); border-radius:18px; box-shadow: 0 18px 50px rgba(2,6,23,.06); }
  .glass { background: rgba(255,255,255,.72); backdrop-filter: blur(6px) saturate(1.05); border-radius:14px; box-shadow: 0 10px 30px rgba(2,6,23,.04); }

  .head-sep { position:relative; padding-bottom:.35rem; }
  .head-sep::after{ content:""; position:absolute; left:0; bottom:0; width:72px; height:3px; border-radius:2px; background: linear-gradient(90deg,var(--accentA),var(--accentB)); }

  .prose { color:#0f172a; line-height:1.7; }
  .prose h2, .prose h3 { scroll-margin-top:120px; }
  .prose img{ border-radius:12px; box-shadow: 0 8px 30px rgba(2,6,23,.06); }

  .gallery-wrap { width:100%; display:flex; justify-content:center; margin:2rem 0; }
  .gallery-grid { width:100%; max-width:1100px; display:grid; gap:1rem; grid-template-columns: repeat(12, 1fr); }
  .gallery-item { grid-column: span 4; border-radius:12px; overflow:hidden; height: 360px; object-fit:cover; }
  @media (max-width: 1024px) { .gallery-item { grid-column: span 6; height: 280px; } .gallery-grid { max-width:900px; } }
  @media (max-width: 640px) { .gallery-item { grid-column: span 12; height: 220px; } .gallery-grid { max-width:520px; } }

  .lb-modal { position:fixed; inset:0; background: rgba(2,6,23,.85); display:none; opacity:0; transition:opacity .12s ease; z-index:90; }
  .lb-modal:target { display:block; opacity:1; }
  .lb-backdrop{ position:absolute; inset:0; display:block; }
  .lb-content{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); max-width:94vw; max-height:92vh; border-radius:12px; overflow:hidden; background:#000; }
  .lb-img{ max-width:94vw; max-height:92vh; display:block; }

  .toc { position:sticky; top:6rem; }
  .toc .item { display:flex; gap:.6rem; align-items:center; padding:.45rem .5rem; border-radius:8px; transition: background .12s ease; }
  .toc .item:hover { background: rgba(59,130,246,.06); }

  .muted { color: var(--muted); font-size: .95rem; }

  @media print {
    .no-print { display:none !important; }
    .prose { color:#000; }
  }
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/* ========================= UI: Hero + Meta + Breadcrumb ========================= */

function CoverHero({ cover, title, excerpt }) {
  if (!cover) {
    return (
      <div className="p-12 md:p-20 bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight head-sep">{title}</h1>
          {excerpt ? <p className="mt-4 text-lg opacity-90">{excerpt}</p> : null}
        </div>
      </div>
    );
  }

  return (
  <header className="relative h-[26rem] md:h-[34rem] w-full overflow-hidden">
    {/* background: use class so media-query handles background-attachment */}
    <div
      className="absolute inset-0 hero-bg"
      style={{ backgroundImage: `url(${cover})` }}
      aria-hidden
    />
    {/* mobile fallback: an <img> ensures no black flash if background-image fails */}
    <img
      src={cover}
      alt=""
      className="absolute inset-0 w-full h-full object-cover md:hidden"
      aria-hidden
      loading="lazy"
    />

    {/* overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    <div className="relative z-10 h-full flex items-end p-8 md:p-12">
      <div className="max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight head-sep">{title}</h1>
        {excerpt ? <p className="mt-3 text-white/90 max-w-2xl">{excerpt}</p> : null}
      </div>
    </div>
    <div className="absolute -bottom-2 left-0 right-0 pointer-events-none">
      <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none"><path d="M0,30 C360,90 1080,-30 1440,30 L1440,60 L0,60 Z" fill="white" /></svg>
    </div>
  </header>
);

}

/** Meta bar: show slug and only reading minutes (plain) **/
function MetaBar({ slug, stats }) {
  return (
    <div className="px-6 md:px-12 -mt-6 relative z-10">
      <div className="glass px-4 py-2 rounded-full inline-flex items-center gap-4">
        <span className="muted">/majors/{slug}</span>
        {stats?.mins ? <span className="muted">{stats.mins} دقیقه مطالعه</span> : null}
      </div>
    </div>
  );
}

/** Breadcrumb plain text (no anchor links) **/
function Breadcrumb({ slug }) {
  const segs = String(slug || "").split("/").map(s => s.trim()).filter(Boolean);
  if (!segs.length) return null;
  return (
    <nav className="px-6 md:px-12 mt-4" aria-label="breadcrumb">
      <ol style={{ display: 'flex', gap: '8px', color: '#64748b', fontSize: '.95rem' }}>
        <li>خانه</li>
        <li>/</li>
        <li>رشته‌ها</li>
        <li>/</li>
        {segs.map((s, i) => (
          <React.Fragment key={`${s}-${i}`}>
            <li style={{ color: i === segs.length - 1 ? '#0f172a' : '#64748b' }}>{s}</li>
            {i < segs.length - 1 && <li>/</li>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

/* ======================= Blocks (render many types) ======================= */

function HtmlDanger({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function Block({ b, i, pageTitle, galleryPrefix, renderGallery }) {
  const type = (b?.type || "text").toLowerCase();

  if (type === "title") {
    const text = String(b.value || "");
    const id = slugify(text) || `sec-${i}`;
    return <h2 id={id} className="text-2xl md:text-3xl font-bold mt-10 mb-4 scroll-mt-28 head-sep">{text}</h2>;
  }

  if (type === "text") {
    return <section className="my-6 prose">{String(b.value || "")}</section>;
  }

  if (type === "html") {
    return <section className="my-6"><HtmlDanger html={String(b.value || "")} /></section>;
  }

  if (type === "image") {
    const src = String(b.value || "");
    const cap = String(b.caption || "");
    const lbId = `lb-${galleryPrefix}-img-${i}`;
    return (
      <figure className="my-6">
        <a href={`#${lbId}`} className="block group" aria-label="نمایش در بزرگ‌نما">
          <img src={src} alt={cap || pageTitle || `image-${i}`} className="w-full rounded-xl" loading="lazy" />
        </a>
        {cap && <figcaption className="mt-2 muted">{cap}</figcaption>}
        <div id={lbId} className="lb-modal" aria-hidden>
          <a href="#" className="lb-backdrop" aria-label="بستن" />
          <div className="lb-content">
            <img src={src} alt={cap || ""} className="lb-img" />
          </div>
        </div>
      </figure>
    );
  }

  if (type === "gallery" && Array.isArray(b.value)) {
    return <GallerySlider key={i} images={b.value} />;
  }

  if (type === "video") {
    const v = String(b.value || "");

    if (isYouTube(v)) {
      const embed = youTubeEmbed(v);
      return (
        <div className="my-6" style={{ aspectRatio: '16/9' }}>
          <iframe src={embed || ""} title={`yt-${i}`} frameBorder="0" allowFullScreen className="w-full h-full rounded-xl" />
        </div>
      );
    }

    if (isAparat(v)) {
      const embed = aparatEmbed(v);
      return (
        <div className="my-6" style={{ aspectRatio: '16/9' }}>
          <iframe src={embed || ""} title={`ap-${i}`} frameBorder="0" allowFullScreen className="w-full h-full rounded-xl" />
        </div>
      );
    }

    return (
      <div className="my-6">
        <video controls className="w-full rounded-xl">
          <source src={v} />
          مرورگر شما ویدیو را پشتیبانی نمی‌کند.
        </video>
      </div>
    );
  }

  if (type === "embed") {
    return (
      <div className="my-6" style={{ aspectRatio: '16/9' }}>
        <iframe src={String(b.value || "")} title={`embed-${i}`} frameBorder="0" allowFullScreen className="w-full h-full" />
      </div>
    );
  }

  if (type === "capacity") {
    const val = b.value || {};
    const current = parseInt(val.current || 0, 10);
    const total = parseInt(val.total || 0, 10);
    const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

    return (
      <div className="my-6 p-4 border border-gray-200 rounded-xl text-center bg-white">
        <div className="text-sm font-medium text-gray-700 mb-2">{val.label || "ظرفیت"}</div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-500 h-2 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {current} از {total} نفر ({percent}%)
        </div>
      </div>
    );
  }

  if (type === "link") {
    const url = typeof b.value === "string" ? b.value : b.value?.url;
    const text = typeof b.value === "string" ? b.value : b.value?.text || b.value?.url;
    return (
      <div className="my-4 card p-3">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600 }}>{String(text || url)}</div>
          <div className="muted" style={{ fontSize: '.85rem' }}>⤴︎</div>
        </div>
        <div className="muted" style={{ marginTop: 6, fontSize: '.85rem' }}>{String(url)}</div>
      </div>
    );
  }

  if (type === "code") {
    return (
      <pre className="my-4" style={{ background: '#0f172a', color: '#e6eef8', padding: 12, borderRadius: 10, overflowX: 'auto' }}>
        <code>{String(b.value || "")}</code>
      </pre>
    );
  }

  return (
    <pre className="my-4" style={{ background: '#f8fafc', padding: 12, borderRadius: 8, color: '#0f172a', overflowX: 'auto' }}>
      {JSON.stringify(b, null, 2)}
    </pre>
  );
}

/* ========================= Content renderer & TOC ========================= */

function TableOfContents({ blocks = [] }) {
  const items = (blocks || [])
    .map((b, idx) => ({ b, idx }))
    .filter(({ b }) => ((b?.type || "").toLowerCase() === "title" && b.value))
    .map(({ b }, i) => ({ text: String(b.value), id: slugify(String(b.value)) }));

  if (!items.length) return null;

  return (
    <aside className="toc" aria-label="فهرست مطالب">
      <div className="card p-4">
        <h4 style={{ margin: 0, fontWeight: 700 }}>فهرست مطالب</h4>
        <div style={{ marginTop: 12 }}>
          {items.map((it) => (
            <a key={it.id} href={`#${it.id}`} className="item" style={{ display: 'block', textDecoration: 'none', color: '#0f172a', marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, background: 'linear-gradient(90deg,var(--accentA),var(--accentB))', borderRadius: 6, display: 'inline-block' }} />
              <span style={{ marginLeft: 10 }}>{it.text}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

function ContentRenderer({ page }) {
  const blocks = page?.blocks || [];
  const firstGalleryIndex = (blocks || []).findIndex(b => (b?.type || "").toLowerCase() === "gallery");
  return (
    <div className="px-6 md:px-12 pb-12 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <div className="prose">
          {page.content ? <HtmlDanger html={String(page.content)} /> : null}
        </div>

        {(blocks || []).map((b, i) => (
          <Block
            key={b?.id || i}
            b={b}
            i={i}
            pageTitle={page.title}
            galleryPrefix={page.slug || "major"}
            renderGallery={i === firstGalleryIndex}
          />
        ))}

        <div style={{ borderTop: '1px solid rgba(15,23,42,.06)', marginTop: 28, paddingTop: 12 }}>
          <div className="muted">تاریخ انتشار: <strong>{toPersianDate(page.publishedAt)}</strong></div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <TableOfContents blocks={blocks} />
      </div>
    </div>
  );
}

/* ========================= SEO: metadata + JSON-LD ========================= */

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const major = await getItem("majors", slug);
    if (!major) {
      return { title: "رشته پیدا نشد", description: "این رشته موجود نیست." };
    }
    const cover = getFirstImage(major.blocks || []) || major.cover || major.image || null;
    const title = major.title || slug;
    const description = clamp(major.excerpt || major.content || "", 160);
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: cover ? [{ url: cover }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: cover ? [cover] : undefined,
      },
      alternates: {
        canonical: `/majors/${major.slug || slug}`,
      },
    };
  } catch (err) {
    console.error("generateMetadata (majors) error:", err);
    return { title: "رشته", description: "خطا در بارگذاری اطلاعات متا." };
  }
}

function JsonLd({ page }) {
  const image = getFirstImage(page.blocks || []) || page.cover || undefined;
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title || "",
    description: page.excerpt || "",
    datePublished: page.publishedAt || undefined,
    image: image ? [image] : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `/majors/${page.slug || ""}` },
    author: page.author ? { "@type": "Person", name: page.author } : undefined,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* ========================= Page Component (Server) ========================= */

export const revalidate = 0;

export default async function MajorPage({ params }) {
  const { slug } = await params;

  let page = null;
  try {
    // using unified adminApi getItem for majors
    page = await getItem("majors", slug);
  } catch (err) {
    console.error("Error fetching major:", err);
    page = null;
  }

  if (!page) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center">
          <h2 style={{ color: '#dc2626', fontSize: '1.5rem', fontWeight: 700 }}>رشته پیدا نشد</h2>
          <p className="muted">ممکن است آدرس اشتباه باشد یا این رشته حذف شده باشد.</p>
        </div>
      </div>
    );
  }

  const plain = collectPlainText(page);
  const stats = readingStats(plain);
  const cover = getFirstImage(page.blocks || []) || page.cover || page.image || null;

  return (
    <div className="min-h-screen soft-bg py-10">
      <GlobalStyles />

      <article className="max-w-6xl mx-auto card overflow-hidden">
        {/* hero */}
        <CoverHero cover={cover} title={String(page.title || "")} excerpt={String(page.excerpt || "")} />

        {/* meta + breadcrumb */}
        <MetaBar slug={String(page.slug || slug || "")} stats={stats} />
        <Breadcrumb slug={String(page.slug || slug || "")} />

        {/* content + toc */}
        <ContentRenderer page={page} />

      </article>

      {/* JSON-LD */}
      <JsonLd page={page} />
    </div>
  );
}
