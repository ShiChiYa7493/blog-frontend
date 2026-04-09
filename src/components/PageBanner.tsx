import { Anchor } from 'lucide-react';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function PageBanner({ title, subtitle, icon }: PageBannerProps) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 px-6 py-8 md:px-10 md:py-10">
      {/* Decorative elements */}
      <svg className="absolute right-4 bottom-0 text-primary/5 w-32 h-32 md:w-48 md:h-48" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" />
        <path d="M100,20 L100,180 M20,100 L180,100" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <Anchor className="absolute right-8 top-8 h-6 w-6 text-primary/10 md:h-8 md:w-8" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          {icon}
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-muted-foreground mt-2 text-sm md:text-base">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
