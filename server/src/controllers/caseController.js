import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import Case from '../models/Case.js';
import { generateMystery } from '../services/aiService.js';
import { validateGeneratedCase, sanitizeCase } from '../validators/caseValidator.js';

const memoryCases = new Map();
const dbAvailable = () => mongoose.connection.readyState === 1;
const findCase = async (id) => dbAvailable() ? Case.findById(id) : memoryCases.get(id);
const saveCase = async (data) => { if (dbAvailable()) return new Case(data).save(); data._id ||= randomUUID(); memoryCases.set(String(data._id), data); return data; };
const idValid = (id) => mongoose.isValidObjectId(id) || memoryCases.has(id);

export async function createCase(req, res, next) {
  try {
    const { scenario, mysteryType = 'suspicious_incident', difficulty = 'medium', suspectCount, investigationLength = 'medium' } = req.body;
    if (typeof scenario !== 'string' || scenario.trim().length < 30 || scenario.length > 2000) return res.status(400).json({ success:false, message:'Scenario must be between 30 and 2,000 characters.' });
    if (!['easy','medium','hard'].includes(difficulty)) return res.status(400).json({ success:false, message:'Choose a valid difficulty.' });
    if (!['short','medium','long'].includes(investigationLength)) return res.status(400).json({ success:false, message:'Choose a valid investigation length.' });
    const count = Number(suspectCount || ({easy:3,medium:4,hard:5}[difficulty]));
    if (![3,4,5].includes(count)) return res.status(400).json({ success:false, message:'Choose between 3 and 5 suspects.' });
    const input = { scenario:scenario.trim(), mysteryType:String(mysteryType).slice(0,40), difficulty, suspectCount:count, investigationLength };
    const generated = await generateMystery(input);
    const validation = validateGeneratedCase(generated, count);
    if (!validation.valid) return res.status(502).json({ success:false, message:'Unable to generate a valid case right now. Please try again.' });
    const saved = await saveCase(generated);
    return res.status(201).json({ success:true, caseId:String(saved._id), message:'Mystery generated successfully', case:sanitizeCase(saved) });
  } catch (error) { next(error); }
}
export async function listCases(req,res,next) { try { const cases = dbAvailable() ? await Case.find().sort({createdAt:-1}).limit(50) : [...memoryCases.values()].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); res.json({success:true,cases:cases.map(sanitizeCase)}); } catch(error){next(error);} }
export async function getOneCase(req,res,next) { try { if (!idValid(req.params.caseId)) return res.status(404).json({success:false,message:'Case not found.'}); const item=await findCase(req.params.caseId); if(!item)return res.status(404).json({success:false,message:'Case not found.'}); const safe=sanitizeCase(item); if(item.status==='resolved'&&item.accusation) safe.resolution=item.accusation; res.json({success:true,case:safe}); } catch(error){next(error);} }
export async function getSuspect(req,res,next) { try { if(!idValid(req.params.caseId))return res.status(404).json({success:false,message:'Case not found.'}); const item=await findCase(req.params.caseId); if(!item)return res.status(404).json({success:false,message:'Case not found.'}); const suspect=item.suspects.find((entry)=>entry.id===req.params.suspectId); if(!suspect)return res.status(400).json({success:false,message:'Suspect not found.'}); res.json({success:true,suspect}); }catch(error){next(error);} }
export async function getEvidence(req,res,next) { try { if(!idValid(req.params.caseId))return res.status(404).json({success:false,message:'Case not found.'}); const item=await findCase(req.params.caseId); if(!item)return res.status(404).json({success:false,message:'Case not found.'}); const evidence=item.evidence.find((entry)=>entry.id===req.params.evidenceId); if(!evidence)return res.status(404).json({success:false,message:'Evidence not found.'}); res.json({success:true,evidence}); }catch(error){next(error);} }
export async function submitAccusation(req,res,next) { try { if(!idValid(req.params.caseId))return res.status(404).json({success:false,message:'Case not found.'}); const item=await findCase(req.params.caseId); if(!item)return res.status(404).json({success:false,message:'Case not found.'}); if(item.status==='resolved')return res.status(409).json({success:false,message:'This case has already been resolved.'}); const {suspectId,reasoning=''}=req.body; if(typeof suspectId!=='string'||!item.suspects.some((person)=>person.id===suspectId))return res.status(400).json({success:false,message:'Select a valid suspect.'}); if(typeof reasoning!=='string'||reasoning.length>1000)return res.status(400).json({success:false,message:'Reasoning must be 1,000 characters or less.'}); const result={correct:suspectId===item.solution.culpritId,suspectId,accusedSuspect:item.suspects.find((person)=>person.id===suspectId).name,reasoning,solution:item.solution,submittedAt:new Date()}; item.status='resolved';item.accusation=result;item.resolvedAt=new Date();item.updatedAt=new Date(); if(dbAvailable())await item.save();else memoryCases.set(String(item._id),item); res.json({success:true,result}); }catch(error){next(error);} }
export async function deleteOneCase(req,res,next) { try { if(!idValid(req.params.caseId))return res.status(404).json({success:false,message:'Case not found.'}); if(dbAvailable())await Case.findByIdAndDelete(req.params.caseId);else memoryCases.delete(req.params.caseId); res.json({success:true}); }catch(error){next(error);} }
