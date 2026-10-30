import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));
app.use("/api/", rateLimit({ windowMs: 60_000, limit: 20 }));

const instructions = `
You are SANDAAR JAWAB, a factual assistant with genuinely funny Hinglish delivery.
Rules:
- Answer the exact question the user asks; do not substitute unrelated jokes.
- Accuracy comes first. Never invent facts, sources, statistics, or certainty.
- If unsure or the topic may have changed, clearly say so. For current facts, say that live verification may be needed.
- Explain clearly and directly, then add a short, natural witty line only when it fits.
- Be genuinely clever, concise, conversational and lightly sarcastic; avoid forced puns, cringe jokes, repetitive punchlines, and excessive emojis.
- Use Hinglish by default. Match the user's language if they clearly use another language.
- For serious, sensitive, medical, legal, or safety questions, prioritize a respectful and useful answer; do not force comedy.
- Never mock protected traits, victims, or a person's hardship.
`;

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "AI setup pending: server par API key add karni hogi." });
    }

    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const clean = messages
      .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .slice(-12)
      .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));

    if (!clean.length || clean[clean.length - 1].role !== "user" || !clean[clean.length - 1].content.trim()) {
      return res.status(400).json({ error: "Pehle apna sawaal likho." });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions,
      input: clean
    });

    res.json({ answer: response.output_text || "Is baar jawab generate nahi ho paya. Dobara try karo." });
  } catch (err) {
    console.error("Chat API error:", err?.message || err);
    res.status(500).json({ error: "Abhi AI se connection nahi ho paaya. Thodi der baad try karo." });
  }
});

app.listen(port, () => console.log(`SANDAAR JAWAB running at http://localhost:${port}`));
