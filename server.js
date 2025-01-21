const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Ping endpoint
app.get('/api/ping', (req, res) => {
    res.json({ message: 'Backend is Alive' });
});

// Enhancement endpoint
app.post('/api/enhance', async (req, res) => {
    try {
        const text = req.body.text;
        if (!text) {
            console.warn("No text provided in request.");
            return res.status(400).json({ error: "No text provided" });
        }
        console.log(`Received text for enhancement: "${text}"`);

        // Define categories
        const categories = ['Poetic', 'Philosophical', 'Humorous'];

        // Create and send requests concurrently
        const enhancementRequests = categories.map(async (category) => {
            const prompt = `Make this ${category.toLowerCase()}: ${text}`;
            console.log(`Sending request for category: ${category} with prompt: "${prompt}"`);
            try {
                const response = await axios.post('http://localhost:8000/api/enhance_text', { text: prompt });
                console.log(`Response from external service for category ${category}:`, response.data);
                return response.data.enhancedTexts || [`No ${category} enhancement found.`];  // Return texts for the category
            } catch (error) {
                console.error(`Error processing category: ${category}`, error.message, error.response ? error.response.data : '');
                return [`Error enhancing ${category.toLowerCase()} text`];  // Return error message if request fails
            }
        });

        const results = await Promise.all(enhancementRequests);

        // Flatten the array of results into a single array of enhanced texts
        const enhancedTexts = results.flat();  // Flattening the array
        console.log("Enhanced texts generated:", enhancedTexts);

        // Return flattened enhanced texts array
        res.json({
            originalText: text,
            enhancedTexts,  // Return the flattened array of enhanced texts
        });
    } catch (error) {
        console.error("Unexpected error in /api/enhance:", error.message);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});