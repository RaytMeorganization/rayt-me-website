'use client'

export default function ProfileError({ reset }: { reset: () => void }) {
  return <main className="grid min-h-screen place-items-center bg-[#f3f5f0] px-5 text-center"><div><h1 className="text-3xl font-semibold">Unable to load profile · تعذر تحميل الملف</h1><button onClick={reset} className="mt-6 rounded-full bg-[#17352c] px-6 py-3 text-sm font-semibold text-white">Try again · حاول مجدداً</button></div></main>
}
