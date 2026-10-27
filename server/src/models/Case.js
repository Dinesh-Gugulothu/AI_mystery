import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true }, scenario: { type: String, required: true }, mysteryType: { type: String, default: 'suspicious_incident' }, difficulty: { type: String, default: 'medium' }, status: { type: String, enum: ['active', 'resolved'], default: 'active' }, incident: String, crimeScene: String,
  suspects: { type: [mongoose.Schema.Types.Mixed], required: true }, evidence: { type: [mongoose.Schema.Types.Mixed], required: true }, timeline: { type: [mongoose.Schema.Types.Mixed], default: [] }, solution: { type: mongoose.Schema.Types.Mixed, required: true }, media: { type: [mongoose.Schema.Types.Mixed], default: [] }, accusation: { type: mongoose.Schema.Types.Mixed, default: null }, createdAt: { type: Date, default: Date.now }, updatedAt: { type: Date, default: Date.now }, resolvedAt: { type: Date, default: null }
}, { collection: 'cases', versionKey: false });

export default mongoose.models.Case || mongoose.model('Case', caseSchema);
