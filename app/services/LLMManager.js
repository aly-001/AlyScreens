import OpenAI from "openai";
import { Buffer } from 'buffer';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const createOpenAIInstance = (apiKey) => {
  return new OpenAI({ apiKey });
};

export async function callLLM(apiKey, prompt) {
  try {
    const openai = createOpenAIInstance(apiKey);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling LLM: ", error);
    return null;
  }
}

export const generateAudio = async (apiKey, word) => {
  try {
    const openai = createOpenAIInstance(apiKey);
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: `. ${word}!!`,
    });
    
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    return base64Audio;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
};

const TrueFalseResponse = z.object({
  result: z.boolean(),
});

export async function callLLMTrueFalse(apiKey, prompt) {
  try {
    const openai = createOpenAIInstance(apiKey);
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Determine if the statement is true or false." },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(TrueFalseResponse, "result"),
    });
    const result = completion.choices[0].message.parsed;
    return result;
  } catch (error) {
    console.error("Error calling LLM: ", error);
    return null;
  }
}
