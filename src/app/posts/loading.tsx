import { PostCardSkeleton } from "@/components/PostCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "lucide-react";

export default function PostsLoading() {
    return (
        <main className="min-h-screen max-w-7xl mx-auto">
            {/* Header Section Skeleton */}
            <div className="border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 lg:px-20 py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl space-y-6">
                            <Skeleton className="h-12 w-3/4 md:w-[400px]" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                        <div className="w-full md:w-[300px]">
                            <Skeleton className="h-12 w-full rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 lg:px-20 py-12">
                {/* Filters Section Skeleton */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6 text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        <Tag size={16} />
                        <span>Filter by Category</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-10 w-24 rounded-full" />
                        ))}
                    </div>
                </div>

                {/* Posts Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <PostCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </main>
    );
}
