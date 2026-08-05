import { NextResponse } from 'next/server'
import { searchStudents } from '@/lib/students'

function handleSearch(sbd: string, classNum?: string) {
  if (!sbd) {
    return NextResponse.json({ result: null, found: false })
  }

  const matches = searchStudents(sbd)
  const matchedStudent = matches.find((student) => {
    if (classNum && classNum.trim() !== '') {
      return student.class.toLowerCase() === classNum.trim().toLowerCase()
    }
    return true
  })

  if (!matchedStudent) {
    return NextResponse.json({ result: null, found: false })
  }

  return NextResponse.json({
    result: {
      sbd: matchedStudent.sbd,
      name: matchedStudent.name,
      class: matchedStudent.class,
      department: matchedStudent.department,
      passedDepartment: matchedStudent.passedDepartment,
      status: matchedStudent.status,
      notes: matchedStudent.notes,
    },
    found: true,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sbd, classNum } = body || {}
    return handleSearch(sbd, classNum)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sbd = searchParams.get('sbd') || searchParams.get('q') || ''
    const classNum = searchParams.get('classNum') || undefined
    return handleSearch(sbd, classNum)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}