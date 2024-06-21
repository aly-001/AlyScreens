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
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `give a short (no more than 20 words and no less than 3 words) definition of ${word} in the context of ${innerContext}. Oh and in english please.`,
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