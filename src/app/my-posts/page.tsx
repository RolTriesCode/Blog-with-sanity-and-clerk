import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { deletePost } from "@/app/actions/deletePost";
import {
    Plus,
    Trash2,
    Edit3,
    ExternalLink,
    FileText,
    Calendar,
    Tag,
    ChevronRight,
    Search
} from "lucide-react";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

const USER_POSTS_QUERY = `*[_type == "post" && author->clerkId == $clerkId] | order(publishedAt desc) {
  _id,
  title,
  slug,
  category,
  publishedAt,
  image,
  "author": author-> {
    name,
    email
  }
}`;

export default async function MyPostsPage() {
    const { userId } = await auth();

    if (!userId) {
        return <RedirectToSignIn />;
    }

    const posts = await client.fetch<SanityDocument[]>(USER_POSTS_QUERY, { clerkId: userId });

    async function handleDelete(postId: string) {
        "use server";
        await deletePost(postId);
    }

    return (
        <div className="min-h-screen dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <SignedIn>
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-200 dark:border-gray-800">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight">
                                My Stories
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium">
                                Manage and track your published content.
                            </p>
                        </div>
                        <Link
                            href="/create-post"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-medium duration-300 ease-in-out uppercase tracking-widest text-xs md:text-sm transition-all shadow-[0_20px_40px_rgba(79,70,229,0.2)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Write New Post
                        </Link>
                    </div>

                    {posts.length === 0 ? (
                        <div className="relative group bg-white dark:bg-gray-900 rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative space-y-6">
                                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110">
                                    <FileText className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Your library is empty</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                        The world is waiting for your story. Start writing today and inspire thousands.
                                    </p>
                                </div>
                                <Link
                                    href="/create-post"
                                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs group/link"
                                >
                                    Begin your first masterpiece
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="group relative bg-white dark:bg-gray-900 rounded-[22px] border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
                                >
                                    {/* Link overlay for the whole card area except buttons */}
                                    <Link
                                        href={`/${post.slug.current}`}
                                        className="absolute inset-0 z-0"
                                    />

                                    <div className="md:w-72 h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                                        {post.image ? (
                                            <img
                                                src={urlFor(post.image)?.width(600).height(600).url() || ""}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/20 flex flex-col items-center justify-center p-8 space-y-3">
                                                <FileText className="w-12 h-12 text-indigo-200 dark:text-indigo-800" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 dark:text-indigo-700">No Cover</span>
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6 z-10">
                                            <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white shadow-lg border border-white/20">
                                                {post.category || "Article"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 md:p-10 flex flex-col justify-between flex-grow relative z-10">
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-3.5 h-3.5" />
                                                    {post.category}
                                                </div>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 selection:bg-indigo-100">
                                                {post.title}
                                            </h2>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                            <Link
                                                href={`/edit-post/${post._id}`}
                                                className="relative z-20 inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all active:scale-95"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                Edit
                                            </Link>

                                            <form action={handleDelete.bind(null, post._id)} className="relative z-20">
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all active:scale-95"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </button>
                                            </form>

                                            <Link
                                                href={`/${post.slug.current}`}
                                                className="relative z-20 ml-auto inline-flex items-center gap-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-xs font-semibold uppercase tracking-widest group/btn"
                                            >
                                                View Live
                                                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>
    );
}
