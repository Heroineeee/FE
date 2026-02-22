// src/components/StoreDetail/StoreDetailSkeleton.tsx
export default function StoreDetailSkeleton() {
  return (
    <div className="px-4 py-4 space-y-5">
      <div className="space-y-3">
        <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
        <div className="h-7 w-2/3 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="flex items-center gap-2">
        <div className="h-9 w-28 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-9 w-16 rounded-full bg-gray-200 animate-pulse" />
      </div>

      <div className="h-[220px] w-full rounded-xl bg-gray-200 animate-pulse" />

      <div className="space-y-3">
        <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="h-20 w-full rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-20 w-full rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}