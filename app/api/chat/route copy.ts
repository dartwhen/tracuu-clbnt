import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('❌ Lỗi: Thiếu GEMINI_API_KEY trong .env.local')
      return NextResponse.json(
        { error: 'Chưa cài đặt GEMINI_API_KEY' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content || ''

    // Sử dụng model Flash-Lite chuẩn tối ưu tốc độ và chi phí
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: lastMessage,
    })

    const replyText = response.text || 'Không có phản hồi từ AI'

    // Trả về đầy đủ các key phổ biến để frontend đọc dễ dàng
    return NextResponse.json({
      role: 'assistant',
      content: replyText,
      message: replyText,
      text: replyText,
    })
  } catch (error: any) {
    console.error('❌ Lỗi chi tiết từ Gemini API:', error?.message || error)
    return NextResponse.json(
      { error: 'Lỗi server khi gọi Gemini' },
      { status: 500 }
    )
  }
}
