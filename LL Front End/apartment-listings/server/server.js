import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Generative AI
// Make sure to have GOOGLE_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// API Endpoint to handle AI questions
app.post('/api/ask-ai', async (req, res) => {
  const { question, listingData } = req.body;

  if (!question || !listingData) {
    return res.status(400).json({ error: 'Question and listing data are required.' });
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are an expert real estate assistant. Your task is to answer questions about an apartment listing based ONLY on the data provided below.
    Do not use any other knowledge or make assumptions. If the information is not in the data, state that clearly.

    **Listing Data:**
    ${JSON.stringify(listingData, null, 2)}

    **User's Question:**
    "${question}"

    **Your Answer:**
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ answer: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to get an answer from the AI.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 