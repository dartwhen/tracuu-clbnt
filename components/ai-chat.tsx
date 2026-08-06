'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, X } from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('[v0] Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.button
            key="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            style={{
              bottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))',
            }}
            className="fixed left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium whitespace-nowrap flex items-center gap-2 shadow-[0_0_24px_8px_rgba(99,102,241,0.45)] hover:shadow-[0_0_32px_12px_rgba(99,102,241,0.6)] transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Rainbow glow effect */}
            <div className="absolute -inset-4 rounded-full blur-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90 -z-10 animate-pulse pointer-events-none" />

            <Sparkles className="w-5 h-5" />
            <span>Hỏi đáp tức thì</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Popup */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:bg-black/10"
            />

            {/* Chat Modal */}
            <motion.div
              key="modal"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:w-full md:max-w-lg h-[85vh] md:h-[600px] rounded-t-3xl md:rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-blue-100">
                <h2 className="text-lg md:text-xl font-bold text-blue-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Trợ lý AI
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Messages Container */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
              >
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                        Bạn đang nghĩ gì?
                      </p>
                      <p className="text-sm text-slate-600">
                        Hỏi bất cứ điều gì để bắt đầu
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-sm px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-blue-100 text-blue-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-base">{message.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
<form
  onSubmit={handleSubmit}
  className="p-4 md:p-6 border-t border-blue-100 bg-white"
>
  <div className="w-full flex items-center justify-between gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 focus-within:border-blue-500 transition-colors">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Nhập câu hỏi của bạn..."
      className="flex-1 bg-transparent text-blue-900 placeholder-blue-400 outline-none text-[17px]"
      disabled={isLoading}
    />
    <button
      type="submit"
      disabled={isLoading || !input.trim()}
      className="shrink-0 px-3.5 py-2 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold text-[17px] transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      aria-label="Send message"
    >
      <Send className="w-4 h-4" />
      <span>Hỏi</span>
    </button>
  </div>
</form>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIChat