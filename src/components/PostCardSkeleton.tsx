import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
    return (
        <div className="group flex flex-col space-y-4 rounded-[22px] overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <Skeleton className="aspect-[16/10] w-full rounded-[18px]" />
            <div className="space-y-3 px-2 pb-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-2/3" />
                <div className="flex items-center gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
}
