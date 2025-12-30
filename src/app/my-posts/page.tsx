import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { deletePost } from "@/app/actions/deletePost";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

const USER_POSTS_QUERY = `*[_type == "post" && author->clerkId == $clerkId] | order(publishedAt desc) {
  _id,
  title,
  slug,
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <SignedIn>
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Posts</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your published stories</p>
                        </div>
                        <Link
                            href="/create-post"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                        >
                            Create New Post
                        </Link>
                    </div>

                    {posts.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-800">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No posts yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't shared any stories with the community.</p>
                            <Link
                                href="/create-post"
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Write your first post
                                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow duration-200"
                                >
                                    {post.image ? (
                                        <div className="sm:w-48 h-48 sm:h-auto relative flex-shrink-0">
                                            <img
                                                src={urlFor(post.image)?.width(400).height(400).url() || ""}
                                                alt={post.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="sm:w-48 h-48 sm:h-auto bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col justify-between flex-grow">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                                                    {post.title}
                                                </h2>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                                    {new Date(post.publishedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                By {post.author?.name}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-6">
                                            <Link
                                                href={`/edit-post/${post._id}`}
                                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-md transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <form action={handleDelete.bind(null, post._id)}>
                                                <button
                                                    type="submit"
                                                    className="text-sm font-semibold text-red-600 hover:text-red-500 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-md transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </form>
                                            <Link
                                                href={`/${post.slug.current}`}
                                                className="text-sm font-semibold text-gray-600 hover:text-gray-500 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-md transition-colors ml-auto"
                                            >
                                                View Post
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
