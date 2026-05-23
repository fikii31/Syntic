import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  variant?: 'default' | 'compact';
}

export function ThemeToggle({ isDark, onToggle, variant = 'default' }: ThemeToggleProps) {
  if (variant === 'compact') {
    return (
      <button
        onClick={onToggle}
        aria-label="Toggle theme"
        className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 overflow-hidden"
        style={{
          background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}>
              <Sun className="w-4 h-4 text-yellow-400" />
            </motion.span>
          ) : (
            <motion.span key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}>
              <Moon className="w-4 h-4 text-indigo-600" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
      style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
      }}
    >
      {/* Track */}
      <div className="relative w-10 h-5 rounded-full transition-colors duration-300"
        style={{ background: isDark ? '#7C3AED' : '#e2e8f0' }}>
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{
            left: isDark ? 'calc(100% - 18px)' : '2px',
            background: isDark ? '#fff' : '#7C3AED',
          }}
        >
          {isDark
            ? <Moon className="w-2.5 h-2.5 text-purple-700" />
            : <Sun className="w-2.5 h-2.5 text-white" />
          }
        </motion.div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-xs select-none"
          style={{ color: isDark ? '#a1a1aa' : '#71717a', fontWeight: 500 }}
        >
          {isDark ? 'Dark' : 'Light'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
