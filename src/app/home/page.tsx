import { SakuraCanvas } from '@/components/home/SakuraCanvas';
import { ParallaxBackground } from '@/components/home/ParallaxBackground';
import { HomeCard } from '@/components/home/HomeCard';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParallaxBackground />
      <SakuraCanvas />
      <HomeCard />
    </div>
  );
}
