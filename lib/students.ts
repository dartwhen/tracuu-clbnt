import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'

export interface StudentRecord {
  sbd: string
  name: string
  department: string
  passedDepartment: string
  class: string
  status: 'pass' | 'fail' | 'absent'
  notes: string
}

const cleanValue = (value: any): string => {
  if (value === null || value === undefined) return 'Chưa có'
  let str = String(value).trim()
  str = str.replace(/^"+|"+$/g, '').trim()
  str = str.replace(/""/g, '"').trim()
  return str === '' || str.toLowerCase() === 'null' ? 'Chưa có' : str
}

function extractPassedDepartments(status: string): string[] {
  // Sử dụng \bpass\b để chỉ khớp chính xác từ 'pass' đứng độc lập, tránh dính 'fail' hay 'absent'
  const matches = [...status.matchAll(/\bpass\s*(?:["“”']\s*)?([^,"“”']+?)(?:["”']|(?=\s*(?:,|pass|$)))/gi)]
  return [...new Set(matches.map((match) => match[1].trim()).filter(Boolean))]
}

export function getAllStudents(): StudentRecord[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'student-results.csv')
    if (!fs.existsSync(filePath)) return []

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
    }) as Record<string, any>[]

    return records.map((record) => {
      const rawStatusValue = record.status
      const rawStatus = cleanValue(rawStatusValue)
      const rawDept = cleanValue(record.department)
      const normalizedStatus = rawStatus.toLowerCase()

      // Kiểm tra vắng mặt trước
      const isMissingStatus = rawStatusValue === null || rawStatusValue === undefined || String(rawStatusValue).trim() === '' || normalizedStatus === 'null' || normalizedStatus === 'chưa có'
      const isAbsent = isMissingStatus || normalizedStatus.includes('absent') || normalizedStatus.includes('vắng')

      // Lấy danh sách ban đỗ
      const passedDepartments = extractPassedDepartments(rawStatus)
      const isPass = !isAbsent && passedDepartments.length > 0

      // Xác định status chuẩn xác
      let finalStatus: 'pass' | 'fail' | 'absent' = 'fail'
      if (isAbsent) {
        finalStatus = 'absent'
      } else if (isPass) {
        finalStatus = 'pass'
      }

      return {
        sbd: cleanValue(record.sbd),
        name: cleanValue(record.name),
        department: rawDept,
        passedDepartment: isPass ? passedDepartments.join(', ') : 'Chưa có',
        class: cleanValue(record.class),
        status: finalStatus,
        notes: cleanValue(record.notes),
      }
    })
  } catch (error) {
    console.error('Lỗi khi đọc file CSV:', error)
    return []
  }
}

export function searchStudents(keyword: string): StudentRecord[] {
  if (!keyword || keyword.trim() === '') return []
  const students = getAllStudents()
  const searchTerm = keyword.trim().toLowerCase()
  return students.filter((student) => student.sbd.toLowerCase() === searchTerm)
}
