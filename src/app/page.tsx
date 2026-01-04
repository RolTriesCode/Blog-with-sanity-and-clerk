import { client } from "@/sanity/client";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { type SanityDocument } from "next-sanity";
import HeroImg from "@/components/images/herosectionimg.jpg"
import Image from "next/image"
import Link from "next/link";
import Screenshot from "@/components/images/screenshot.png"
import { ArrowRight, Sparkles, TrendingUp, Zap, Radio, Globe, ChevronRight } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { ProtectedLink } from "@/components/ProtectedLink";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

const options = { next: { revalidate: 30 } };

const CATEGORIES = [
    { name: "Technology", slug: "tech", icon: Zap, color: "bg-blue-500" },
    { name: "Lifestyle", slug: "lifestyle", icon: Sparkles, color: "bg-pink-500" },
    { name: "Education", slug: "education", icon: Globe, color: "bg-green-500" },
    { name: "News", slug: "news", icon: Radio, color: "bg-red-500" },
    { name: "Entertainment", slug: "entertainment", icon: TrendingUp, color: "bg-purple-500" },
];

export default async function IndexPage({
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

    const featuredPost = posts[0];
    const latestPosts = posts.slice(1, 4);

    return (
        <main className="min-h-screen bg-[#F8F8F8] dark:bg-gray-950 overflow-x-hidden ">
            {/* Hero Section */}
            <section className="relative  pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-[22px] overflow-hidden bg-gray-900 group">
                        <div className="absolute inset-0">
                            <Image
                                src={HeroImg}
                                alt="Hero"
                                fill
                                className="object-cover opacity-60"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        </div>

                        <div className="relative pt-16 pb-16 px-8 md:px-16 lg:py-34 max-w-4xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <Sparkles className="w-3 h-3 text-yellow-400" />
                                <p className="font-semibold">AI-Powered Insights</p>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-8">
                                Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Knowledge</span><br />
                                Meets Storytelling.
                            </h1>
                            <p className="text-sm md:text-base text-gray-300 max-w-2xl mb-10 leading-relaxed">
                                Dive into the latest in technology, lifestyle, and global trends.
                                Experience content redefined with the power of modern intelligence.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <ProtectedLink
                                    href="/posts"
                                    className="px-6 md:px-8 py-3.5 bg-white text-black rounded-full font-medium uppercase tracking-widest text-xs md:text-sm hover:bg-indigo-50 transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                >
                                    Explore Library
                                </ProtectedLink>
                                <SignedIn>
                                    <Link
                                        href="/create-post"
                                        className="px-6 md:px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium uppercase tracking-widest text-xs md:text-sm hover:bg-white/20 transition-all active:scale-95"
                                    >
                                        Share Story
                                    </Link>
                                </SignedIn>
                                <SignedOut>
                                    <ProtectedLink href="/">
                                        <button className="px-6 md:px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium uppercase tracking-widest text-xs md:text-sm hover:bg-white/20 transition-all active:scale-95">
                                            Get Started
                                        </button>
                                    </ProtectedLink>
                                </SignedOut>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            {featuredPost && (
                <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-0.5 w-12 md:w-24 bg-indigo-600 rounded-full" />
                        <h2 className="text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-gray-500">Editor&apos;s Pick</h2>
                    </div>

                    <ProtectedLink href={`/${featuredPost.slug.current}`} className="group relative grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white dark:bg-gray-900 rounded-[22px] p-6 lg:p-10 border border-gray-100 dark:border-gray-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]">
                        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto w-full h-[300px] lg:h-[500px] rounded-[22px] overflow-hidden shadow-xl">
                            {featuredPost.image ? (
                                <Image
                                    src={urlFor(featuredPost.image)?.width(1200).height(800).url() || ""}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                    <Zap className="w-20 h-20 text-indigo-200 dark:text-indigo-800" />
                                </div>
                            )}
                            <div className="absolute top-8 left-8">
                                <span className="px-5 py-2.5 bg-black/80 backdrop-blur-xl text-white text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] rounded-full">
                                    Featured
                                </span>
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
                            <div className="space-y-4">
                                <span className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-[0.2em]">
                                    {featuredPost.category || "General"}
                                </span>
                                <h3 className="text-3xl lg:text-5xl font-semibold text-gray-900 dark:text-white leading-[1.1] tracking-tight group-hover:text-indigo-600 transition-colors">
                                    {featuredPost.title}
                                </h3>
                                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                    Discover the inspiration behind this top-rated story and why readers are calling it a must-read of the month.
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-700 overflow-hidden">
                                        {featuredPost.author?.profileImage ? (
                                            <Image src={HeroImg} alt="" width={48} height={48} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">{featuredPost.author?.name}</p>
                                        <p className="text-xs md:text-sm text-gray-400">Chief Editor</p>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </ProtectedLink>
                </section>
            )}

            {/* Latest Grid */}
            <section className="py-20 bg-white/50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div className="space-y-2">
                            <h2 className="text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-indigo-600">The Feed</h2>
                            <h3 className="text-3xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight">Latest Stories</h3>
                        </div>
                        <ProtectedLink href="/posts" className="group flex items-center gap-2 text-xs md:text-sm font-medium uppercase tracking-widest text-gray-900 dark:text-white border-b-2 border-transparent hover:border-indigo-600 transition-all pb-1">
                            Browse All
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </ProtectedLink>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                        {latestPosts.map((post: any) => (
                            <div key={post._id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                                <PostCard post={post} showMeta />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Categories Explorer */}
            <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
                    <h2 className="text-xs md:text-sm font-medium uppercase tracking-[0.4em] text-indigo-600">Explore</h2>
                    <h3 className="text-3xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tighter">
                        Infinite Subjects.<br />Zero Boundaries.
                    </h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    {CATEGORIES.map((cat) => (
                        <ProtectedLink
                            key={cat.slug}
                            href={`/posts?categories=${cat.slug}`}
                            className="group relative h-64 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 flex flex-col justify-end overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-900"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 ${cat.color} opacity-5 blur-[40px] group-hover:opacity-20 transition-opacity duration-700`} />
                            <div className="space-y-4 relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                                <div className={`w-12 h-12 rounded-2xl ${cat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    <cat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-md md:text-lg font-medium text-gray-900 dark:text-white">{cat.name}</h4>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Explore</p>
                                </div>
                            </div>
                            <div className="absolute bottom-8 right-8 text-gray-300 dark:text-gray-800 opacity-0 group-hover:opacity-100 ease-in-out transition-all">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        </ProtectedLink>
                    ))}
                </div>
            </section>

            <SignedOut>
                {/* Newsletter / CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto px-10 py-20 bg-indigo-600 rounded-[4rem] text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700" />
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 transition-transform duration-[10s] group-hover:scale-110 pointer-events-none">
                            <Image src={Screenshot} alt="" fill className="object-cover" />
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
                                Build Your Legacy. <br />Join the Conversation.
                            </h2>
                            <p className="text-sm md:text-base text-indigo-100 leading-relaxed">
                                Sign up today and get exclusive access to premium content,
                                AI editing tools, and a global community of thinkers.
                            </p>
                            <ProtectedLink
                                href="/posts"
                                className="inline-flex items-center gap-3 px-6 md:px-8 py-3.5 bg-white text-indigo-600 rounded-full font-medium uppercase tracking-widest text-xs md:text-sm hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl"
                            >
                                Get Started
                            </ProtectedLink>
                        </div>
                    </div>
                </section>
            </SignedOut>


            {/* Footer */}
            <footer className="pt-32 pb-12 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-12">
                        <div className="lg:col-span-5 space-y-8">
                            <h2 className="text-3xl md:text-5xl font-semibold text-indigo-600 tracking-tighter">Blogify.</h2>
                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                                Redefining the future of digital content through the harmonic blend of AI and human storytelling.
                            </p>
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                            <div className="space-y-6">
                                <h4 className="text-xs md:text-sm font-semibold uppercase tracking-widest text-gray-900 dark:text-white">Product</h4>
                                <ul className="space-y-4 text-xs md:text-sm">
                                    <li><ProtectedLink href="/posts" className="text-gray-500 hover:text-indigo-600 transition-colors">Features</ProtectedLink></li>
                                    <li><ProtectedLink href="/posts" className="text-gray-500 hover:text-indigo-600 transition-colors">AI Edit</ProtectedLink></li>
                                    <li><ProtectedLink href="/posts" className="text-gray-500 hover:text-indigo-600 transition-colors">Showcase</ProtectedLink></li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-xs md:text-sm font-semibold uppercase tracking-widest text-gray-900 dark:text-white">Subjects</h4>
                                <ul className="space-y-4 text-xs md:text-sm">
                                    <li><ProtectedLink href="/posts?categories=tech" className="text-gray-500 hover:text-indigo-600 transition-colors">Tech</ProtectedLink></li>
                                    <li><ProtectedLink href="/posts?categories=lifestyle" className="text-gray-500 hover:text-indigo-600 transition-colors">Life</ProtectedLink></li>
                                    <li><ProtectedLink href="/posts?categories=education" className="text-gray-500 hover:text-indigo-600 transition-colors">Edu</ProtectedLink></li>
                                    <li><ProtectedLink href="/posts?categories=news" className="text-gray-500 hover:text-indigo-600 transition-colors">News</ProtectedLink></li>
                                    <li><ProtectedLink href="/posts?categories=entertainment" className="text-gray-500 hover:text-indigo-600 transition-colors">Entertainment</ProtectedLink></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                            © {new Date().getFullYear()} Errol Tabangen
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}