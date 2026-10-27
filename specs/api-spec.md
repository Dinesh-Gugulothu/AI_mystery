# API specification

Base path: `/api/v1`

- `GET /health` — API health.
- `POST /cases` — create a case from `{ scenario, mysteryType, difficulty, suspectCount, investigationLength }`; returns a sanitized case and ID.
- `GET /cases` — list sanitized case summaries.
- `GET /cases/:caseId` — retrieve sanitized case; after resolution includes the already earned resolution.
- `GET /cases/:caseId/suspects/:suspectId` — retrieve one suspect profile.
- `GET /cases/:caseId/evidence/:evidenceId` — retrieve one evidence item.
- `POST /cases/:caseId/accusation` — submit `{ suspectId, reasoning? }`; only one valid accusation is accepted.
- `DELETE /cases/:caseId` — delete a case.

Invalid input returns 400, missing cases/evidence return 404, duplicate accusation returns 409, and unexpected errors use a generic 500 response. Generation endpoints are rate limited.
