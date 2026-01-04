"use client";

import { createPost } from "@/app/actions/createPost";
import { generateAIContent } from "@/app/actions/generateAIContent";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useState, useRef, ChangeEvent } from "react";
import { Sparkles, Loader2, Image as ImageIcon, X, Send, ArrowLeft, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function CreatePostPage() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [body, setBody] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            const post = await createPost(formData);
            router.push(`/${post.slug.current}`);
        } catch (error) {
            console.error(error);
            alert("Failed to create post. Please try again.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F8F8] dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <SignedIn>
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                            {/* Main Content Area */}
                            <div className="lg:col-span-8 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800">
                                <form action={handleSubmit} className="space-y-8">
                                    <div className="space-y-2">
                                        <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight">
                                            New Story
                                        </h1>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                                            Craft your next masterpiece.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="group">
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Enter your title..."
                                                className="w-full text-2xl md:text-4xl p-2 font-medium bg-transparent border-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white p-0 transition-all"
                                            />
                                            <div className="h-0.5 w-0 group-focus-within:w-full bg-indigo-500 transition-all duration-500 mt-2" />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label
                                                    htmlFor="body"
                                                    className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
                                                >
                                                    Content
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleGenerateAI}
                                                    disabled={isGenerating || !category}
                                                    className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isGenerating ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="w-4 h-4" />
                                                            AI Assist
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <textarea
                                                name="body"
                                                id="body"
                                                rows={12}
                                                required
                                                value={body}
                                                onChange={(e) => setBody(e.target.value)}
                                                placeholder="Start writing your story..."
                                                className="w-full text-sm md:text-base p-2 leading-relaxed bg-transparent border-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-700 text-gray-800 dark:text-gray-200 resize-none min-h-[300px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="hidden">
                                        {/* Hidden inputs to make sure formData has everything if we use a split layout */}
                                        <input type="hidden" name="category" value={category} />
                                    </div>
                                </form>
                            </div>

                            {/* Sidebar / Settings Area */}
                            <div className="lg:col-span-4 bg-gray-50/50 dark:bg-gray-800/30 p-8 lg:p-10 space-y-10">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                            Publication Details
                                        </label>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <select
                                                    name="category"
                                                    id="category_sidebar"
                                                    required
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-[12px] text-sm md:text-base border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer font-medium"
                                                >
                                                    <option value="" disabled>Choose Category</option>
                                                    <option value="tech">Technology</option>
                                                    <option value="lifestyle">Lifestyle</option>
                                                    <option value="education">Education</option>
                                                    <option value="news">News</option>
                                                    <option value="entertainment">Entertainment</option>

                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                            Cover Image
                                        </label>

                                        {!imagePreview ? (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 hover:border-indigo-500 dark:hover:border-indigo-400 hover:scale-[1.02] transition-all cursor-pointer"
                                            >
                                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                                    <UploadCloud className="w-6 h-6" />
                                                </div>
                                                <p className="mt-4 text-sm md:text-base font-semibold text-gray-900 dark:text-white">Upload Image</p>
                                                <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center">
                                                    High resolution images work best
                                                </p>
                                                <input
                                                    ref={fileInputRef}
                                                    id="image"
                                                    name="image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl aspect-video">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all font-bold"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-4 left-4">
                                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                                                        Preview Mode
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        formAction={(data) => {
                                            // Since the form is in the main area but button is in sidebar
                                            // we can use the formAction prop or just wrap the whole thing.
                                            // Here I'll use a trick: the button is inside the parent div which will contain the form
                                            // actually it's better to just use a regular button and call the action if it's a client component.
                                        }}
                                        onClick={() => {
                                            const formData = new FormData();
                                            formData.set('title', title);
                                            formData.set('body', body);
                                            formData.set('category', category);
                                            if (fileInputRef.current?.files?.[0]) {
                                                formData.set('image', fileInputRef.current.files[0]);
                                            }
                                            handleSubmit(formData);
                                        }}
                                        disabled={isSubmitting || !title || !body || !category}
                                        className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-black py-5 px-6 rounded-[12px] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.5)] transition-all duration-300 active:scale-95 disabled:shadow-none overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        {isSubmitting ? (
                                            <>
                                                <span>Publishing...</span>
                                                <Loader2 className="w-6 h-6 animate-spin" />

                                            </>
                                        ) : (
                                            <>
                                                <span className="uppercase font-semibold tracking-widest text-sm md:text-base">Publish Story</span>
                                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <p className="mt-4 text-[10px] text-center text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-widest leading-relaxed">
                                        By publishing, you agree to our<br />terms of service and privacy policy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>
    );
}

