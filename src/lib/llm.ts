import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
}

export async function enrichTrendIfPossible(termKo: string) {
  const openai = getClient();

  if (!openai) {
    return null;
  }

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You help classify Korean trend terms for a market intelligence platform."
      },
      {
        role: "user",
        content: `Return concise JSON with romanization, zhExplanation, enExplanation, tone, usageContext, riskLevel for Korean trend term: ${termKo}`
      }
    ]
  });

  return response.output_text;
}

