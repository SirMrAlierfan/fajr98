"use client";

import React, { useState } from "react";

export default function GallerySlider({ images = [] }) {
    const [index, setIndex] = useState(0);

    if (!images.length) return null;

    return (
        <section className="my-8 relative">
            {/* اسلاید فعلی */}
            <div className="relative w-full h-80 md:h-[28rem] overflow-hidden rounded-xl shadow">
                <img
                    src={images[index]}
                    alt={`gallery-${index}`}
                    className="w-full h-full object-cover"
                />

                {/* دکمه‌های کنترل */}
                <button
                    onClick={() => setIndex((index - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white px-3 py-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 24 24" fill="none">
                        <path d="M22 11.9299H2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.00009 19L2.84009 14C2.5677 13.7429 2.35071 13.433 2.20239 13.0891C2.05407 12.7452 1.97754 12.3745 1.97754 12C1.97754 11.6255 2.05407 11.2548 2.20239 10.9109C2.35071 10.567 2.5677 10.2571 2.84009 10L8.00009 5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <button
                    onClick={() => setIndex((index + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white px-3 py-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 24 24" fill="none">
                        <path d="M2 12.0701H22" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 5L21.16 10C21.4324 10.2571 21.6494 10.567 21.7977 10.9109C21.946 11.2548 22.0226 11.6255 22.0226 12C22.0226 12.3745 21.946 12.7452 21.7977 13.0891C21.6494 13.433 21.4324 13.7429 21.16 14L16 19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>

            {/* اندیکاتور پایین */}
            <div className="flex justify-center mt-3 gap-2">
                {images.map((_, j) => (
                    <button
                        key={j}
                        onClick={() => setIndex(j)}
                        className={`w-3 h-3 rounded-full ${j === index ? "bg-blue-500" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
