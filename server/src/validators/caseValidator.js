const isText = (value) => typeof value === 'string' && value.trim().length > 0;

export function validateGeneratedCase(value, requestedCount = 3) {
  const errors = [];
  if (!value || typeof value !== 'object') return { valid: false, errors: ['Response must be an object.'] };
  if (!isText(value.title) || !isText(value.description) || !isText(value.incident) || !isText(value.crimeScene)) errors.push('Case overview fields are required.');
  if (!Array.isArray(value.suspects) || value.suspects.length < 3 || value.suspects.length !== requestedCount) errors.push('Suspect count does not match the request.');
  if (!Array.isArray(value.evidence) || value.evidence.length < 3) errors.push('At least three evidence items are required.');
  if (!Array.isArray(value.timeline) || value.timeline.length < 1) errors.push('At least one timeline event is required.');
  const suspectIds = new Set((value.suspects || []).map((s) => s.id));
  const evidenceIds = new Set((value.evidence || []).map((e) => e.id));
  if (suspectIds.size !== (value.suspects || []).length || [...suspectIds].some((id) => !isText(id))) errors.push('Suspect IDs must be unique.');
  if (evidenceIds.size !== (value.evidence || []).length || [...evidenceIds].some((id) => !isText(id))) errors.push('Evidence IDs must be unique.');
  for (const suspect of value.suspects || []) if (![suspect.name, suspect.occupation, suspect.relationshipToCase, suspect.personality, suspect.motive, suspect.alibi, suspect.statement].every(isText)) errors.push(`Suspect ${suspect.id || 'unknown'} is incomplete.`);
  for (const evidence of value.evidence || []) if (![evidence.title, evidence.type, evidence.description, evidence.source].every(isText)) errors.push(`Evidence ${evidence.id || 'unknown'} is incomplete.`);
  const solution = value.solution;
  if (!solution || !suspectIds.has(solution.culpritId)) errors.push('Culprit must be one of the suspects.');
  if (solution && (![solution.motive, solution.explanation, solution.finalReveal].every(isText) || !Array.isArray(solution.decisiveEvidenceIds) || !solution.decisiveEvidenceIds.length)) errors.push('Solution is incomplete.');
  for (const id of solution?.decisiveEvidenceIds || []) if (!evidenceIds.has(id)) errors.push(`Unknown decisive evidence ID: ${id}.`);
  for (const id of solution?.redHerringEvidenceIds || []) if (!evidenceIds.has(id)) errors.push(`Unknown red herring evidence ID: ${id}.`);
  for (const evidence of value.evidence || []) for (const id of evidence.suspectIds || []) if (!suspectIds.has(id)) errors.push(`Evidence ${evidence.id} references an unknown suspect.`);
  return { valid: errors.length === 0, errors };
}

export function sanitizeCase(caseData) {
  const plain = typeof caseData.toObject === 'function' ? caseData.toObject() : structuredClone(caseData);
  delete plain.solution;
  delete plain.accusation;
  delete plain.__v;
  delete plain._id;
  return { ...plain, _id: String(caseData._id) };
}
