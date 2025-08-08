export default async function Page({ params }) {
  const res = await fetch(`${process.env.BASE_URL}/api/pages/${params.slug}`, { cache: 'no-store' })

  if (!res.ok) return <div>صفحه پیدا نشد</div>

  const page = await res.json()

  return (
    <div>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  )
}
