// src/app/page.jsx
import HomeClient from "@/components/HomeClinet";
import { listPages, listMajors } from "@/lib/adminApi";


export default async function Home() {
  const pages = await listPages();
  const majors = await listMajors();

  // داده‌ها رو به Client Component پاس می‌دیم
  return <HomeClient pages={pages} majors={majors} />;
}
