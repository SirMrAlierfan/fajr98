'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBox from '@/components/searchInput';
import '@/app/globals.css';

export default function RootLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <html lang="fa-IR" dir="rtl">
      <body className="bg-gray-100 text-gray-800 font-vazir">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between md:justify-around relative">

            {/* لوگو */}
            <h1 className="text-2xl font-bold text-blue-600">لوگو</h1>

            {/* دکمه منو و جستجو - موبایل */}
            <div className="md:hidden flex gap-3 items-center">
              <button
                onClick={() => setMobileSearchOpen(prev => !prev)}
                className="text-gray-600 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-1.85z" />
                </svg>
              </button>
              <button
                className="text-gray-600 focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* منو - دسکتاپ */}
            <nav className="hidden md:flex gap-x-6 ml-12">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-semibold">خانه</Link>
              <Link href="/registration" className="text-gray-700 hover:text-blue-600 font-semibold">شرایط ثبت نام</Link>
              <Link href="/interduction" className="text-gray-700 hover:text-blue-600 font-semibold">معرفی هنرستان</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-semibold">ارتباط با ما</Link>
            </nav>

            {/* سرچ‌باکس - دسکتاپ */}
            <div className="hidden md:block w-64">
              <SearchBox />
            </div>
          </div>

          {/* سرچ‌باکس - موبایل (قابل باز و بسته شدن) */}
          <AnimatePresence>
            {mobileSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="block md:hidden px-4 pb-2"
              >
                <SearchBox />
              </motion.div>
            )}
          </AnimatePresence>

          {/* منو - موبایل */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-5 space-y-6"
              >
                <button
                  className="text-gray-600 absolute top-4 left-4"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <nav className="pt-12 flex flex-col space-y-4 text-right">
                  <Link href="/" className="text-gray-700 hover:text-blue-600 font-semibold">خانه</Link>
                  <Link href="/registration" className="text-gray-700 hover:text-blue-600 font-semibold">شرایط ثبت نام</Link>
                  <Link href="/interduction" className="text-gray-700 hover:text-blue-600 font-semibold">معرفی هنرستان</Link>
                  <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-semibold">ارتباط با ما</Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-8">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} My Beautiful App. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
