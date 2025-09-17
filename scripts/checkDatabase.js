const mongoose = require('mongoose');

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
}, { timestamps: true });

const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'ducsu';

async function checkDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB');
    
    const totalCandidates = await Candidate.countDocuments();
    console.log(`📊 Total candidates in database: ${totalCandidates}`);
    
    const positions = await Candidate.distinct('positionKey');
    console.log(`📋 Positions found: ${positions.join(', ')}`);
    
    const sampleCandidates = await Candidate.find().limit(5);
    console.log('👥 Sample candidates:');
    sampleCandidates.forEach(c => {
      console.log(`  - ${c.name} (#${c.ballotNumber}) - ${c.positionKey}`);
    });
    
    const positionCounts = await Candidate.aggregate([
      { $group: { _id: '$positionKey', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📈 Candidates by position:');
    positionCounts.forEach(p => {
      console.log(`  ${p._id}: ${p.count} candidates`);
    });
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkDatabase();
