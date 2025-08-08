'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      const res = await fetch(`/api/majors/${slug}`);
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, [slug]);

  if (!data) return <p className="p-6">در حال بارگذاری...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <p className="text-gray-700 leading-relaxed">{data.content}</p>

      {data.media_url && (
        <div className="mt-6">
          {data.media_type === 'image' ? (
            <img src={data.media_url} alt="media" className="w-full rounded shadow" />
          ) : (
            <video src={data.media_url} controls className="w-full rounded shadow" />
          )}
        </div>
      )}
    </div>
  );
}
