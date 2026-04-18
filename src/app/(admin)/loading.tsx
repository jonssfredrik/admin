import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-7 w-24" />
            <Skeleton className="mt-2 h-3 w-32" />
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-8 w-48" />
        <Skeleton className="mt-6 h-[180px] w-full" />
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="border-b p-4">
          <Skeleton className="h-4 w-32" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border/60 p-4 last:border-0">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-4 flex-1 max-w-[200px]" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </Card>
    </div>
  );
}
