import OpenAI from "openai";
import { API_KEY } from "../config/constants";
import { Audio } from 'expo-av';
import { Buffer } from 'buffer';

const openai = new OpenAI({
  apiKey: API_KEY,
});

export async function callLLM(prompt) {
  console.log("prompt:", prompt);
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

export const generateAudio = async (word) => {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: `. ${word}!!`,
    });
    
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    console.log("Audio data generated");
    return base64Audio;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
};


