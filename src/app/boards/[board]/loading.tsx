import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full h-full p-4">
      <Skeleton className="h-12 w-[50%]" />
      <div className="flex flex-row mt-6 gap-4 h-[80%]">
        <Skeleton className="rounded-lg w-72 " />
        <Skeleton className="rounded-lg w-72" />
        <Skeleton className="rounded-lg w-72 " />
      </div>
    </div>
  );
}
