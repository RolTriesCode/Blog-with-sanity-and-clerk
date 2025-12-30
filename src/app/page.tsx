import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

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

import SearchInput from "@/components/SearchInput";

export default async function IndexPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query: searchTerm } = await searchParams;

  const searchQuery = searchTerm
    ? `*[_type == "post" && defined(slug.current) && (title match $searchTerm || body[].children[].text match $searchTerm)] | order(publishedAt desc)`
    : `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)`;

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
    <main className="container mx-auto min-h-screen max-w-4xl p-8">
      <SignedOut>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Our Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            Join our community to read and share amazing stories.
          </p>
          <SignInButton>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg h-14 px-10 cursor-pointer shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
              Start Reading
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            {searchTerm ? `Results for "${searchTerm}"` : "All Posts"}
          </h1>

          <SearchInput defaultValue={searchTerm} />
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                href={`/${post.slug.current}`}
                key={post._id}
                className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  {post.image ? (
                    <img
                      src={urlFor(post.image)?.width(600).height(400).url() || ""}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 capitalize">
                      {post.category || "Uncategorized"}
                    </span>
                    <p className="text-xs text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    {post.author?.profileImage ? (
                      <img
                        src={post.author.profileImage}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {post.author?.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="text-xs">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{post.author?.name || "Unknown Author"}</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              We couldn't find any posts matching "{searchTerm}".
            </p>
            <Link
              href="/"
              className="mt-6 inline-block text-indigo-600 font-semibold hover:underline"
            >
              Clear search
            </Link>
          </div>
        )}
      </SignedIn>
    </main>
  );
}