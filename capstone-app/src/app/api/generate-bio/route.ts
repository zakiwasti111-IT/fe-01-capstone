import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const RequestSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  interests: z.string().optional().default(""),
  tone: z.enum(["professional", "friendly", "concise"]).default("professional"),
});

const ResponseSchema = z.object({
  bio: z.string().min(1),
  source: z.enum(["ai", "fallback"]),
});

function fallbackBio(input: z.infer<typeof RequestSchema>) {
  const interests = input.interests.trim();
  const interestsPart = interests ? ` Interested in ${interests}.` : "";
  return `${input.name} is a ${input.role}.${interestsPart}`.trim();
}

export async function POST(req: Request) {
  try {
    const input = RequestSchema.parse(await req.json());

    // Fail safely (still functional) if key is missing
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { bio: fallbackBio(input), source: "fallback" },
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // You can use "gemini-1.5-flash" for cheaper/faster, or a newer model if available on your account.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Return ONLY valid JSON with EXACTLY this shape:
{"bio":"..."}

Rules:
- 2–3 sentences
- max 320 characters
- no emojis, no markdown, no extra keys

User:
Name: ${input.name}
Role: ${input.role}
Interests: ${input.interests || "N/A"}
Tone: ${input.tone}
`.trim();

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        // If supported on your model/account, this helps enforce JSON:
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = result.response.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { bio: fallbackBio(input), source: "fallback" },
        { status: 200 }
      );
    }

    const bioParsed = z.object({ bio: z.string().min(1) }).safeParse(parsed);
    if (!bioParsed.success) {
      return NextResponse.json(
        { bio: fallbackBio(input), source: "fallback" },
        { status: 200 }
      );
    }

    const out = ResponseSchema.parse({ bio: bioParsed.data.bio, source: "ai" });
    return NextResponse.json(out);
  } catch {
    return NextResponse.json(
      { error: "Invalid request or generation failed." },
      { status: 400 }
    );
  }
}