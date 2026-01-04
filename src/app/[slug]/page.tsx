import { client } from "@/sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { ArrowRight, Bookmark, Calendar, Share2, User } from "lucide-react";
import { PortableText, type SanityDocument } from "next-sanity";
import Link from "next/link";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  ...,
  "author": author-> {
    name,
    profileImage
  }
}`;

const RELATED_POSTS_QUERY = `*[_type == "post" && category == $category && _id != $currentId][0...3]{
  _id,
  title,
  slug,
  image,
  category,
  publishedAt,
  "author": author-> {
    name,
    profileImage
  }
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

const options = { next: { revalidate: 30 } };

import { DefaultPlaceholder } from "@/components/DefaultPlaceholder";
import { PostCard } from "@/components/PostCard";

export default async function PostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await client.fetch<SanityDocument>(POST_QUERY, { slug }, options);

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center text-zinc-900 dark:text-zinc-100">
                <h2 className="text-2xl font-bold mb-2">Post not found</h2>
                <p className="opacity-60 mb-6">The article you're looking for doesn't exist or has been moved.</p>
                <Link href="/" className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors">
                    Back to Home
                </Link>
            </div>
        );
    }

    const relatedPosts = post.category
        ? await client.fetch<SanityDocument[]>(RELATED_POSTS_QUERY, {
            category: post.category,
            currentId: post._id
        }, options)
        : [];

    const postImageUrl = post.image
        ? urlFor(post.image)?.width(1200).height(600).url()
        : null;

    return (
        <main className="min-h-screen">

            {/* Content Container */}
            <div className="relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
                {/* Main Image Layer */}
                <section className="max-w-7xl mx-auto pt-8 mb-8 px-6">
                    <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden shadow-md rounded-md ring-1 ring-black/5 dark:ring-white/5 group">
                        {postImageUrl ? (
                            <img
                                src={postImageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <DefaultPlaceholder title={post.category} />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                </section>
                <header className="relative pb-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Meta Category & Date */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="px-3 py-1 rounded-lg text-xs md:text-sm font-semibold bg-indigo-600 text-white uppercase tracking-widest shadow-md shadow-indigo-600/20">
                                {post.category || "General"}
                            </span>
                            <div className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <time>
                                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </time>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-10 leading-[1.05] tracking-tight">
                            {post.title}
                        </h1>

                        {/* Author section */}
                        <div className="flex items-center justify-between pb-10 border-b border-gray-100 dark:border-gray-800/50">
                            <div className="flex items-center gap-4">
                                {post.author?.profileImage ? (
                                    <div className="relative">
                                        <img
                                            src={post.author.profileImage}
                                            alt={post.author.name}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-md overflow-hidden"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shadow-inner">
                                        <User className="w-7 h-7" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white leading-none mb-1">
                                        {post.author?.name || "Anonymous Author"}
                                    </p>
                                    <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Featured Writer</p>
                                </div>
                            </div>

                            <div className="hidden sm:flex items-center gap-3">
                                <button className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 hover:shadow-lg transition-all">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 hover:shadow-lg transition-all">
                                    <Bookmark className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>



                {/* Article Content */}
                <article className="max-w-3xl mx-auto px-6 pb-24">
                    <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
                        prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                        prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-3xl prose-img:shadow-2xl prose-blockquote:border-l-4 prose-blockquote:border-l-indigo-600
                        prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-500/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:text-indigo-900 dark:prose-blockquote:text-indigo-100
                        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-black">
                        {Array.isArray(post.body) && <PortableText value={post.body} />}
                    </div>
                </article>

                {/* Related Posts Section */}
                {relatedPosts.length > 0 && (
                    <section className="py-32 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800/50">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="flex items-end justify-between mb-16">
                                <div className="space-y-2">
                                    <h2 className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">More to Read</h2>
                                    <h3 className="text-3xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight">
                                        Stories in <span className="text-indigo-600 uppercase">{post.category || "General"}</span>
                                    </h3>
                                </div>
                                <Link
                                    href="/posts"
                                    className="group hidden sm:flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-widest text-gray-900 dark:text-white border-b-2 border-transparent hover:border-indigo-600 transition-all pb-1"
                                >
                                    Browse All
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                                {relatedPosts.map((related: any) => (
                                    <div key={related._id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                                        <PostCard post={related} showMeta />
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/posts"
                                className="sm:hidden flex items-center justify-center gap-3 mt-16 px-10 py-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white shadow-xl"
                            >
                                Explore all stories
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

