          <motion.button
            key="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            style={{
              bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
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
