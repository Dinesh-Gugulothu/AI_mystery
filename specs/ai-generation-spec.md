# AI generation

Gemini is called only by `server/src/services/aiService.js`. Model choice and API key come from `GEMINI_MODEL` and `GEMINI_API_KEY`. The prompt requests structured JSON, one culprit selected from the suspects, supported decisive clues, explained red herrings, and valid cross-references. The validator checks required content, exact suspect count, unique IDs, culprit membership, and evidence references. One bounded regeneration is attempted after invalid output. Gemini failure is surfaced as a safe API error.

When `GEMINI_API_KEY` is absent, the local fallback generator creates fictional structured cases so the rest of the app can be run locally. This fallback is for development/demo use and does not claim AI generation.

Media evidence is rendered from structured text. Chat content can be represented as message objects and the client renders messages safely as text; image/video generation and storage are optional and are not required for this MVP.
