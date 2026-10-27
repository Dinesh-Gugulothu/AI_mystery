# AI Mystery Room

A responsive fictional mystery investigation app. Create a case from a short premise, examine the suspects and evidence, make one final accusation, then see the solution.

## Stack

- React, Vite, React Router, and CSS client
- Node.js and Express REST API
- MongoDB with Mongoose when `MONGODB_URI` is configured
- Gemini structured generation through a server-only service

## Run locally

1. Install Node.js 20 or newer and MongoDB (or use a MongoDB connection string).
2. Copy `.env.example` to `server/.env` and set `MONGODB_URI`. Add `GEMINI_API_KEY` to enable Gemini generation. The app uses a built-in fictional generator when no Gemini key is configured, so the investigation flow can be tried without an AI key.
3. Install dependencies from the project root with `npm install`, then install each app's dependencies with `npm install --prefix client` and `npm install --prefix server`.
4. Run `npm run dev` from the root. The client is at http://localhost:5173 and the API at http://localhost:5000.

The client uses the built-in Vite development proxy for `/api` requests. To deploy separately, set `VITE_API_URL` to the API base URL (for example `https://api.example.com/api/v1`) at client build time, and configure `CLIENT_URL` on the server.

## API

All routes are under `/api/v1`. Main routes: `POST /cases`, `GET /cases`, `GET /cases/:caseId`, `GET /cases/:caseId/suspects/:suspectId`, `GET /cases/:caseId/evidence/:evidenceId`, `POST /cases/:caseId/accusation`, and `DELETE /cases/:caseId`. The pre-accusation case serializer omits solution and accusation data. The accusation endpoint compares suspect IDs to the stored culprit and allows one submission per case.

## Verification

Run server unit tests with `npm test`. Build the client with `npm run build`.

## Project notes

See [`specs/project-spec.md`](specs/project-spec.md), [`specs/architecture.md`](specs/architecture.md), [`specs/api-spec.md`](specs/api-spec.md), and [`specs/ai-generation-spec.md`](specs/ai-generation-spec.md) for the implementation notes and API contract.
