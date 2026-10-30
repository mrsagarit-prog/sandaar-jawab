# SANDAAR JAWAB

A simple Hinglish AI chat website. The AI is instructed to prioritize factual answers and add natural, restrained humour only when it fits.

## Requirements
- Node.js 18+
- An OpenAI API key (API usage may incur charges)

## Run locally
1. Extract the ZIP and open this folder in a terminal.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put your API key in `.env` as `OPENAI_API_KEY=...`.
5. Run `npm start`.
6. Open http://localhost:3000

Never put your API key in `public/`, frontend JavaScript, or share it in chat/screenshots. Keep `.env` private.

## Notes
- This is a starter project, not a deployed public website.
- API costs and model availability depend on your OpenAI account.
- For public deployment, add HTTPS, stronger abuse protection, usage limits, and hosting configuration.
