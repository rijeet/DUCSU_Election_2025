import mongoose, { Schema, models, model } from "mongoose";

export interface ICandidate {
  _id?: string;
  votesCount: number;              // normalized (Bengali → English digits)
  panelId?: string | null;           // e.g., "ncp", "Combined", etc.
  name: string;                      // candidate_name
  voterNumber?: string | null;
  registrationNo?: string | null;
  department?: string | null;
  hall?: string | null;
  imgUrl?: string | null;
  fbId?: string | null;
  positionKey: string;               // e.g., "vice_president", "general_secretary" ...
  priority?: number | null;
}

const CandidateSchema = new Schema<ICandidate>({
  votesCount: { type: Number, required: true, index: true },
  panelId: { type: String, default: null, index: true },
  name: { type: String, required: true, index: "text" },
  voterNumber: String,
  registrationNo: String,
  department: { type: String, index: true },
  hall: { type: String, index: true },
  imgUrl: String,
  fbId: String,
  positionKey: { type: String, required: true, index: true },
  priority: { type: Number, default: null, index: true },
}, { timestamps: true });

export default models.Candidate || model<ICandidate>("Candidate", CandidateSchema);
