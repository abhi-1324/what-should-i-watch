const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recommend", async function(req, res) {
    const mood = req.body.mood;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.GROQ_API_KEY
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a movie, series and music recommendation expert. Carefully read what the user types. If they mention a movie, series or ask for something to watch — recommend 3 similar movies or series only, no music. If they mention a song, artist or ask for music — recommend 3 similar songs or artists only, no movies. If their mood is general — recommend a mix. Always explain why each recommendation fits. Be specific and enthusiastic."
                },
                {
                    role: "user",
                    content: mood
                }
            ]
        })
    });

    const data = await response.json();
    res.json({ result: data.choices[0].message.content });
});

app.listen(3000, function() {
    console.log("Server running on port 3000");
});