import { dbConnect } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import { PYRAMID_LAYERS } from "@/lib/positions";

export async function GET() {
  await dbConnect();

  try {
    const winnerPositions: any[] = [];

    const allPositions = PYRAMID_LAYERS.flat();

    for (const positionKey of allPositions) {
      let candidates;
      if (positionKey === 'member') {
        candidates = await Candidate.find({ positionKey })
          .sort({ votesCount: -1 })
          .limit(13)
          .select('name votesCount imgUrl panelId positionKey');
      } else {
        candidates = await Candidate.find({ positionKey })
          .sort({ votesCount: -1 })
          .limit(1)
          .select('name votesCount imgUrl panelId positionKey');
      }
      if (candidates.length > 0) {
        winnerPositions.push({
          _id: positionKey,
          candidates: candidates.map(c => ({
            _id: c._id,
            name: c.name,
            votesCount: c.votesCount,
            imgUrl: c.imgUrl,
            panelId: c.panelId,
            positionKey: c.positionKey,
          })),
        });
      }
    }

    return Response.json({
      success: true,
      data: winnerPositions,
    });
  } catch (error) {
    console.error('Error fetching winners:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch winners',
      },
      { status: 500 }
    );
  }
}
