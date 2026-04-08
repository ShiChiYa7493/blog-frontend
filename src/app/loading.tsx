/* eslint-disable @next/next/no-img-element */
export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <img
        src="/IMG_7444.png"
        alt="Loading..."
        className="w-36 h-36 object-contain rounded-2xl mb-6 animate-bounce"
        style={{ animationDuration: '2s' }}
      />
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}
