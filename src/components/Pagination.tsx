import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Pagination({ meta, basePath }: {
  meta: { page: number; totalPages: number };
  basePath: string;
}) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      {meta.page > 1 && (
        <Link
          href={`${basePath}${basePath.includes('?') ? '&' : '?'}page=${meta.page - 1}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'default' }))}
        >
          Previous
        </Link>
      )}
      <span className="px-4 py-2 text-sm text-muted-foreground">{meta.page} / {meta.totalPages}</span>
      {meta.page < meta.totalPages && (
        <Link
          href={`${basePath}${basePath.includes('?') ? '&' : '?'}page=${meta.page + 1}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'default' }))}
        >
          Next
        </Link>
      )}
    </div>
  );
}
