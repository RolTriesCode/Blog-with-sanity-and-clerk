import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import EditPostForm from "@/components/EditPostForm";

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
            "imageUrl": image.asset->url,
            "clerkId": author->clerkId
        }`,
        { id }
    );

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] dark:bg-gray-950">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-opacity duration-300">
                        Post not found
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        The story you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    if (post.clerkId !== userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] dark:bg-gray-950">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-red-600">Unauthorized</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        You don't have permission to edit this story.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F8F8] dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <EditPostForm post={post as any} />
        </div>
    );
}
