'use client';

import { motion } from 'framer-motion';
import { BookOpen, GitBranch, Mail } from 'lucide-react';

const links = [
  { href: 'https://blog.shichiya.com', label: 'Blog', icon: BookOpen, external: false },
  { href: 'https://github.com/ShiChiYa7493', label: 'GitHub', icon: GitBranch, external: true },
  { href: 'mailto:contact@shichiya.com', label: 'Email', icon: Mail, external: true },
];

export function HomeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      className="relative z-20 w-full max-w-md mx-auto px-4"
    >
      <div className="backdrop-blur-xl bg-white/15 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white/30">
            S
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-3xl font-bold text-center text-white mb-2"
          style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}
        >
          Shichiya
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center text-white/70 text-sm mb-8"
        >
          Code & Dream ✦ Tech & Life
        </motion.p>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-3"
        >
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/15 border border-white/10 text-white text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </a>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
