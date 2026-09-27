'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-10 w-10 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          >
            <Anchor className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
