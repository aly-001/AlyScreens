const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const OpenAI = require('openai');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    const { word, innerContext, outerContext, apiKey } = JSON.parse(message);

    if (!apiKey) {
      ws.send(JSON.stringify({ type: 'error', error: 'API key is missing' }));
      return;
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `Give a translation to english of the word "${word}" in the context of "${innerContext}" and "${outerContext}". Provide a tiny explanation of what's going on in the book. Keep it short. Your entire response shouldn't be more than 50 words, and paragraphs shouln't be more than 15 or so words. The explanation really shouldn't be more than 10 words, and make sure that it has to do with the original word, and not just explaining the book plot. Avoid referring to the title of the book, even if you know it. You're part of an e-reader, so don't say things like "sure" or "cetainly" or "I can help with that". Just give the translation and the explanation. For the translation, you don't have to say, "in english" or "to english" or "in the context of". Just give the translation.`,
          },
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          ws.send(JSON.stringify({ type: 'content', data: content }));
        }
      }

      ws.send(JSON.stringify({ type: 'done' }));
    } catch (error) {
      console.error('Error:', error);
      ws.send(JSON.stringify({ type: 'error', error: error.message }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));