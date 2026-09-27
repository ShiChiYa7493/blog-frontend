'use client';

import { useEffect, useState } from 'react';
import { getStats } from '@/lib/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye, MessageSquare, BookOpen, PenLine } from 'lucide-react';

const icons = [BookOpen, PenLine, FileText, MessageSquare, Eye];

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  if (!stats) return <p className="text-muted-foreground">加载中...</p>;

  const cards = [
    { label: '文章总数', value: stats.articleCount },
    { label: '已发布', value: stats.publishedCount },
    { label: '草稿', value: stats.draftCount },
    { label: '评论', value: stats.commentCount },
    { label: '总浏览量', value: stats.totalViews },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card, i) => {
          const Icon = icons[i];
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
