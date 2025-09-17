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

async function testCandidatesByPosition() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB');
    
    console.log('📊 Testing candidates by position aggregation...');
    
    const candidatesByPosition = await Candidate.aggregate([
      {
        $group: {
          _id: "$positionKey",
          candidates: {
            $push: {
              _id: "$_id",
              name: "$name",
              ballotNumber: "$ballotNumber",
              imgUrl: "$imgUrl",
              hall: "$hall",
              department: "$department",
              panelId: "$panelId"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log(`✅ Found ${candidatesByPosition.length} positions`);
    console.log('\n📋 Candidates by Position:');
    
    candidatesByPosition.forEach((position, index) => {
      console.log(`\n${index + 1}. ${position._id}: ${position.count} candidates`);
      console.log(`   Sample candidates:`);
      position.candidates.slice(0, 3).forEach(candidate => {
        console.log(`   - ${candidate.name} (#${candidate.ballotNumber}) - ${candidate.hall || 'No hall'}`);
      });
      if (position.candidates.length > 3) {
        console.log(`   ... and ${position.candidates.length - 3} more`);
      }
    });
    
    const totalCandidates = candidatesByPosition.reduce((sum, pos) => sum + pos.count, 0);
    console.log(`\n📊 Total: ${totalCandidates} candidates across ${candidatesByPosition.length} positions`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testCandidatesByPosition();
