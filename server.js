require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

// Create an OpenAI instance with the API key
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Use environment variable for the API key
});

const app = express();
app.use(express.json()); // Use built-in JSON middleware
app.use(cors()); // Enable CORS for all requests

// Define the /chat endpoint
app.post("/chat", async (req, res) => {
    const { prompt } = req.body;

    // Check if prompt is provided
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Specify the model to use
            messages: [{ role: "user", content: prompt }], // Structure the prompt as a message
            max_tokens: 1000, // Max tokens in the response
            temperature: 0, // Control randomness
        });

        res.json({ response: completion.choices[0].message.content }); // Return structured JSON response
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Define the port and start the server
const PORT = process.env.PORT || 8020; // Allow for environment-defined port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
