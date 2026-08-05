import { NextResponse } from 'next/server'
import { searchStudents } from '@/lib/students'

function handleSearch(sbd: string, classNum?: string) {
  if (!sbd) {
    return NextResponse.json({ result: null, found: false })
  }

  const matches = searchStudents(sbd).filter((student) => {
    if (classNum && classNum.trim() !== '') {
      return student.class.toLowerCase() === classNum.trim().toLowerCase()
    }
    return true
  })

  if (matches.length === 0) {
    return NextResponse.json({ result: null, found: false })
  }

  const firstMatch = matches[0]
  const passedDepartments = [...new Set(
    matches.flatMap((student) =>
      student.passedDepartment === 'Chưa có'
        ? []
        : student.passedDepartment.split(',').map((department) => department.trim()),
    ),
  )]
  const hasPass = passedDepartments.length > 0
  const allAbsent = matches.every((student) => student.status === 'absent')
  const status = hasPass ? 'pass' : allAbsent ? 'absent' : 'fail'

  return NextResponse.json({
    result: {
      sbd: firstMatch.sbd,
      name: firstMatch.name,
      class: firstMatch.class,
      department: firstMatch.department,
      passedDepartment: passedDepartments.join(', ') || 'Chưa có',
      status,
      notes: firstMatch.notes,
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
