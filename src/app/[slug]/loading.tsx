import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
    return (
        <main className="min-h-screen">
            <div className="relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Main Image Layer Skeleton */}
                <section className="max-w-7xl mx-auto pt-8 mb-8 px-6">
                    <Skeleton className="aspect-[16/9] md:aspect-[21/9] w-full rounded-md" />
                </section>

                <header className="relative pb-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Meta Category & Date Skeleton */}
                        <div className="flex items-center gap-4 mb-8">
                            <Skeleton className="h-8 w-24 rounded-lg" />
                            <Skeleton className="h-6 w-32" />
                        </div>

                        {/* Title Skeleton */}
                        <div className="space-y-4 mb-10">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-2/3" />
                        </div>

                        {/* Author section Skeleton */}
                        <div className="flex items-center justify-between pb-10 border-b border-gray-100 dark:border-gray-800/50">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <div className="hidden sm:flex gap-3">
                                <Skeleton className="h-11 w-11 rounded-xl" />
                                <Skeleton className="h-11 w-11 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Article Content Skeleton */}
                <article className="max-w-3xl mx-auto px-6 pb-24 space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                </article>
            </div>
        </main>
    );
}
