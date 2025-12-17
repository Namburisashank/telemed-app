const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy init
    // Actually, we use the model manager to list
    // Note: The Node SDK doesn't always expose listModels simply. 
    // Let's just try a simple generate to test connection.

    console.log("Testing connection with gemini-pro...");
    const result = await models.generateContent("Hello");
    console.log("Success! Response:", result.response.text());
  } catch (error) {
    console.error("Error details:", error.message);
  }
}

listModels();