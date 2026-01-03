import { client } from "@/sanity/client";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { type SanityDocument } from "next-sanity";
import Hero from "@/components/images/herosectionimg.jpg"
import Image from "next/image"
import Link from "next/link";
import AboutImg from "@/components/images/aboutBlogify.png"
import Tech from "@/components/images/tech.png"
import Lifestyle from "@/components/images/health.png"
import Study from "@/components/images/study.png"
import News from "@/components/images/news.png"
import Entertainment from "@/components/images/entertainment.png"
import Screenshot from "@/components/images/screenshot.png"
import { ArrowUpRight } from "lucide-react";

const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  image,
  "author": author-> {
    name,
    email,
    profileImage
  }
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;



const options = { next: { revalidate: 30 } };


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

    return (
        <main className="mx-auto max-w-7xl ">
            {/* Hero Section */}
            <section className="flex items-center justify-center w-[95%] mx-auto relative flex-col">
                <div className="relative w-full mx-auto">
                    <div className="relative">
                        <Image
                            src={Hero}
                            alt="Hero Image"
                            className="rounded-[22px] lg:h-[80vh] 2xl:h-[60vh] object-cover"
                        />

                        {/* Left dark overlay */}
                        <div className="absolute inset-0 rounded-[22px] bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                    </div>
                    <div className="md:absolute inset-0 flex items-center md:text-white">
                        <div className="flex flex-col items-start px-3 lg:px-20 max-w-4xl mt-8 md:mt-0">
                            <p className="text-[34px] lg:text-[64px] font-semibold leading-tight">
                                Creative <span className="bg-[#616161] px-6 py-1 rounded-[10px]">stories</span>
                            </p>

                            <p className="text-[15px] mt-4 max-w-lg">
                                Your go-to blog for technology, lifestyle, education, travel, and more—now enhanced with AI-generated insights.
                            </p>

                            <Link href="/posts" className="mt-6 px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-black lg:bg-white text-white lg:text-black text-[14px] md:text-[15px] font-medium">
                                Explore Blogs
                            </Link>
                        </div>
                    </div>


                </div>
                <div className="hidden relative bottom-10 bg-white w-[90%] h-20 md:flex items-center justify-center rounded-[12px] shadow-sm">
                    <h1 className="text-4xl font-bold text-center text-[14px]">Welcome to My Blog</h1>
                </div>
            </section>



            {/* Latest Posts Section */}
            <section className="w-[95%] lg:w-[90%] mx-auto px-3 lg:px-7 mt-20">
                <div>
                    <h1 className="text-[26px] lg:text-[36px] font-medium">
                        Latest Posts
                    </h1>
                    <div className="mt-6 gap-y-10 flex flex-row flex-wrap items-center justify-evenly lg:justify-between">
                        {posts.slice(0, 4).map((post) => (
                            <div key={post._id} className="w-fit">
                                <div className="h-[252.19px] w-[252.19px] aspect-square rounded-[12px] overflow-hidden group cursor-pointer">
                                    <Link href={`/${post.slug.current}`}>
                                        {post.image ? (
                                            <Image
                                                src={urlFor(post.image)?.url() || Hero}
                                                alt={post.title}
                                                width={252}
                                                height={252}
                                                className="border object-cover h-full w-full group-hover:scale-105 transition-all duration-300"
                                            />
                                        ) : (
                                            <Image src={Hero} alt="Default placeholder" className="border object-cover h-full w-full group-hover:scale-105 transition-all duration-300" />
                                        )}
                                    </Link>
                                </div>
                                <p className="mt-2 text-[14px] md:text-[15px] font-medium">{post.title}</p>
                                <Link href={`/${post.slug.current}`} className="text-[14px] md:text-[15px] text-[#454545] flex items-center gap-1 group underline">
                                    Read More
                                    <ArrowUpRight size={14} className="group-hover:rotate-45 transition-all ease-in-out duration-300" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <SignedOut>



                {/* About Section */}
                <section className="flex items-center justify-center mt-30 w-[95%] bg-white rounded-[22px] mx-auto relative flex-row flex-wrap py-15 px-10 md:p-15">
                    <div className="lg:w-[43%] lg:h-[422px] mb-20 lg:mb-0">
                        <p className="lg:text-[15px] text-[14px] font-medium mb-2">
                            About Blogify
                        </p>
                        <p className="text-[34px] md:text-[48px] font-medium leading-[1.2]">
                            Epic Headlines, <br />Always Fresh, <br />Always Here
                        </p>
                        <p className="text-[14px] md:text-[15px] mt-2 mb-10 lg:pr-20">
                            We bring you the latest insights, tips, and trends across technology, education, fitness, news, and entertainment.
                        </p>
                        <Link href="/posts" className="md:px-6 md:py-2.5 px-4 py-2 rounded-full bg-black text-white text-[14px] md:text-[15px] font-medium">
                            Explore Blogs
                        </Link>
                    </div>

                    <div className="flex md:flex-row justify-center lg:w-[57%] flex-wrap md:flex-nowrap">
                        <Image src={AboutImg} alt="" className="w-[264px] h-[422px] object-cover rounded-[8px] mb-4 md:mb-0" />
                        <div>
                            <p className="lg:text-[15px] text-[14px] md:pl-10 w-fit">
                                From tech breakthroughs to fitness tips, and from education guides to the latest in news and entertainment, we cover it all. Our mission is to make learning, staying informed, and having fun simple and enjoyable for everyone.
                            </p>
                        </div>
                    </div>
                </section>

            </SignedOut>
            {/* Category Section */}
            <section className="flex w-[90%] mx-auto  px-3 lg:px-7 flex-wrap-reverse my-30">
                <div className="flex flex-row flex-wrap items-center justify-evenly lg:w-[70%] mx-auto gap-4">

                    <div className="w-fit">
                        <div className="group overflow-hidden w-[130px] aspect-square rounded-[8px]">
                            <Link href="/posts?categories=tech">
                                <Image src={Tech} alt="" className="group-hover:scale-105 transition-all duration-300 ease-in-out" />
                            </Link>
                        </div>
                        <p className="text-[14px] md:text-[15px] font-medium mt-1">Technology</p>
                    </div>

                    <div className="w-fit">
                        <div className="group overflow-hidden w-[130px] aspect-square rounded-[8px]">
                            <Link href="/posts?categories=lifestyle">
                                <Image src={Lifestyle} alt="" className="group-hover:scale-105 transition-all duration-300 ease-in-out" />
                            </Link>
                        </div>
                        <p className="text-[14px] md:text-[15px] font-medium mt-1">Lifestyle</p>
                    </div>

                    <div className="w-fit">
                        <div className="group overflow-hidden w-[130px] aspect-square rounded-[8px]">
                            <Link href="/posts?categories=entertainment">
                                <Image src={Entertainment} alt="" className="group-hover:scale-105 transition-all duration-300 ease-in-out" />
                            </Link>
                        </div>
                        <p className="text-[14px] md:text-[15px] font-medium mt-1">Entertainment</p>
                    </div>

                    <div className="w-fit">
                        <div className="group overflow-hidden w-[130px] aspect-square rounded-[8px]">
                            <Link href="/posts?categories=education">
                                <Image src={Study} alt="" className="group-hover:scale-105 transition-all duration-300 ease-in-out" />
                            </Link>
                        </div>
                        <p className="text-[14px] md:text-[15px] font-medium mt-1">Education</p>
                    </div>

                    <div className="w-fit">
                        <div className="group overflow-hidden w-[130px] aspect-square rounded-[8px]">
                            <Link href="/posts?categories=news">
                                <Image src={News} alt="" className="group-hover:scale-105 transition-all duration-300 ease-in-out" />
                            </Link>
                        </div>
                        <p className="text-[14px] md:text-[15px] font-medium mt-1">News</p>
                    </div>


                </div>

                <div className="lg:w-[30%] mx-auto lg:pl-8 mb-8 lg:mb-0">
                    <p className="lg:text-[15px] text-[14px] font-medium mb-2">
                        Categories
                    </p>
                    <h1 className="md:text-[36px] text-[26px] font-medium leading-[1.2]">
                        United Readers,<br />Limitless Stories
                    </h1>
                </div>
            </section>

            <div className="relative">
                <SignedOut>
                    <section className="relative z-10 -mb-20">
                        <div className="bg-black text-white rounded-[22px] w-[80%] mx-auto flex flex-row items-center justify-center">
                            <div className="p-5 lg:px-15 gap-10 flex flex-col">
                                <h1 className="md:text-[36px] text-[26px] font-medium leading-[1.2] lg:w-[85%]">
                                    What Do You Want to Read Today? Sign In to Create and Read Posts
                                </h1>
                                <Link
                                    href="/sign-in"
                                    className="md:px-6 md:py-2.5 px-4 py-2 rounded-full bg-white text-black text-[14px] md:text-[15px] font-medium w-fit"
                                >
                                    Get Started
                                </Link>
                            </div>

                            <div className="h-fit hidden md:block">
                                <Image
                                    src={Screenshot}
                                    alt=""
                                    className="border h-[291px] object-cover rounded-tl-[99px] rounded-r-[22px]"
                                />
                            </div>
                        </div>
                    </section>
                </SignedOut>

                <footer className="w-full bg-white border-t-2 border-black h-[342px]">
                    <div className=" pt-30 px-10 lg:px-32 flex flex-row justify-between">
                        <div>
                            <h1 className="md:text-[36px] text-[26px] font-medium leading-[1.2]">
                                Blogify
                            </h1>
                            <p className="text-[14px] md:text-[15px] font-medium mt-1">
                                Create, Read, and Share <br /> Stories with the World
                            </p>
                        </div>
                        <div className="flex flex-row lg:gap-20">
                            <div>
                                <p className="text-[14px] md:text-[15px] font-medium">
                                    Categories
                                </p>
                                <ul className="gap-1 flex flex-col text-[#454545]">
                                    <li className="text-[13px] md:text-[14px]">
                                        <Link href="/posts?categories=tech">Technology</Link>
                                    </li>
                                    <li className="text-[13px] md:text-[14px]">
                                        <Link href="/posts?categories=lifestyle">Lifestyle</Link>
                                    </li>
                                    <li className="text-[13px] md:text-[14px]">
                                        <Link href="/posts?categories=entertainment">Entertainment</Link>
                                    </li>
                                    <li className="text-[13px] md:text-[14px]">
                                        <Link href="/posts?categories=education">Education</Link>
                                    </li>
                                    <li className="text-[13px] md:text-[14px]">
                                        <Link href="/posts?categories=news">News</Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <p className="text-[14px] md:text-[15px] font-medium">
                                    Resources
                                </p>
                                <ul className="gap-1 flex flex-col text-[#454545]">
                                    <li className="text-[13px] md:text-[14px]">
                                        <Link href="/posts">Posts</Link>
                                    </li>
                                    <li className="text-[13px] md:text-[14px]">
                                        <Link href="/">About</Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-1 bg-black text-white flex items-center justify-center">
                        <p className="text-[12px] md:text-[14px] text-white">© {new Date().getFullYear()} Errol Tabangen, All rights reserved.</p>
                    </div>
                </footer>
            </div>

        </main>
    );
}