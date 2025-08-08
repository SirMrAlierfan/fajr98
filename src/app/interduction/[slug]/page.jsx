export default async function Page({ params }) {
  const res = await fetch(`${process.env.BASE_URL}/api/interduction/${params.slug}`, {
    cache: 'no-store'
  })

  if (!res.ok) return <div>محتوا یافت نشد</div>

  const section = await res.json()

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{section.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: section.content }} />
    </div>
  )
}
