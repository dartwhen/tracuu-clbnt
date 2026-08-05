import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'

export interface StudentRecord {
  sbd: string
  name: string
  department: string // Ban đăng ký ban đầu
  passedDepartment: string // Ban trúng tuyển (nếu pass)
  class: string
  status: 'pass' | 'fail'
  notes: string
}

const cleanValue = (value: any): string => {
  if (value === null || value === undefined) return 'Chưa có'
  let str = String(value).trim()
  str = str.replace(/^"+|"+$/g, '').trim()
  str = str.replace(/""/g, '"').trim()
  return str === '' ? 'Chưa có' : str
}

export function getAllStudents(): StudentRecord[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'student-results.csv')
    if (!fs.existsSync(filePath)) {
      console.error('Không tìm thấy file tại:', filePath)
      return []
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
    }) as Record<string, any>[]

    return records.map((record) => {
      const rawStatus = cleanValue(record.status)
      const rawDept = cleanValue(record.department)

      // Kiểm tra có chứa chữ "pass" hay không
      const isPass = rawStatus.toLowerCase().includes('pass')

      // Trích xuất tên Ban trúng tuyển từ cột status (Ví dụ: 'pass "Ban Truyền thông"' -> 'Ban Truyền thông')
      let passedDept = rawDept
      if (isPass) {
        const match = rawStatus.match(/pass\s*"?([^"]+)"?/i)
        if (match && match[1]) {
          passedDept = match[1].trim()
        }
      }

      return {
        sbd: cleanValue(record.sbd),
        name: cleanValue(record.name),
        department: rawDept,
        passedDepartment: passedDept,
        class: cleanValue(record.class),
        status: isPass ? 'pass' : 'fail',
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