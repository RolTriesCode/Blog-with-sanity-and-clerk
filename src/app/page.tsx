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

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(query, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">

      <SignedOut>
        <SignInButton>
          <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>


        <h1 className="text-4xl font-bold mb-8">ALL Posts</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              href={`/${post.slug.current}`}
              key={post._id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col gap-3"
            >
              {post.image && (
                <img
                  src={urlFor(post.image)?.width(550).height(310).url() || ""}
                  alt={post.title}
                  className="aspect-video rounded-xl object-cover"
                  width="550"
                  height="310"
                />
              )}
              {/* Author image and info */}
              <div className="flex items-center gap-3">
                {post.author?.profileImage && (
                  <img
                    src={post.author.profileImage}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{post.author?.name || "Unknown Author"}</p>
                  <p className="text-xs text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Post title */}
              <h2 className="text-lg font-semibold">{post.title}</h2>
            </Link>
          ))}
        </div>




      </SignedIn>
    </main>
  );
}