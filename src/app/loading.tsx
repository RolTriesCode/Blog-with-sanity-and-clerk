import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Zap, TrendingUp, Globe, Radio, ArrowRight, ChevronRight } from "lucide-react";

const CATEGORIES = [
    { name: "Technology", slug: "tech", icon: Zap, color: "bg-blue-500" },
    { name: "Lifestyle", slug: "lifestyle", icon: Sparkles, color: "bg-pink-500" },
    { name: "Education", slug: "education", icon: Globe, color: "bg-green-500" },
    { name: "News", slug: "news", icon: Radio, color: "bg-red-500" },
    { name: "Entertainment", slug: "entertainment", icon: TrendingUp, color: "bg-purple-500" },
];

export default function Loading() {
    return (
        <main className="min-h-screen bg-[#F8F8F8] dark:bg-gray-950 overflow-x-hidden">
            {/* Hero Section Skeleton */}
            <section className="relative pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-[22px] overflow-hidden bg-gray-900">
                        <Skeleton className="absolute inset-0 h-full w-full rounded-[22px]" />

                        <div className="relative pt-16 pb-16 px-8 md:px-16 lg:py-34 max-w-4xl">
                            <Skeleton className="h-6 w-48 rounded-full mb-6" />
                            <Skeleton className="h-12 md:h-16 w-full max-w-2xl mb-4 rounded-lg" />
                            <Skeleton className="h-12 md:h-16 w-3/4 max-w-xl mb-8 rounded-lg" />
                            <Skeleton className="h-6 w-full max-w-2xl mb-4 rounded-md" />
                            <Skeleton className="h-6 w-2/3 max-w-lg mb-10 rounded-md" />

                            <div className="flex flex-wrap gap-4">
                                <Skeleton className="h-12 w-40 rounded-full" />
                                <Skeleton className="h-12 w-36 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Section Skeleton */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-0.5 w-12 md:w-24 bg-indigo-600 rounded-full" />
                    <Skeleton className="h-4 w-32 rounded-md" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white dark:bg-gray-900 rounded-[22px] p-6 lg:p-10 border border-gray-100 dark:border-gray-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                    <div className="lg:col-span-7">
                        <Skeleton className="w-full h-[300px] lg:h-[500px] rounded-[22px]" />
                    </div>

                    <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-24 rounded-md" />
                            <Skeleton className="h-10 md:h-14 w-full rounded-lg" />
                            <Skeleton className="h-10 md:h-14 w-4/5 rounded-lg" />
                            <Skeleton className="h-5 w-full rounded-md mt-4" />
                            <Skeleton className="h-5 w-full rounded-md" />
                            <Skeleton className="h-5 w-3/4 rounded-md" />
                        </div>

                        <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32 rounded-md" />
                                    <Skeleton className="h-3 w-24 rounded-md" />
                                </div>
                            </div>
                            <Skeleton className="w-12 h-12 rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Grid Skeleton */}
            <section className="py-20 bg-white/50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded-md" />
                            <Skeleton className="h-10 md:h-14 w-64 rounded-lg" />
                        </div>
                        <Skeleton className="h-6 w-32 rounded-md" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-6">
                                <Skeleton className="w-full aspect-[16/10] rounded-[22px]" />
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-20 rounded-md" />
                                    <Skeleton className="h-8 w-full rounded-lg" />
                                    <Skeleton className="h-8 w-4/5 rounded-lg" />
                                    <div className="flex items-center gap-3 pt-4">
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-3 w-28 rounded-md" />
                                            <Skeleton className="h-3 w-20 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Categories Explorer Skeleton */}
            <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
                    <Skeleton className="h-4 w-32 mx-auto rounded-md" />
                    <Skeleton className="h-12 md:h-14 w-96 mx-auto rounded-lg" />
                    <Skeleton className="h-12 md:h-14 w-80 mx-auto rounded-lg" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    {CATEGORIES.map((cat) => (
                        <div
                            key={cat.slug}
                            className="relative h-64 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 flex flex-col justify-end overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 ${cat.color} opacity-5 blur-[40px]`} />
                            <div className="space-y-4 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl ${cat.color} text-white flex items-center justify-center shadow-lg`}>
                                    <cat.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-28 rounded-md" />
                                    <Skeleton className="h-3 w-20 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section Skeleton */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto px-10 py-20 bg-indigo-600 rounded-[4rem] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                        <Skeleton className="h-12 md:h-14 w-full max-w-lg mx-auto rounded-lg bg-indigo-500" />
                        <Skeleton className="h-12 md:h-14 w-3/4 max-w-md mx-auto rounded-lg bg-indigo-500" />
                        <Skeleton className="h-6 w-full max-w-xl mx-auto rounded-md bg-indigo-500" />
                        <Skeleton className="h-6 w-4/5 max-w-lg mx-auto rounded-md bg-indigo-500" />
                        <Skeleton className="h-12 w-40 mx-auto rounded-full bg-white/20" />
                    </div>
                </div>
            </section>

            {/* Footer Skeleton */}
            <footer className="pt-32 pb-12 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-12">
                        <div className="lg:col-span-5 space-y-8">
                            <Skeleton className="h-12 w-48 rounded-lg" />
                            <Skeleton className="h-5 w-full max-w-sm rounded-md" />
                            <Skeleton className="h-5 w-4/5 max-w-md rounded-md" />
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-6">
                                    <Skeleton className="h-4 w-24 rounded-md" />
                                    <div className="space-y-4">
                                        <Skeleton className="h-4 w-20 rounded-md" />
                                        <Skeleton className="h-4 w-16 rounded-md" />
                                        <Skeleton className="h-4 w-24 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-20 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <Skeleton className="h-4 w-48 rounded-md" />
                    </div>
                </div>
            </footer>
        </main>
    );
}
