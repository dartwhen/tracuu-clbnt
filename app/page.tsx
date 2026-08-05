"use client"

import { useState } from "react"
import { Music } from "lucide-react"
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
        <footer className="text-center text-xs text-slate-400 leading-relaxed pb-6 space-y-4 w-full">
          <p className="text-sm font-bold text-slate-600 opacity-60">© 2026 CLB Nghệ Thuật THPT Lê Hồng Phong</p>

          {/* Address */}
          <div className="space-y-1">
            <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Địa chỉ</p>
            <p className="text-slate-500">THPT Lê Hồng Phong, 25 Đ. Nguyễn Thị Minh Khai, phường Phổ Yên, Thái Nguyên</p>
          </div>

          {/* Contact links */}
          <div className="space-y-2">
            <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Thông tin liên hệ</p>
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium w-20 text-right">Email:</span>
                <a
                  href="mailto:clbntthptlhp@gmail.com"
                  className="text-slate-500 hover:text-indigo-500 transition-colors underline underline-offset-2"
                >
                  clbntthptlhp@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium w-20 text-right">Facebook:</span>
                <a
                  href="https://facebook.com/clbnghethuatthptlehongphong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-indigo-500 transition-colors underline underline-offset-2"
                >
                  facebook.com/clbnghethuatthptlehongphong
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium w-20 text-right">TikTok:</span>
                <a
                  href="https://tiktok.com/@clbnt.lhptn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-indigo-500 transition-colors underline underline-offset-2"
                >
                  tiktok.com/@clbnt.lhptn
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium w-20 text-right">Chủ nhiệm:</span>
                <a
                  href="https://www.facebook.com/share/189wRffP6v/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-indigo-500 transition-colors underline underline-offset-2"
                >
                  Đặng Phương Anh
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
