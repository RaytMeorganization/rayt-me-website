import Link from 'next/link'

export default function ProfileNotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#faf6ee] px-5 text-center"><div><p className="text-sm font-bold uppercase tracking-widest text-[#255840]">RaytME</p><h1 className="mt-4 text-4xl font-semibold">Profile not found · الملف غير موجود</h1><Link href="/" className="mt-7 inline-block rounded-full bg-[#11213D] px-6 py-3 text-sm font-semibold text-white">Back to RaytME · العودة</Link></div></main>
}
