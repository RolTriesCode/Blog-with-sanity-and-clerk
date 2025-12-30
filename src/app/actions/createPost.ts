"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "next-sanity";

const writeClient = createClient({
    projectId: "sxgnyuor",
    dataset: "production",
    token: process.env.SANITY_API_WRITE_TOKEN, // Use a write token here
    useCdn: false,
    apiVersion: "2024-01-01",
});

async function getOrCreateAuthor(clerkUser: any) {
    // Check if author already exists in Sanity
    const query = `*[_type == "author" && clerkId == $clerkId][0]`;
    const existingAuthor = await writeClient.fetch(query, { clerkId: clerkUser.id });

    if (existingAuthor) return existingAuthor._id;

    // Otherwise, create the author document
    const newAuthor = await writeClient.create({
        _type: "author",
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        email: clerkUser.emailAddresses[0].emailAddress,
        profileImage: clerkUser.imageUrl,
    });

    return newAuthor._id;
}

export async function createPost(formData: FormData) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("You must be logged in to create a post.");
    }

    const title = formData.get("title") as string;
    const bodyText = formData.get("body") as string;
    const imageFile = formData.get("image") as File;
    const slug = title.toLowerCase().replace(/ /g, "-");

    // 1. Get or Create the Author in Sanity
    const authorId = await getOrCreateAuthor(user);

    // 2. Upload image if present
    let imageAsset;
    if (imageFile && imageFile.size > 0) {
        imageAsset = await writeClient.assets.upload("image", imageFile, {
            filename: imageFile.name,
        });
    }

    // 3. Create the Post with a reference to the Author
    const post = await writeClient.create({
        _type: "post",
        title: title,
        slug: { _type: "slug", current: slug },
        author: {
            _type: "reference",
            _ref: authorId,
        },
        publishedAt: new Date().toISOString(),
        image: imageAsset
            ? {
                _type: "image",
                asset: {
                    _type: "reference",
                    _ref: imageAsset._id,
                },
            }
            : undefined,
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
    });

    return post;
}