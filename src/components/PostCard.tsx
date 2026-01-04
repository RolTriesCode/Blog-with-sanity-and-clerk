
import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { DefaultPlaceholder } from "./DefaultPlaceholder";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

interface PostCardProps {
    post: {
        _id: string;
        title: string;
        slug: { current: string };
        category?: string;
        image?: any;
        publishedAt?: string;
        author?: {
            name?: string;
        };
    };
    showMeta?: boolean;
}

export function PostCard({ post, showMeta = false }: PostCardProps) {
    const cardContent = (
        <>
            <div className="relative aspect-[16/11] rounded-[15px] overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800 shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                {post.image ? (
                    <Image
                        src={urlFor(post.image)?.width(600).height(400).url() || ""}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                ) : (
                    <DefaultPlaceholder title={post.category} className="opacity-50 scale-90" />
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-medium bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white uppercase tracking-widest shadow-sm">
                        {post.category || "Article"}
                    </span>
                </div>
            </div>

            {showMeta && post.publishedAt && (
                <div className="flex items-center gap-4 text-[10px] font-medium text-gray-500 uppercase mb-1 tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {post.author?.name && (
                        <div className="flex items-center gap-1.5 font-medium text-gray-500">
                            <User size={12} />
                            <span>{post.author.name}</span>
                        </div>
                    )}
                </div>
            )}

            <h3 className="text-md md:text-lg lg:text-xl whitespace-nowrap overflow-hidden font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors duration-300 whitespace-nowrap overflow-hidden">
                {post.title}
            </h3>
            {!showMeta && (
                <div className="flex items-center gap-2 opacity-60">
                    <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-gray-500">By {post.author?.name || "Unknown"}</span>
                </div>
            )}
        </>
    );

    return (
        <>
            <SignedIn>
                <Link href={`/${post.slug.current}`} className="group block">
                    {cardContent}
                </Link>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl={`/${post.slug.current}`}>
                    <div className="group block cursor-pointer">
                        {cardContent}
                    </div>
                </SignInButton>
            </SignedOut>
        </>
    );
}
