import OpenAI from "openai";
import { Buffer } from 'buffer';

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