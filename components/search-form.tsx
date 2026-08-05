"use client"

import { useState } from "react"
import { Hash, GraduationCap, Search, Info, Loader2 } from "lucide-react"

export type SearchState = "idle" | "loading" | "found" | "not-found"

export interface StudentResult {
  sbd: string
  name: string
  class: string
  department: string // Ban đăng ký ban đầu
  status: "pass" | "fail" | "absent" // Thêm trạng thái absent (Vắng mặt)
  notes?: string // Chứa thông tin pass "Ban Múa", "Ban Nhảy",... hoặc lời nhắn BTC
}

// Cache for previously found results — keyed by "SBD|CLASS"
const resultCache = new Map<string, StudentResult>()

interface SearchFormProps {
  onResult: (result: StudentResult | null, state: SearchState) => void
  searchState: SearchState
}

export default function SearchForm({ onResult, searchState }: SearchFormProps) {
  const [sbd, setSbd] = useState("")
  const [classNum, setClassNum] = useState("")

  const handleSearch = async () => {
    if (!sbd.trim() || !classNum.trim()) return

    const sbdUpper = sbd.trim().toUpperCase()
    const classStr = classNum.trim().toUpperCase()
    const cacheKey = `${sbdUpper}|${classStr}`

    // 1. Trả kết quả ngay lập tức nếu đã có trong Cache
    if (resultCache.has(cacheKey)) {
      onResult(resultCache.get(cacheKey)!, "found")
      return
    }

    onResult(null, "loading")
    const startTime = Date.now()

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sbd: sbdUpper, classNum: classStr }),
      })

      const elapsedTime = Date.now() - startTime
      const remainingTime = 4000 - elapsedTime // Chờ đủ 4s

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }

      if (!response.ok) {
        onResult(null, "not-found")
        return
      }

      const data = await response.json()

      if (data.found && data.result) {
        resultCache.set(cacheKey, data.result)
        onResult(data.result, "found")
      } else {
        onResult(null, "not-found")
      }
    } catch (error) {
      const elapsedTime = Date.now() - startTime
      const remainingTime = 4000 - elapsedTime
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }
      onResult(null, "not-found")
    }
  }

  const isLoading = searchState === "loading"

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg border border-slate-200/60 p-6 md:p-8 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-950 flex items-center gap-2.5">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full" aria-hidden="true" />
          Tra cứu kết quả tuyển sinh
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          Vui lòng nhập đầy đủ Số báo danh và Lớp học của bạn để kiểm tra kết quả tuyển thành viên.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
      >
        <div className="space-y-2">
          <label htmlFor="sbd" className="text-base font-bold text-slate-700 flex items-center gap-2">
            <Hash className="w-4 h-4 text-indigo-500" aria-hidden="true" />
            Số báo danh
          </label>
          <input
            type="text"
            id="sbd"
            value={sbd}
            onChange={(e) => setSbd(e.target.value)}
            placeholder="Ví dụ: LHP001, ART042..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium placeholder-slate-400 text-base disabled:bg-slate-100 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="classNum" className="text-base font-bold text-slate-700 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-500" aria-hidden="true" />
            Lớp học
          </label>
          <input
            type="text"
            id="classNum"
            value={classNum}
            onChange={(e) => setClassNum(e.target.value)}
            placeholder="Điền lớp học của bạn vào đây..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium placeholder-slate-400 text-base disabled:bg-slate-100 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
            autoComplete="off"
          />
          <p className="text-xs text-slate-500 italic pl-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" aria-hidden="true" />
            Nếu bạn học lớp 10C2, hãy điền vào ô trống trên là 10C2 - đầy đủ số và chữ
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>Đang tra cứu...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" aria-hidden="true" />
              <span>Tra cứu ngay</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}