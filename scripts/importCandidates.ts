import mongoose from 'mongoose';
import Candidate from '../models/Candidate';
import { toEnglishDigits } from '../lib/utils';
import { toPositionKey } from '../lib/positions';
import fs from 'fs';

const MONGODB_URI = process.env.MONGODB_URI!;
const file = process.argv[2];
if (!file) throw new Error('Usage: ts-node scripts/importCandidates.ts <candidates.json>');

(async () => {
  await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB });
  const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
  const docs = rows.map((r: any) => ({
    ballotNumber: toEnglishDigits(r.ballot_number) ?? 0,
    panelId: r.panelid ?? null,
    name: r.candidate_name ?? '',
    voterNumber: r.voter_number ?? null,
    registrationNo: r.registration_no ?? null,
    department: r.department ?? null,
    hall: r.hall ?? null,
    imgUrl: r.img_url ?? null,
    fbId: r.fb_id ?? null,
    votesCount: r.votes_count ?? null,
    positionKey: toPositionKey(r.position ?? 'member'),
  }));
  const ops = docs.map((d: any) => ({
    updateOne: { 
      filter: { name: d.name, ballotNumber: d.ballotNumber, positionKey: d.positionKey }, 
      update: { $set: d }, 
      upsert: true 
    }
  }));
  const res = await Candidate.bulkWrite(ops);
  console.log(res);
  await mongoose.disconnect();
})();
