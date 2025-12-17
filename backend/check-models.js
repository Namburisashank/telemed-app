const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function getAvailableModels() {
    if (!API_KEY) {
        console.error("❌ No API Key found in .env file");
        return;
    }

    try {
        console.log("🔍 Checking available models...");
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );

        const models = response.data.models;
        console.log("\n✅ SUCCESS! Here are the models you can use:");
        console.log("---------------------------------------------");
        
        // Filter for models that support "generateContent"
        const chatModels = models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        
        chatModels.forEach(model => {
            console.log(`Model Name: ${model.name.replace('models/', '')}`);
        });
        console.log("---------------------------------------------\n");
        console.log("👉 Please copy one of the names above into your aiRoutes.js file.");

    } catch (error) {
        console.error("\n❌ ERROR Checking Models:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            console.error(error.message);
        }
    }
}

getAvailableModels();