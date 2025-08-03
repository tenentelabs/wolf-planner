import { Skeleton } from "./skeleton"

export function ClienteCardSkeleton() {
  return (
    <div className="border rounded-xl p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  )
}

export function DashboardCardSkeleton() {
  return (
    <div className="border rounded-xl p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

export function ObjectiveCardSkeleton() {
  return (
    <div className="border rounded-xl p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  )
}