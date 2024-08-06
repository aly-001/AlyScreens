import OpenAI from "openai";
import { API_KEY } from "../config/constants";

const openai = new OpenAI({
  apiKey: API_KEY,
});

export async function callLLM(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling LLM: ", error);
    return null;
  }
}

