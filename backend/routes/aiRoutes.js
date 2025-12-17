const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- 1. AI Symptom Checker Route ---
router.post('/analyze', async (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms) {
        return res.status(400).json({ error: "No symptoms provided" });
    }

    try {
        // USING YOUR MODEL: gemini-2.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Act as a medical assistant for a Telemedicine app called 'TeleMed'.
        The user will describe their symptoms: "${symptoms}".
        
        Your Goal:
        1. Briefly explain what might be wrong (keep it simple, max 2 sentences).
        2. Recommend ONE of the following specialists based on the symptoms:
           - General Physician
           - Gynecologist
           - Dermatologist
           - Pediatricians
           - Neurologist
           - Gastroenterologist
        
        3. End with a disclaimer: "Please consult a doctor for an accurate diagnosis."
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (err) {
        console.error("AI Symptom Error:", err.message);
        res.json({ reply: "I am having trouble connecting to the AI. Please consult a General Physician." });
    }
});

// --- 2. NEW: Medicine Interaction Checker Route ---
router.post('/check-interaction', async (req, res) => {
    const { medicines } = req.body; // Expecting string like "Aspirin, Warfarin"

    if (!medicines) {
        return res.status(400).json({ error: "No medicines provided" });
    }

    try {
        // USING YOUR MODEL: gemini-2.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Act as a pharmacist for a Telemedicine app.
        The user is asking about interactions between these medicines: "${medicines}".
        
        Your Goal:
        1. Identify if there is a known serious interaction between them.
        2. If YES: Explain the risk simply (e.g., "Risk of bleeding", "Reduces effectiveness").
        3. If NO: Say "No major known interactions found."
        4. Always end with: "Disclaimer: This is AI advice. Consult your doctor before changing medication."
        
        Keep it short and clear.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (err) {
        console.error("AI Interaction Error:", err.message);
        res.json({ reply: "I cannot check interactions right now. Please ask a doctor." });
    }
});

module.exports = router;