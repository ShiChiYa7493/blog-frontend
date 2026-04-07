import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shichiya',
  description: 'Welcome to my world',
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
