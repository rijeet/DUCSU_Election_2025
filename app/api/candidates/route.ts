import { dbConnect } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";

export async function GET(req: Request) {
  await dbConnect();
  const url = new URL(req.url);
  const position = url.searchParams.get("position");
  const q = url.searchParams.get("q");
  const ballotNumber = url.searchParams.get("ballotNumber");
  const panelId = url.searchParams.get("panelId");
  const department = url.searchParams.get("department");
  const hall = url.searchParams.get("hall");
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "30", 10), 100);

  const where: any = {};
  if (position) where.positionKey = position;
  if (panelId) where.panelId = panelId;
  if (department) where.department = department;
  if (hall) where.hall = hall;
  if (ballotNumber) where.ballotNumber = parseInt(ballotNumber, 10);
  if (q) where.$text = { $search: q };

  const [items, total] = await Promise.all([
    Candidate.find(where).sort({ priority: 1, votesCount: -1, ballotNumber: 1 }).skip((page-1)*limit).limit(limit),
    Candidate.countDocuments(where)
  ]);

  return Response.json({ items, total, page, limit });
}
