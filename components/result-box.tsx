"use client"

import { SearchCode, UserCheck, CheckCircle2, XCircle, AlertCircle, BookOpen, Hash, IdCard, GraduationCap, MessageSquareText } from "lucide-react"
import type { StudentResult, SearchState } from "./search-form"

interface ResultBoxProps {
  state: SearchState
  result: StudentResult | null
}

const STATUS_CONFIG = {
  pass: {
    label: "ĐỖ CHÍNH THỨC",
    badgeClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    banner: "bg-emerald-50 border-emerald-200 text-emerald-800",
    bannerIcon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />,
    message: "Chúc mừng! Bạn đã chính thức trở thành thành viên của CLB Nghệ Thuật LHP.",
  },
  fail: {
    label: "CHƯA ĐẠT",
    badgeClass: "bg-red-100 text-red-600 border border-red-200",
    banner: "bg-red-50 border-red-200 text-red-800",
    bannerIcon: <XCircle className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />,
    message: "Rất tiếc, bạn chưa đạt yêu cầu của kỳ tuyển này. Bạn vẫn còn cơ hội tham gia đợt tuyển sinh tiếp theo. Hãy tiếp tục cố gắng nhé! 💗",
  },
  absent: {
    label: "CHƯA CÓ KẾT QUẢ",
    badgeClass: "bg-amber-100 text-amber-700 border border-amber-200",
    banner: "bg-amber-50 border-amber-200 text-amber-800",
    bannerIcon: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />,
    message: "Thí sinh vắng mặt trong buổi phỏng vấn hoặc chưa có kết quả chính thức.",
  },
} as const

export default function ResultBox({ state, result }: ResultBoxProps) {
  const displayDepartment =
    result?.status === "pass" ? result.passedDepartment : result?.department || "Chưa có"

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg border border-slate-200/60 p-6 md:p-8 transition-all duration-300">
      {state === "idle" && (
        <div className="py-10 flex flex-col items-center gap-3 text-slate-400">
          <SearchCode className="w-14 h-14 text-slate-200" aria-hidden="true" />
          <p className="text-slate-500 font-medium text-sm">Kết quả tra cứu sẽ hiển thị tại đây</p>
        </div>
      )}

      {state === "loading" && (
        <div className="py-10 flex flex-col items-center gap-4 text-slate-500">
          <div
            className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"
            role="status"
            aria-label="Đang tải"
          />
          <p className="font-semibold text-sm">Đang xác thực thông tin...</p>
        </div>
      )}

      {state === "not-found" && (
        <div className="py-10 flex flex-col items-center gap-3 fade-in-up">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
            <XCircle className="w-8 h-8 text-red-400" aria-hidden="true" />
          </div>
          <p className="font-bold text-slate-800 text-lg">Không tìm thấy thông tin</p>
          <p className="text-sm text-slate-500 text-center max-w-xs leading-relaxed">
            Số báo danh hoặc số lớp không chính xác. Vui lòng kiểm tra lại và thử lại.
          </p>
        </div>
      )}

      {state === "found" && result && (
        <div className="space-y-5 fade-in-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-500" aria-hidden="true" />
              Thông tin thí sinh
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${STATUS_CONFIG[result.status].badgeClass}`}>
              {STATUS_CONFIG[result.status].label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoCard label="Họ và Tên" value={result.name} icon={<IdCard className="w-3.5 h-3.5 text-indigo-400" />} />
            <InfoCard label="Lớp Học" value={result.class} icon={<GraduationCap className="w-3.5 h-3.5 text-indigo-400" />} />
            <InfoCard label="Số Báo Danh" value={result.sbd} icon={<Hash className="w-3.5 h-3.5 text-indigo-400" />} />
            <InfoCard
              label={result.status === "pass" ? "Ban Trúng Tuyển" : "Ban Đăng Ký"}
              value={displayDepartment}
              icon={<BookOpen className="w-3.5 h-3.5 text-indigo-400" />}
            />
          </div>

          <div className={`flex items-start gap-3 p-4 rounded-xl border ${STATUS_CONFIG[result.status].banner}`} role="alert">
            {STATUS_CONFIG[result.status].bannerIcon}
            <p className="text-sm font-semibold leading-relaxed">{STATUS_CONFIG[result.status].message}</p>
          </div>

          <div className="flex items-start gap-2.5 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <MessageSquareText className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Lời nhắn từ Ban tổ chức</span>
              <p className="text-sm text-slate-700 leading-relaxed">{result.notes === "Chưa có" ? "Không có lời nhắn bổ sung." : result.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <span className="text-xs font-bold text-slate-400 block uppercase mb-1 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="text-base font-extrabold text-slate-900">{value}</span>
    </div>
  )
}
