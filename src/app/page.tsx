import type { Metadata } from 'next';
import { SakuraCanvas } from '@/components/home/SakuraCanvas';
import { ParallaxBackground } from '@/components/home/ParallaxBackground';
import { HomeCard } from '@/components/home/HomeCard';

export const metadata: Metadata = {
  title: 'Weigh Anchor!',
  description: '今乗り越え 未来へと Weigh Anchor! — 跨越现今，前往未来，起锚吧！',
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-end justify-center pb-12 md:pb-16 overflow-hidden">
      <ParallaxBackground />
      <SakuraCanvas />
      <HomeCard />
    </div>
  );
}
