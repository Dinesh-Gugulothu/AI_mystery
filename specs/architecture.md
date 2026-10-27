# Architecture

The React/Vite client communicates with the Express REST API through `/api/v1`. API controllers validate request input, invoke the mystery service, validate the generated object, persist it with Mongoose, and serialize a sanitized view. Gemini prompting and provider setup live in isolated AI/prompt modules. When no Gemini API key exists, a deterministic-schema fictional generator supports local gameplay; it is not presented as Gemini-generated content.

The `Case` model stores the complete solution server-side. `sanitizeCase` strips solution and accusation fields before the accusation. The resolution endpoint compares the submitted suspect ID to the stored culprit ID and returns the stored solution once. MongoDB is required for durable deployments. Without a configured database, the server keeps cases in memory for local evaluation and loses them at restart.
