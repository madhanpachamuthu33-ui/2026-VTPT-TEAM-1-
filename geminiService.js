require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const normalizeModelName = (configuredModel) => {
  const model = (configuredModel || '').trim().toLowerCase();

  if (!model) {
    return 'gemini-3.6-flash';
  }

  if (model.includes('gemini-1.5') || model.includes('gemini-2.0') || model.includes('gemini-2.5')) {
    return 'gemini-3.6-flash';
  }

  return model;
};

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = normalizeModelName(process.env.GEMINI_MODEL);

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    // Initialize the client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Invalid Gemini response');
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
};

module.exports = {
  callGemini,
};