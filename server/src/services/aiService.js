import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildMysteryPrompt } from '../prompts/mysteryPrompt.js';
import { validateGeneratedCase } from '../validators/caseValidator.js';
import { buildFallbackCase } from './fallbackMystery.js';

export async function generateMystery(input) {
  if (!process.env.GEMINI_API_KEY) return buildFallbackCase(input);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash', generationConfig: { responseMimeType: 'application/json', temperature: 0.85 } });
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const prompt = buildMysteryPrompt(input) + (attempt ? '\n\nYour previous response did not satisfy the schema. Return a complete corrected JSON response.' : '');
      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      const validation = validateGeneratedCase(parsed, input.suspectCount);
      if (!validation.valid) throw new Error(`Generated case validation failed: ${validation.errors.join(' ')}`);
      return { ...parsed, scenario: input.scenario, mysteryType: input.mysteryType, difficulty: input.difficulty, status: 'active', createdAt: new Date(), updatedAt: new Date(), media: [] };
    } catch (error) { lastError = error; }
  }
  throw new Error(lastError?.message || 'AI generation failed.');
}
