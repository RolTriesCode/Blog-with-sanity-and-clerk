import CategoryFilter from "@/components/CategoryFilter";
import { PostCard } from "@/components/PostCard";
import SearchInput from "@/components/SearchInput";
import { client } from "@/sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { Search, Tag } from "lucide-react";
import { type SanityDocument } from "next-sanity";
import Link from "next/link";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

const options = { next: { revalidate: 30 } };

export default async function PostsPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; categories?: string }>;
}) {
    const { query: searchTerm, categories: selectedCats } = await searchParams;

    const categoryFilter = selectedCats
        ? ` && category in ${JSON.stringify(selectedCats.split(","))}`
        : "";

    const searchQuery = searchTerm
        ? `*[_type == "post" && defined(slug.current)${categoryFilter} && (title match $searchTerm || body[].children[].text match $searchTerm)] | order(publishedAt desc)`
        : `*[_type == "post" && defined(slug.current)${categoryFilter}] | order(publishedAt desc)`;

    const queryDetails = `{
    _id,
    title,
    category,
    slug,
    publishedAt,
    image,
    "author": author-> {
      name,
      email,
      profileImage
    }
  }`;

    const posts = await client.fetch<SanityDocument[]>(
        searchQuery + queryDetails,
        searchTerm ? { searchTerm: `*${searchTerm}*` } : {},
        options
    );

    return (
        <main className="min-h-screen max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 lg:px-20 py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
                                Explore Our <span className="text-indigo-600">Stories</span>
                            </h1>
                            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                                Deep dives into technology, lifestyle, and everything in between.
                                Find the inspiration you need for your next big project.
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            <SearchInput defaultValue={searchTerm} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 lg:px-20 py-12">
                {/* Filters Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6 text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        <Tag size={16} />
                        <span>Filter by Category</span>
                    </div>
                    <CategoryFilter />
                </div>

                {/* Posts Grid */}
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.map((post: any) => (
                            <PostCard key={post._id} post={post} showMeta={true} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                            <Search size={40} className="text-indigo-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">No matching stories</h2>
                        <p className="text-gray-500 max-w-md">
                            We couldn't find any posts matching your current search or filters.
                            Try clearing your selection or searching for something else.
                        </p>
                        <Link
                            href="/posts"
                            className="mt-8 px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                        >
                            View All Posts
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
