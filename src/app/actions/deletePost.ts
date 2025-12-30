"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";

const writeClient = createClient({
    projectId: "sxgnyuor",
    dataset: "production",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
    apiVersion: "2024-01-01",
});

export async function deletePost(postId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("You must be logged in to delete a post.");
    }

    // Fetch the post to verify ownership
    const post = await writeClient.fetch(`*[_type == "post" && _id == $postId][0]{
        "clerkId": author->clerkId
    }`, { postId });

    if (!post) {
        throw new Error("Post not found.");
    }

    if (post.clerkId !== userId) {
        throw new Error("You are not authorized to delete this post.");
    }

    // Delete the post
    await writeClient.delete(postId);

    revalidatePath("/my-posts");
    revalidatePath("/");

    return { success: true };
}
