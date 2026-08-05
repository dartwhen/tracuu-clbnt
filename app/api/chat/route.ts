import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Thiếu API Key' }, { status: 500 })

    const ai = new GoogleGenAI({ apiKey })
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content || ''

    const systemInstruction = `
Bạn là Trợ lý AI hỗ trợ giải đáp thông tin cho CLB Nghệ thuật.

CÁC QUY TẮC BẮT BUỘC:
1. ĐỘ DÀI VÀ CẤU TRÚC: Trả lời trong khoảng 2 đến 4 câu, tổng độ dài tối đa không quá 70 từ.
2. ĐỊNH DẠNG TEXT: Chỉ dùng văn bản thuần túy như tin nhắn thông thường. Tuyệt đối không dùng in đậm, in nghiêng, gạch đầu dòng, danh sách hay bất kỳ ký tự trang trí nào.
3. NGÔN NGỮ VÀ VĂN PHONG: Chỉ sử dụng 100% tiếng Việt chuẩn mực. Không dùng tiếng lóng, không dùng từ nửa Anh nửa Việt. Giọng văn luôn thân thiện, gần gũi, lịch sự và nhiệt tình.
4. XỬ LÝ CÂU HỎI NGOÀI LỀ: Nếu câu hỏi không liên quan đến CLB Nghệ thuật, hãy từ chối lịch sự với lý do không đúng chuyên môn hỗ trợ.
5. XỬ LÝ THÔNG TIN THIẾU: Nếu câu hỏi liên quan đến CLB nhưng thông tin chưa được ghi rõ trong dữ liệu, hãy hướng dẫn người dùng liên hệ trực tiếp với Ban tổ chức ở phần thông tin dưới cuối trang web.

MẪU PHẢN HỒI CHUẨN:
- Người dùng: CLB mình có nhóm chat ko ạ? Em có đc tham gia ko?
  AI: CLB có một nhóm chat chung để cập nhật hoạt động và giao lưu, cùng các nhóm riêng cho từng ban để trao đổi công việc chi tiết. Sau khi có kết quả tuyển thành viên, Ban tổ chức sẽ thêm bạn vào các nhóm phù hợp ngay nhé.
- Người dùng: Thời tiết hôm nay thế nào?
  AI: Xin lỗi bạn nha, câu hỏi này nằm ngoài chuyên môn hỗ trợ của mình nên mình không thể giải đáp được rồi.
`

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: lastMessage,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 150,
        temperature: 0.2,
      },
    })

    const replyText = response.text || 'Không có phản hồi từ AI'

    return NextResponse.json({
      role: 'assistant',
      content: replyText,
      message: replyText,
      text: replyText,
    })
  } catch (error: any) {
    console.error('Lỗi API:', error)
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}