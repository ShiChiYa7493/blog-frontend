'use client';

import { useEffect, useState } from 'react';
import { getStats } from '@/lib/admin-api';

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  if (!stats) return <p className="text-gray-500">Loading...</p>;

  const cards = [
    { label: 'Total Articles', value: stats.articleCount },
    { label: 'Published', value: stats.publishedCount },
    { label: 'Drafts', value: stats.draftCount },
    { label: 'Comments', value: stats.commentCount },
    { label: 'Total Views', value: stats.totalViews },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
