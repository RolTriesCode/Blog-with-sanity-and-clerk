"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

const CATEGORIES = [
    { title: 'Technology', value: 'tech' },
    { title: 'Lifestyle', value: 'lifestyle' },
    { title: 'Education', value: 'education' },
    { title: 'News', value: 'news' },
    { title: 'Entertainment', value: 'entertainment' },
];


export default function CategoryFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const selectedCategories = searchParams.get("categories")?.split(",") || [];

    const toggleCategory = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        let newSelected = [...selectedCategories];

        if (newSelected.includes(value)) {
            newSelected = newSelected.filter((c) => c !== value);
        } else {
            newSelected.push(value);
        }

        if (newSelected.length > 0) {
            params.set("categories", newSelected.join(","));
        } else {
            params.delete("categories");
        }

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    return (
        <div className={`flex flex-wrap gap-2 mb-8 transition-opacity ${isPending ? 'opacity-70' : ''}`}>
            <button
                onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("categories");
                    startTransition(() => {
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                    });
                }}
                disabled={isPending}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-200 border ${selectedCategories.length === 0
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-white border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600"
                    }`}
            >
                All
            </button>
            {CATEGORIES.map((cat) => {
                const isActive = selectedCategories.includes(cat.value);
                return (
                    <button
                        key={cat.value}
                        onClick={() => toggleCategory(cat.value)}
                        disabled={isPending}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${isActive
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                            : "bg-white border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600"
                            }`}
                    >
                        {cat.title}
                    </button>
                );
            })}
        </div>
    );
}
