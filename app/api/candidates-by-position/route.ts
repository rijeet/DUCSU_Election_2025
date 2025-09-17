import { dbConnect } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";

export async function GET() {
  await dbConnect();
  
  try {
    // Get all candidates grouped by position
    const candidatesByPosition = await Candidate.aggregate([
      {
        $group: {
          _id: "$positionKey",
          candidates: {
            $push: {
              _id: "$_id",
              name: "$name",
              votesCount: "$votesCount",
              imgUrl: "$imgUrl",
              hall: "$hall",
              department: "$department",
              panelId: "$panelId",
              priority: "$priority"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $unwind: "$candidates"
      },
      {
        $sort: {"candidates.votesCount": -1}
      },
      {
        $group: {
          _id: "$_id",
          candidates: {
            $push: "$candidates"
          },
          count: { $sum: 1 },
          priority: { $first: "$candidates.priority" }
        }
      },
      {
        $sort: { priority: 1, count: -1 }
      }
    ]);

    return Response.json({ 
      success: true, 
      data: candidatesByPosition,
      totalPositions: candidatesByPosition.length,
      totalCandidates: candidatesByPosition.reduce((sum, pos) => sum + pos.count, 0)
    });
  } catch (error) {
    console.error('Error fetching candidates by position:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to fetch candidates' 
    }, { status: 500 });
  }
}
