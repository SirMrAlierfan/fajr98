'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBox from '@/components/searchInput';
import '@/app/globals.css';
import { FaTelegramPlane, FaInstagram, FaGithub } from 'react-icons/fa';


export default function RootLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <html lang="fa-IR" dir="rtl">
      <head>
        <title>هنرستان فنی فجر | fajr98</title>
        <meta name="description" content="هنرستان فنی فجر | معرفی رشته‌ها، شرایط ثبت‌نام و اخبار. بهترین هنرستان برای موفقیت در تحصیل و شغل." />
        <meta name="keywords" content="هنرستان, فنی, فجر, ثبت‌نام, رشته‌ها, مدرسه فنی" />
        <meta name="author" content="هنرستان فنی فجر" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Favicon */}
        <link rel="icon" href="https://static.cdn.asset.aparat.com/profile-photo/11793628-761313-m.jpg" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://static.cdn.asset.aparat.com/profile-photo/11793628-761313-m.jpg" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://static.cdn.asset.aparat.com/profile-photo/11793628-761313-m.jpg" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://static.cdn.asset.aparat.com/profile-photo/11793628-761313-m.jpg" />

        {/* Open Graph برای شبکه‌های اجتماعی */}
        <meta property="og:title" content="هنرستان فنی فجر" />
        <meta property="og:description" content="معرفی هنرستان فنی فجر و رشته‌های تحصیلی" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fajr98.ir" />
        <meta property="og:image" content="https://fajr98.ir/logo.png" />
        <meta property="og:locale" content="fa_IR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="هنرستان فنی فجر" />
        <meta name="twitter:description" content="معرفی هنرستان فنی فجر و رشته‌های تحصیلی" />
        <meta name="twitter:image" content="https://fajr98.ir/logo.png" />

        {/* JSON-LD Schema برای گوگل */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "هنرستان فنی فجر",
              "url": "https://fajr98.ir",
              "logo": "https://fajr98.ir/logo.png",
              "sameAs": [
                "https://t.me/yourtelegram",
                "https://instagram.com/yourinstagram",
                "https://github.com/yourgithub"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "تهران",
                "addressCountry": "IR"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+982112345678",
                "contactType": "customer service",
                "email": "info@fajr98.ir"
              }
            }),
          }}
        />
      </head>



      <body className="bg-gray-50 text-gray-800 font-vazir min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-40">
          <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between md:justify-around relative">

            {/* لوگو */}
            <a href="/" className="flex items-center gap-2">
              <img
                src="https://static.cdn.asset.aparat.com/profile-photo/11793628-761313-m.jpg"
                alt="لوگو"
                className="w-16 h-16 rounded-full hover:scale-105 transition-transform duration-300"
              />
            </a>


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
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-semibold">خانه</Link>
              <Link href="/registration" className="text-gray-700 hover:text-gray-900 font-semibold">ثبت نام</Link>
              <Link href="/interduction" className="text-gray-700 hover:text-gray-900 font-semibold">معرفی هنرستان</Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-semibold">تماس با ما</Link>
            </nav>

            {/* سرچ‌باکس دسکتاپ */}
            <div className="hidden md:block w-64">
              <SearchBox />
            </div>
          </div>

          {/* سرچ موبایل */}
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

          {/* منو موبایل */}
          <AnimatePresence>
  {menuOpen && (
    <motion.div
    // wrapper ثابت می‌مونه، دیگه انیمیشن نداره
    className="fixed inset-0 z-50 flex justify-end"
    aria-modal="true"
    role="dialog"
  >
    {/* بک‌دراپ */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setMenuOpen(false)}
      aria-hidden
    />
  
    {/* پنل سفید که فقط خودش انیمیشن می‌خوره */}
    <motion.div
      initial={{ x: '100%' }}   // از بیرون راست شروع
      animate={{ x: 0 }}        // میاد تو
      exit={{ x: '100%' }}      // میره بیرون
      transition={{ duration: 0.25 }}
      className="relative w-full max-w-xs h-full bg-white shadow-2xl p-5 overflow-y-auto"
    >
      <button
        className="text-gray-800 absolute top-4 left-4 p-2 rounded-md hover:bg-gray-100"
        onClick={() => setMenuOpen(false)}
        aria-label="بستن منو"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
  
      <nav className="pt-12 flex flex-col space-y-4 text-right">
        <Link href="/" className="text-gray-900 hover:text-blue-600 font-semibold">خانه</Link>
        <Link href="/registration" className="text-gray-900 hover:text-blue-600 font-semibold">ثبت نام</Link>
        <Link href="/interduction" className="text-gray-900 hover:text-blue-600 font-semibold">معرفی هنرستان</Link>
        <Link href="/contact" className="text-gray-900 hover:text-blue-600 font-semibold">تماس با ما</Link>
      </nav>
    </motion.div>
  </motion.div>
  )}
