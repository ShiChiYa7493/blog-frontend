'use client';

import { motion } from 'framer-motion';
import { Anchor, Ship, Mail } from 'lucide-react';

const links = [
  { href: '/blog', label: 'Blog', icon: Ship, external: false },
  { href: 'https://github.com/ShiChiYa7493', label: 'GitHub', icon: Anchor, external: true },
  { href: 'mailto:contact@shichiya.com', label: 'Email', icon: Mail, external: true },
];

export function HomeCard() {
  return (
    <div className="relative z-20 w-full max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        className="backdrop-blur-xl bg-white/15 dark:bg-black/20 border border-blue-200/30 dark:border-blue-400/20 rounded-2xl p-6 md:p-8 shadow-2xl shadow-blue-900/10"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Horizontal layout: left info + right links */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-8">

          {/* Left: Avatar + Name + Tagline */}
          <div className="flex flex-col items-center md:items-start md:flex-1">
            {/* Avatar + Name row */}
            <div className="flex items-center gap-4 mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
              >
                <img
                  src="/avatar.jpg"
                  alt="优川七夜"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shadow-lg ring-4 ring-blue-200/40 dark:ring-blue-400/30"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h1
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}
                >
                  优川七夜
                </h1>
                <p className="text-blue-100/60 text-xs tracking-widest uppercase">
                  Yuga Shichiya
                </p>
              </motion.div>
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-center md:text-left mb-4 md:mb-0"
            >
              <p className="text-white/90 text-sm font-medium italic">
                今乗り越え 未来へと Weigh Anchor!
              </p>
              <p className="text-blue-100/50 text-xs mt-1">
                跨越现今，前往未来，起锚吧！
              </p>
            </motion.div>
          </div>

          {/* Divider: vertical on desktop, horizontal on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="flex md:flex-col items-center gap-3 my-4 md:my-0"
          >
            <div className="flex-1 h-px md:h-auto md:w-px md:min-h-[100px] bg-gradient-to-r md:bg-gradient-to-b from-transparent via-blue-200/30 to-transparent" />
            <Anchor className="h-3 w-3 text-blue-200/50 shrink-0" />
            <div className="flex-1 h-px md:h-auto md:w-px md:min-h-[100px] bg-gradient-to-r md:bg-gradient-to-b from-transparent via-blue-200/30 to-transparent" />
          </motion.div>

          {/* Right: Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col gap-2.5 md:w-44"
          >
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-center gap-3 w-full px-4 py-2.5 rounded-xl bg-blue-50/10 hover:bg-blue-100/20 dark:bg-blue-900/10 dark:hover:bg-blue-800/20 border border-blue-200/20 hover:border-blue-300/40 text-white text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
