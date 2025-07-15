'use client'
import { useState, useEffect } from 'react'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== '') {
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => setResults(data))
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="جستجو کنید..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
      />

      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg text-right">
          {results.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => window.location.href = item.path}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
