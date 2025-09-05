const express = require("express");
const router = express.Router();
const axios = require("axios"); // For API calls
const dotenv = require("dotenv");

router.post("/chatbot-response", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Please provide a message." });
  }

  try {
    dotenv.config();

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const botReply =
      response.data.choices[0]?.message?.content ||
      "Sorry, I couldn't understand that.";
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error fetching response from OpenAI:", error.message);
    res.status(500).json({ reply: "Error connecting to AI model." });
  }
});

module.exports = router;
