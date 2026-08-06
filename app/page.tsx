"use client"

import { useState } from "react"
import { Star, Music } from "lucide-react"
import SearchForm, { type SearchState, type StudentResult } from "@/components/search-form"
import ResultBox from "@/components/result-box"

export default function Page() {
  const [searchState, setSearchState] = useState<SearchState>("idle")
  const [result, setResult] = useState<StudentResult | null>(null)

  const handleResult = (res: StudentResult | null, state: SearchState) => {
    setResult(res)
    setSearchState(state)
  }

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
      {/* Central radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(99,148,255,0.22) 0%, rgba(99,148,255,0.12) 30%, rgba(99,148,255,0.04) 60%, transparent 75%)",
          }}
        />
      </div>

      {/* Page content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-14 flex flex-col items-center gap-8">

        {/* Branding header */}
        <header className="flex flex-col items-center text-center space-y-3">
          <div className="w-24 h-24 mb-3.5">
            <img
              src="/clb-logo.jpg"
              alt="Logo CLB Nghệ Thuật THPT Lê Hồng Phong"
              className="w-full h-full"
              style={{ borderRadius: "48px", border: "1px solid rgba(250, 204, 21, 0.8)", objectFit: "fill" }}
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 uppercase text-balance">
            CLB Nghệ Thuật THPT Lê Hồng Phong
          </h1>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Music className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
            Gen 6 · Năm Học 2026-2027
          </div>
        </header>

        {/* Search form card */}
        <SearchForm onResult={handleResult} searchState={searchState} />

        {/* Result card */}
        <ResultBox state={searchState} result={result} />

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 leading-relaxed pb-32 space-y-4 w-full">
          <div className="space-y-1">
  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
    CỔNG TRA CỨU KẾT QUẢ TUYỂN SINH CLB NGHỆ THUẬT
  </p>
  <p className="text-sm font-bold text-slate-600 opacity-60">
    © 2026 CLB Nghệ Thuật THPT Lê Hồng Phong
  </p>
</div>

          {/* Address */}
          <div className="space-y-1">
            <p className="text-slate-500 font-extrabold uppercase tracking-wider text-[12px]">Địa chỉ</p>
            <p className="text-slate-500">THPT Lê Hồng Phong, 25 Đ. Nguyễn Thị Minh Khai, phường Phổ Yên, Thái Nguyên</p>
          </div>

          {/* Contact links */}
          <div className="space-y-2">
            <p className="text-slate-500 font-extrabold uppercase tracking-wider text-[12px]">Thông tin liên hệ</p>
            <div className="flex flex-col items-center gap-2">
              {/* Club leader */}
              <a
                href="https://www.facebook.com/share/189wRffP6v/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors underline underline-offset-2"
              >
                <Star className="w-3.5 h-3.5 shrink-0 fill-current" aria-hidden="true" />
                <span>Chủ nhiệm: Đặng Phương Anh</span>
              </a>

              {/* Email and TikTok */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <a
                  href="mailto:clbntthptlhp@gmail.com"
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors underline underline-offset-2"
                >
                  {/* Icon Email khớp 100% ảnh pngtree */}
                  <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M 1.5 4.5 h 21 L 12 11.8 Z M 2.8 19.5 h 18.4 L 12 14.1 Z M 1.5 6.2 v 11.6 L 9.2 12 Z M 22.5 6.2 v 11.6 L 14.8 12 Z" />
                  </svg>
                  <span>Email: clbntthptlhp@gmail.com</span>
                </a>
                <a
                  href="https://tiktok.com/@clbnt.lhptn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors underline underline-offset-2"
                >
                  <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 2.38 6.393 6.393 0 0 0 1.258 8.913 6.337 6.337 0 0 0 8.599-1.282 6.386 6.386 0 0 0 1.056-3.805V8.844a8.216 8.216 0 0 0 4.716 1.488V6.887a4.78 4.78 0 0 1-1.001-.201z"/>
                  </svg>
                  <span>TikTok: tiktok.com/@clbnt.lhptn</span>
                </a>
              </div>

              {/* Club Facebook */}
              <a
                href="https://facebook.com/clbnghethuatthptlehongphong"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors underline underline-offset-2"
              >
                <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook: fb.com/clbnghethuatthptlehongphong</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
