import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { updatePost } from "@/app/actions/updatePost";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
        return <RedirectToSignIn />;
    }

    const post = await client.fetch<SanityDocument>(
        `*[_type == "post" && _id == $id][0]{
            _id,
            title,
            category,
            "body": body[0].children[0].text,
            "clerkId": author->clerkId
        }`,
        { id }
    );

    if (!post) {
        return <div className="p-8 text-center">Post not found.</div>;
    }

    if (post.clerkId !== userId) {
        return <div className="p-8 text-center">You are not authorized to edit this post.</div>;
    }

    async function handleSubmit(formData: FormData) {
        "use server";
        const updatedPost = await updatePost(id, formData);
        redirect(`/${updatedPost.slug.current}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <SignedIn>
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <div className="px-8 py-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
                            Edit Post
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                            Make changes to your story.
                        </p>

                        <form action={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Post Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    required
                                    defaultValue={post.title}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Category
                                </label>
                                <select
                                    name="category"
                                    id="category"
                                    required
                                    defaultValue={post.category}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none cursor-pointer appearance-none"
                                >
                                    <option value="tech">Technology</option>
                                    <option value="lifestyle">Lifestyle</option>
                                    <option value="education">Education</option>
                                    <option value="news">News</option>
                                    <option value="health">Health</option>
                                    <option value="travel">Travel</option>
                                    <option value="food">Food</option>
                                    <option value="finance">Finance</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="sports">Sports</option>
                                    <option value="science">Science</option>
                                    <option value="art">Art</option>
                                    <option value="opinion">Opinion</option>
                                    <option value="diy">DIY</option>
                                    <option value="culture">Culture</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="image"
                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    New Cover Image (Leave blank to keep current)
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    accept="image/*"
                                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 hover:file:bg-indigo-100 transition-all cursor-pointer"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="body"
                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Content
                                </label>
                                <textarea
                                    name="body"
                                    id="body"
                                    rows={8}
                                    required
                                    defaultValue={post.body}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Link
                                    href="/my-posts"
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-4 px-6 rounded-xl text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-1 active:scale-[0.98]"
                                >
                                    Update Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>
    );
}
