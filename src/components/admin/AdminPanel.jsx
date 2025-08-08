'use client'
import { useState } from 'react'

export default function GeneralAdminPanel() {
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [blocks, setBlocks] = useState([{ type: 'paragraph', value: '' }])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const addBlock = (type) => {
    setBlocks([...blocks, { type, value: '' }])
  }

  const updateBlock = (index, value) => {
    const updated = [...blocks]
    updated[index].value = value
    setBlocks(updated)
  }

  const removeBlock = (index) => {
    const updated = [...blocks]
    updated.splice(index, 1)
    setBlocks(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        title,
        content: JSON.stringify(blocks)
      })
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('✅ با موفقیت ذخیره شد')
      setSlug('')
      setTitle('')
      setBlocks([{ type: 'paragraph', value: '' }])
    } else {
      setMessage(`❌ خطا: ${data.message}`)
    }

    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">افزودن صفحه سفارشی</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="slug (مثلاً: about-us)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="عنوان صفحه"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {blocks.map((block, index) => (
        <div key={index} className="border p-3 rounded mb-2">
          <label className="block mb-1 font-medium">نوع: {block.type}</label>
          {block.type === 'paragraph' && (
            <textarea
              className="w-full border rounded p-2"
              value={block.value}
              placeholder="پاراگراف"
              onChange={(e) => updateBlock(index, e.target.value)}
            />
          )}
          {block.type === 'image' && (
            <input
              type="text"
              className="w-full border rounded p-2"
              value={block.value}
              placeholder="لینک عکس"
              onChange={(e) => updateBlock(index, e.target.value)}
            />
          )}
          {block.type === 'video' && (
            <input
              type="text"
              className="w-full border rounded p-2"
              value={block.value}
              placeholder="لینک ویدیو"
              onChange={(e) => updateBlock(index, e.target.value)}
            />
          )}
          <button
            type="button"
            onClick={() => removeBlock(index)}
            className="text-red-500 mt-2"
          >
            حذف این بخش
          </button>
        </div>
      ))}

      <div className="space-x-2">
        <button onClick={() => addBlock('paragraph')} type="button" className="bg-gray-300 px-3 py-1 rounded">+ پاراگراف</button>
        <button onClick={() => addBlock('image')} type="button" className="bg-gray-300 px-3 py-1 rounded">+ تصویر</button>
        <button onClick={() => addBlock('video')} type="button" className="bg-gray-300 px-3 py-1 rounded">+ ویدیو</button>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'در حال ذخیره...' : 'ذخیره صفحه'}
      </button>

      {message && <p className="text-green-600 mt-2">{message}</p>}
    </div>
  )
}
