import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
    baseURL: 'https://llama8b.gaia.domains/v1',
    apiKey: '' // Leave this empty when using Gaia
});

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        const completion = await client.chat.completions.create({
            model: "llama",
            messages: [
                { role: "system", content: "You are a seasoned social media expert. You understand how to write good social media replies to drive engagement." },
                { role: "user", content: `Generate a witty, engaging, and thoughtful comment for: "${text}"` },
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const comment = completion.choices[0].message.content || 'No comment generated.';
        return NextResponse.json({ comment });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error generating comment' }, { status: 500 });
    }
}