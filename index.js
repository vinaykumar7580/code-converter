const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

async function generateAssistantResponse(userInput) {
    const payload = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'You are a code assistant.' }, { role: 'user', content: userInput }]
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}

app.post('/convert', async (req, res) => {
    const {code,language}=req.body
    try {
        const assistantResponse = await generateAssistantResponse(`Convert this code:\n${code} into ${language} language`);
        res.json({ response: assistantResponse });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
    }
});

app.post('/debug', async (req, res) => {
    const {code}= req.body
    try {
        const assistantResponse = await generateAssistantResponse(`Debug this code:\n${code}`);
        res.json({ response: assistantResponse });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
    }
});

app.post('/quality', async (req, res) => {
    const {code} = req.body;
    try {
        const assistantResponse = await generateAssistantResponse(`Check the quality of this code in percentage:\n${code}`);
        res.json({ response: assistantResponse });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
    }
});

app.listen(8080, () => {
  console.log("server is running on port 8080");
});