</AnimatePresence>

        </header>

        {/* Main */}
        <main className="container mx-auto px-4 py-8 flex-1">
          {children}
        </main>

        {/* Footer مینیمال خاکستری */}
        <footer className="bg-gray-200 text-gray-800 mt-8 rounded-t-xl">
          <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-center md:text-right">

            <div className='mr-7 text-center'>
              <h2 className="text-lg font-bold mb-3 ">هنرستان فنی فجر</h2>
              <img
                src="https://static.cdn.asset.aparat.com/profile-photo/11793628-761313-m.jpg"
                alt="لوگو"
                className="w-30 h-30 rounded-full hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div>
              <h3 className="font-bold mb-3">لینک‌های سریع</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:underline">خانه</Link></li>
                <li><Link href="/registration" className="hover:underline">ثبت نام</Link></li>
                <li><Link href="/interduction" className="hover:underline">معرفی هنرستان</Link></li>
                <li><Link href="/contact" className="hover:underline">تماس با ما</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3">شبکه‌های اجتماعی</h3>
              <div className="flex justify-center md:justify-start gap-4 text-gray-700">
                <Link href="#"><FaTelegramPlane size={20} /></Link>

                <Link href="https://www.aparat.com/honarestanfajr"><svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20px" height="20px" viewBox="0 0 24 24" role="img"><path d="M12.001 1.594c-9.27-.003-13.913 11.203-7.36 17.758a10.403 10.403 0 0 0 17.76-7.355c0-5.744-4.655-10.401-10.4-10.403zM6.11 6.783c.501-2.598 3.893-3.294 5.376-1.103 1.483 2.19-.422 5.082-3.02 4.582A2.97 2.97 0 0 1 6.11 6.783zm4.322 8.988c-.504 2.597-3.897 3.288-5.377 1.096-1.48-2.192.427-5.08 3.025-4.579a2.97 2.97 0 0 1 2.352 3.483zm1.26-2.405c-1.152-.223-1.462-1.727-.491-2.387.97-.66 2.256.18 2.04 1.334a1.32 1.32 0 0 1-1.548 1.053zm6.198 3.838c-.501 2.598-3.893 3.293-5.376 1.103-1.484-2.191.421-5.082 3.02-4.583a2.97 2.97 0 0 1 2.356 3.48zm-1.967-5.502c-2.598-.501-3.293-3.896-1.102-5.38 2.19-1.483 5.081.422 4.582 3.02a2.97 2.97 0 0 1-3.48 2.36zM13.59 23.264l2.264.61a3.715 3.715 0 0 0 4.543-2.636l.64-2.402a11.383 11.383 0 0 1-7.448 4.428zm7.643-19.665L18.87 2.97a11.376 11.376 0 0 1 4.354 7.62l.65-2.459A3.715 3.715 0 0 0 21.231 3.6zM.672 13.809l-.541 2.04a3.715 3.715 0 0 0 2.636 4.543l2.107.562a11.38 11.38 0 0 1-4.203-7.145zM10.357.702 8.15.126a3.715 3.715 0 0 0-4.547 2.637l-.551 2.082A11.376 11.376 0 0 1 10.358.702z" /></svg></Link>
                <Link href="https://github.com/SirMrAlierfan"><FaGithub size={20} /></Link>

              </div>
              <p className="text-sm mt-3">📞 021-12345678</p>

            </div>
          </div>

          <div className="bg-gray-300 text-center py-3 text-xs rounded-t-xl">
            © {new Date().getFullYear()} هنرستان فنی فجر. تمامی حقوق محفوظ است.
          </div>
        </footer>
      </body>
    </html>
  );
}
