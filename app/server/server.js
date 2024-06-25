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
            content: `Give the most helpful translation to english of the word "${word}" in the context of "${innerContext}" and "${outerContext}". If the word is cut off, define the word as best as you can. Keep it short. Avoid saying things like "in this context".`,
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