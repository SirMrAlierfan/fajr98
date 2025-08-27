// src/components/HomeClient.jsx
"use client";

import { motion } from "framer-motion";

export default function HomeClient({ pages, majors }) {
  // 🎨 مجموعه گرادینت‌ها
  const gradients = [
    "from-indigo-400 to-purple-500",
    "from-pink-400 to-red-500",
    "from-green-400 to-blue-500",
    "from-yellow-400 to-orange-500",
    "from-teal-400 to-cyan-500",
  ];

  
  const getRandomGradient = (i) => {
    return gradients[i % gradients.length]; 
    
  };

  return (
    <main className="max-w-7xl mx-auto p-0 space-y-24">
     
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16 bg-gradient-to-r from-indigo-300 to-purple-900 text-white rounded-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold">هنرستان فنی فجر</h1>
        <p className="mt-4 text-lg text-indigo-100">
          مسیر موفقیت شما از اینجا شروع می‌شود 🚀
        </p>
      </motion.section>

      {/* 🎥 ویدیو */}
      <section className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl">
        <iframe
          src="https://www.aparat.com/video/video/embed/videohash/szd9kyd/vt/frame"
          className="absolute inset-0 w-full h-full"
          allowFullScreen
        ></iframe>
      </section>

      {/* 📄 صفحات */}
      <section className="space-y-10 px-6">
        <h2 className="text-3xl font-bold text-center text-white">صفحات عمومی</h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((p, i) => (
            <motion.a
              key={p.id}
              href={`https://fajr98.ir/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group block rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-white relative"
            >
              {/* کاور */}
              {p.cover ? (
                <img
                  src={p.cover}
                  alt={p.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
                />
              ) : (
                <div
                  className={`w-full h-52 bg-gradient-to-r ${getRandomGradient(
                    i
                  )} flex items-center justify-center text-white text-xl`}
                >
                  {p.title}
                </div>
              )}

              {/* متن */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-800">{p.title}</h3>
                <p className="text-gray-600 line-clamp-3">{p.excerpt}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* 🎓 رشته‌ها */}
      <section className="space-y-10 px-6">
        <h2 className="text-3xl font-bold text-center text-white">رشته‌ها</h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {majors.map((m, i) => (
            <motion.a
              key={m.id}
              href={`https://fajr98.ir/majors/${m.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group block rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-white relative"
            >
              {m.cover ? (
                <img
                  src={m.cover}
                  alt={m.title}
                  className="w-full h-52 object-cover"
                />
              ) : (
                <div
                  className={`w-full h-52 bg-gradient-to-r ${getRandomGradient(
                    i
                  )} flex items-center justify-center text-white text-xl`}
                >
                  {m.title}
                </div>
              )}
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold">{m.title}</h3>
                <p className="text-gray-600 line-clamp-3">{m.excerpt}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </main>
  );
}
