const mongoose = require('mongoose');
const fs = require('fs');

// Import the models (we'll need to create JS versions)
const CandidateSchema = new mongoose.Schema({
  ballotNumber: { type: Number, required: true, index: true },
  panelId: { type: String, default: null, index: true },
  name: { type: String, required: true, index: "text" },
  voterNumber: String,
  registrationNo: String,
  department: { type: String, index: true },
  hall: { type: String, index: true },
  imgUrl: String,
  fbId: String,
  votesCount: Number,
  positionKey: { type: String, required: true, index: true },
  priority: { type: Number, default: null, index: true }, // Add priority field
}, { timestamps: true });

const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);

// Utility functions
function toEnglishDigits(input) {
  if (input == null) return null;
  const s = String(input);
  const map = { 
    "০":"0","১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9" 
  };
  const normalized = s.replace(/[০-৯]/g, d => map[d]);
  const n = parseInt(normalized, 10);
  return Number.isFinite(n) ? n : null;
}

function toPositionKey(label) {
  const POSITION_LABELS = {
    vice_president: "Vice-President",
    general_secretary: "General Secretary",
    assistant_general_secretary: "Assistant General Secretary",
    liberation_war: "Liberation War and Democratic M",
    science_tech: "Science and Technology",
    common_room: "Common Room, Reading Room and C",
    international_affairs: "International Affairs",
    research_publication: "Research and Publication",
    literature_cultural: "Literature and Cultural Affairs",
    sports: "Sports",
    students_transport: "Students' Transport",
    social_service: "Social Service",
    career_development: "Career Development",
    health_environment: "Health and Environment",
    human_rights_legal: "Human Rights and Legal Affairs",
    member: "Member",
  };
  
  const entries = Object.entries(POSITION_LABELS);
  const found = entries.find(([, v]) => v.toLowerCase() === label.toLowerCase());
  if (found) return found[0];
  const key = entries.find(([, v]) => label && v.toLowerCase().startsWith(label.toLowerCase()))?.[0];
  return key ?? "member";
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'ducsu';
const file = process.argv[2] || 'candidates.json';

async function importCandidates() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB');
    
    console.log(`📁 Reading file: ${file}`);
    const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log(`📊 Found ${rows.length} candidates to import`);
    
    const docs = rows.map((r) => ({
      ballotNumber: toEnglishDigits(r.ballot_number) ?? 0,
      panelId: r.panelId ?? null,
      name: r.candidate_name ?? '',
      voterNumber: r.voter_number ?? null,
      registrationNo: r.registration_no ?? null,
      department: r.department ?? null,
      hall: r.hall ?? null,
      imgUrl: r.img_url ? `${r.img_url}.png` : null, // Add .png extension if img_url exists
      fbId: r.fb_id ?? null,
      votesCount: r.votes_count ?? null,
      positionKey: toPositionKey(r.position ?? 'member'),
      priority: toEnglishDigits(r.priority) ?? null, // Add priority field
    }));
    
    console.log('🔄 Importing candidates...');
    const ops = docs.map((d) => ({
      updateOne: { 
        filter: { name: d.name, ballotNumber: d.ballotNumber, positionKey: d.positionKey }, 
        update: { $set: d }, 
        upsert: true 
      }
    }));
    
    const result = await Candidate.bulkWrite(ops);
    console.log('✅ Import completed!');
    console.log(`📈 Matched: ${result.matchedCount}`);
    console.log(`📈 Upserted: ${result.upsertedCount}`);
    console.log(`📈 Modified: ${result.modifiedCount}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

importCandidates();
