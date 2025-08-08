export default function HomePage() {
  const news = [
    {
      id: 1,
      title: "شروع ثبت‌نام ترم جدید",
      slug: "new-semester-registration",
      excerpt: "ثبت‌نام برای ترم پاییز ۱۴۰۴ آغاز شد. جهت اطلاعات بیشتر کلیک کنید.",
    },
    {
      id: 2,
      title: "افتتاح کارگاه جدید طراحی صنعتی",
      slug: "industrial-design-workshop",
      excerpt: "کارگاه مدرن طراحی صنعتی با تجهیزات کامل افتتاح شد.",
    },
    {
      id: 3,
      title: "برگزاری جشنواره هنرهای تجسمی",
      slug: "art-festival",
      excerpt: "دانش‌آموزان می‌توانند آثار خود را تا پایان مهر ارسال کنند.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-12">
      {/* بخش ویدیوی معرفی */}
      <section className="rounded-lg overflow-hidden shadow-lg">
        <video
          className="w-full h-64 object-cover"
          controls
          poster="/video-thumbnail.jpg" // عکس پیش‌نمایش
        >
          <source src="/intro-video.mp4" type="video/mp4" />
          مرورگر شما از ویدیو پشتیبانی نمی‌کند.
        </video>
      </section>

      {/* بخش معرفی هنرستان */}
      <section className="bg-white p-6 rounded-lg shadow-md text-justify leading-7">
        <h2 className="text-2xl font-bold mb-4 text-center">درباره هنرستان ما</h2>
        <p>
          هنرستان فنی و حرفه‌ای "نقش آفرینان آینده"، با هدف پرورش استعدادهای جوان در زمینه‌های
          هنری و فنی فعالیت می‌کند. با بهره‌گیری از اساتید مجرب، تجهیزات به‌روز و رویکردی
          خلاقانه، تلاش می‌کنیم فضایی مناسب برای رشد علمی و عملی دانش‌آموزان فراهم کنیم.
        </p>
      </section>

      {/* بخش اخبار و اطلاعیه‌ها */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">اخبار و اطلاعیه‌ها</h2>
        <ul className="space-y-4">
          {news.map((item) => (
            <li
              key={item.id}
              className="bg-gray-100 p-4 rounded-md hover:bg-gray-200 transition-all"
            >
              <a href={`/news/${item.slug}`} className="block">
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-700">{item.excerpt}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
