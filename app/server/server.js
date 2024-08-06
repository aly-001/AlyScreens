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
    console.log('Received message from client:', message);

    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ type: 'error', error: 'Invalid message format' }));
      return;
    }

    const { word, innerContext, outerContext, apiKey, type } = parsedMessage;
    
    if (!apiKey) {
      console.error('API key is missing');
      ws.send(JSON.stringify({ type: 'error', error: 'API key is missing' }));
      return;
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    try {
      let prompt;
      if (type === 'definition') {
        prompt = `Give a translation to english of the word "${word}" in the context of "${innerContext}" and "${outerContext}". Provide a tiny explanation of what's going on in the book. Keep it short. Your entire response shouldn't be more than 50 words, and paragraphs shouln't be more than 15 or so words. The explanation really shouldn't be more than 10 words, and make sure that it has to do with the original word, and not just explaining the book plot. Avoid referring to the title of the book, even if you know it. You're part of an e-reader, so don't say things like "sure" or "cetainly" or "I can help with that". Just give the translation and the explanation. For the translation, you don't have to say, "in english" or "to english" or "in the context of". Just give the translation.`;
      } else if (type === 'grammar') {
        prompt = `Provide a brief grammar explanation for the word "${word}" in the context of "${innerContext}" and "${outerContext}". Focus on its part of speech, any unique grammatical features, and how it's used in the sentence. Keep it concise, not exceeding 50 words. Don't use introductory phrases, just provide the grammatical information directly.`;
      } else {
        console.error('Invalid request type:', type);
        ws.send(JSON.stringify({ type: 'error', error: 'Invalid request type' }));
        return;
      }

      console.log(`Creating stream for ${type} request`);
      const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      });

      console.log(`Preparing to send start message for ${type}`);
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      ws.send(JSON.stringify({ type: 'start', contentType: type }));
      console.log(`Sent start message for ${type}`);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          console.log(`Sending content for ${type}: ${content}`);
          ws.send(JSON.stringify({ type: 'content', data: content, contentType: type }));
        }
      }

      console.log(`Sending done message for ${type}`);
      ws.send(JSON.stringify({ type: 'done', contentType: type }));
    } catch (error) {
      console.error('Error:', error);
      ws.send(JSON.stringify({ type: 'error', error: error.message, contentType: type }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// Optional: Add a simple route for checking server status
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});