import Link from 'next/link';

export default function Pagination({ meta, basePath }: {
  meta: { page: number; totalPages: number };
  basePath: string;
}) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      {meta.page > 1 && (
        <Link href={`${basePath}${basePath.includes('?') ? '&' : '?'}page=${meta.page - 1}`} className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
          Previous
        </Link>
      )}
      <span className="px-4 py-2 text-sm text-gray-500">{meta.page} / {meta.totalPages}</span>
      {meta.page < meta.totalPages && (
        <Link href={`${basePath}${basePath.includes('?') ? '&' : '?'}page=${meta.page + 1}`} className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
          Next
        </Link>
      )}
    </div>
  );
}
