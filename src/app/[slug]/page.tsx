import { PortableText, type SanityDocument } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
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

export default async function PostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);

    if (!post) {
        return <div className="p-8 text-center">Post not found.</div>;
    }

    const relatedPosts = post.category
        ? await client.fetch<SanityDocument[]>(RELATED_POSTS_QUERY, {
            category: post.category,
            currentId: post._id
        }, options)
        : [];

    const postImageUrl = post.image
        ? urlFor(post.image)?.width(800).height(450).url()
        : null;

    return (
        <main className="container mx-auto min-h-screen max-w-4xl p-8 flex flex-col gap-8">
            <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to all posts
            </Link>

            <article className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl">
                {postImageUrl && (
                    <img
                        src={postImageUrl}
                        alt={post.title}
                        className="w-full aspect-[21/9] object-cover"
                    />
                )}

                <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                            {post.category || "Uncategorized"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <time className="text-sm text-gray-500">
                            {new Date(post.publishedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 mb-10 w-fit">
                        {post.author?.profileImage && (
                            <img
                                src={post.author.profileImage}
                                alt={post.author.name}
                                className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                            />
                        )}
                        <div>
                            <p className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                {post.author?.name || "Unknown Author"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">Author</p>
                        </div>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none prose-indigo prose-img:rounded-2xl">
                        {Array.isArray(post.body) && <PortableText value={post.body} />}
                    </div>
                </div>
            </article>

            {relatedPosts.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900  mb-8 flex items-center gap-3">
                        <span className="w-8 h-1 bg-indigo-600 rounded-full"></span>
                        Related Stories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedPosts.map((related) => (
                            <Link
                                key={related._id}
                                href={`/${related.slug.current}`}
                                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
                            >
                                <div className="aspect-video relative overflow-hidden rounded-t-2xl">
                                    {related.image ? (
                                        <img
                                            src={urlFor(related.image)?.width(400).height(225).url() || ""}
                                            alt={related.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                        {related.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
