import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function CreatePostLoading() {
    return (
        <div className="min-h-screen bg-[#F8F8F8] dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="inline-flex items-center text-sm font-medium text-gray-300">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Main Content Area Skeleton */}
                        <div className="lg:col-span-8 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 space-y-12">
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-48" />
                                <Skeleton className="h-6 w-64" />
                            </div>

                            <div className="space-y-8">
                                <Skeleton className="h-14 w-full" />
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-32 rounded-full" />
                                    </div>
                                    <Skeleton className="h-[400px] w-full" />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Skeleton */}
                        <div className="lg:col-span-4 bg-gray-50/50 dark:bg-gray-800/30 p-8 lg:p-10 space-y-10">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-12 w-full rounded-[12px]" />
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-48 w-full rounded-2xl" />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Skeleton className="h-16 w-full rounded-[12px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
