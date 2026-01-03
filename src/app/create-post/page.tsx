"use client";

import { createPost } from "@/app/actions/createPost";
import { generateAIContent } from "@/app/actions/generateAIContent";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export default function CreatePostPage() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [body, setBody] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    async function handleGenerateAI() {
        if (!category) {
            alert("Please select a category first.");
            return;
        }

        setIsGenerating(true);
        try {
            const content = await generateAIContent(category, title);
            setBody(content);
        } catch (error) {
            console.error(error);
            alert("Failed to generate content. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleSubmit(formData: FormData) {
        const post = await createPost(formData);
        router.push(`/${post.slug.current}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <SignedIn>
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <div className="px-8 py-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
                            Create a New Post
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                            Share your thoughts with the community.
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
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter a catchy title..."
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
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none cursor-pointer appearance-none"
                                >
                                    <option value="" disabled>Select a category</option>
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
                                    Cover Image
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                            <label
                                                htmlFor="image"
                                                className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="image"
                                                    name="image"
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label
                                        htmlFor="body"
                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Content
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleGenerateAI}
                                        disabled={isGenerating || !category}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-3 h-3" />
                                                Generate with AI
                                            </>
                                        )}
                                    </button>
                                </div>
                                <textarea
                                    name="body"
                                    id="body"
                                    rows={8}
                                    required
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Write your story here..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none resize-none"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-1 active:scale-[0.98]"
                                >
                                    Publish Post
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

