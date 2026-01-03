import { client } from "@/sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { type SanityDocument } from "next-sanity";
import Image from "next/image"
import Link from "next/link";
import { ArrowUpRight, Calendar, User, Tag, Search } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import CategoryFilter from "@/components/CategoryFilter";
import Hero from "@/components/images/herosectionimg.jpg"

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
        <main className="min-h-screen bg-[#fcfcfc]">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 lg:px-20 py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                                Explore Our <span className="text-indigo-600">Stories</span>
                            </h1>
                            <p className="text-lg text-gray-500 leading-relaxed">
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
                    <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        <Tag size={16} />
                        <span>Filter by Category</span>
                    </div>
                    <CategoryFilter />
                </div>

                {/* Posts Grid */}
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.map((post) => (
                            <article
                                key={post._id}
                                className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500"
                            >
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <Link href={`/${post.slug.current}`}>
                                        {post.image ? (
                                            <Image
                                                src={urlFor(post.image)?.url() || Hero}
                                                alt={post.title}
                                                fill
                                                className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        ) : (
                                            <Image
                                                src={Hero}
                                                alt="Default placeholder"
                                                fill
                                                className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        )}
                                    </Link>

                                    {/* Glassmorphism Category Badge */}
                                    {post.category && (
                                        <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/20 text-xs font-bold text-gray-900 shadow-sm uppercase tracking-widest">
                                            {post.category}
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 mb-4 text-xs font-medium text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-indigo-400" />
                                            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        {post.author?.name && (
                                            <div className="flex items-center gap-1.5">
                                                <User size={14} className="text-indigo-400" />
                                                <span>{post.author.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
                                        <Link href={`/${post.slug.current}`}>
                                            {post.title}
                                        </Link>
                                    </h3>

                                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                                        <Link
                                            href={`/${post.slug.current}`}
                                            className="group/link inline-flex items-center gap-2 text-sm font-bold text-gray-900"
                                        >
                                            <span className="relative">
                                                Read Full Story
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover/link:w-full transition-all duration-300"></span>
                                            </span>
                                            <ArrowUpRight size={18} className="text-indigo-600 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
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
