"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";

const writeClient = createClient({
    projectId: "sxgnyuor",
    dataset: "production",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
    apiVersion: "2024-01-01",
});

export async function updatePost(postId: string, formData: FormData) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("You must be logged in to update a post.");
    }

    // Verify ownership
    const existingPost = await writeClient.fetch(`*[_type == "post" && _id == $postId][0]{
        "clerkId": author->clerkId
    }`, { postId });

    if (!existingPost) {
        throw new Error("Post not found.");
    }

    if (existingPost.clerkId !== userId) {
        throw new Error("You are not authorized to update this post.");
    }

    const title = formData.get("title") as string;
    const bodyText = formData.get("body") as string;
    const imageFile = formData.get("image") as File;
    const slug = title.toLowerCase().replace(/ /g, "-");

    let patchData: any = {
        title: title,
        slug: { _type: "slug", current: slug },
        body: [
            {
                _type: "block",
                _key: Math.random().toString(36).substring(7),
                children: [
                    {
                        _type: "span",
                        _key: Math.random().toString(36).substring(7),
                        text: bodyText,
                    },
                ],
                markDefs: [],
                style: "normal",
            },
        ],
    };

    // Upload image if present
    if (imageFile && imageFile.size > 0) {
        const imageAsset = await writeClient.assets.upload("image", imageFile, {
            filename: imageFile.name,
        });
        patchData.image = {
            _type: "image",
            asset: {
                _type: "reference",
                _ref: imageAsset._id,
            },
        };
    }

    const updatedPost = await writeClient
        .patch(postId)
        .set(patchData)
        .commit();

    revalidatePath("/my-posts");
    revalidatePath(`/${slug}`);
    revalidatePath("/");

    return updatedPost;
}
