import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shichiya | Welcome',
  description: 'Code & Dream - Personal Homepage',
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
