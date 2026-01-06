import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function MyPostsLoading() {
    return (
        <div className="min-h-screen dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Page Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-200 dark:border-gray-800">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <div className="h-14 w-44 rounded-full bg-indigo-100 dark:bg-indigo-900/20 animate-pulse" />
                </div>

                {/* My Posts List Skeleton */}
                <div className="grid grid-cols-1 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-[22px] border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row shadow-sm">
                            <Skeleton className="md:w-72 h-64 md:h-auto flex-shrink-0" />
                            <div className="p-8 md:p-10 flex flex-col justify-between flex-grow">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-4 w-32" />
                                        <div className="w-1 h-1 bg-gray-200 rounded-full" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <div className="space-y-3">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-3/4" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                    <Skeleton className="h-10 w-24 rounded-sm" />
                                    <Skeleton className="h-10 w-24 rounded-sm" />
                                    <Skeleton className="h-10 w-24 ml-auto rounded-sm" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
