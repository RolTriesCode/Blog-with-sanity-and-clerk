"use server";

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIContent(category: string, title?: string) {
    if (!category) {
        throw new Error("Category is required");
    }

    const prompt = `Write a professional and engaging blog post content for the category: ${category}${title ? ` and the topic/title: "${title}"` : ""}. 
    The output should be the body of the blog post only. Use markdown for formatting if appropriate. 
    Format it so it's ready to be published. Do not include the title in the output if a title was provided.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a professional blog writer. You write high-quality, SEO-friendly blog content." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });

        return response.choices[0].message.content || "Failed to generate content.";
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate content with AI. Please check your API key and quota.");
    }
}
