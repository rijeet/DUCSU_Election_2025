import { dbConnect } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import { toEnglishDigits } from "@/lib/utils";
import { toPositionKey } from "@/lib/positions";

export const runtime = "nodejs";

async function parseBody(req: Request): Promise<any[]> {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await req.json();
  }
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) throw new Error("file missing");
    const buf = Buffer.from(await file.arrayBuffer());
    const XLSX = await import("xlsx");
    const wb = XLSX.read(buf, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(ws);
  }
  throw new Error("Unsupported content-type");
}

export async function POST(req: Request) {
  if (req.headers.get("x-api-key") !== process.env.ADMIN_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  await dbConnect();
  let rows: any[] = [];
  try { 
    rows = await parseBody(req); 
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }

  // Expected input keys (mapping from provided dataset):
  // ballot_number, panelid, candidate_name, voter_number, registration_no, department, hall, img_url, fb_id, votes_count, position

  const docs = rows.map((r) => ({
    ballotNumber: toEnglishDigits(r.ballot_number) ?? 0,
    panelId: r.panelid ?? null,
    name: r.candidate_name ?? "",
    voterNumber: r.voter_number ?? null,
    registrationNo: r.registration_no ?? null,
    department: r.department ?? null,
    hall: r.hall ?? null,
    imgUrl: r.img_url ?? null,
    fbId: r.fb_id ?? null,
    votesCount: r.votes_count ?? null,
    positionKey: toPositionKey(r.position ?? "member"),
  }));

  // Upsert by (name + ballotNumber + positionKey)
  const ops = docs.map((d) => ({
    updateOne: {
      filter: { name: d.name, ballotNumber: d.ballotNumber, positionKey: d.positionKey },
      update: { $set: d },
      upsert: true,
    },
  }));

  const result = await Candidate.bulkWrite(ops);
  return Response.json({ 
    ok: true, 
    matched: result.matchedCount, 
    upserted: result.upsertedCount, 
    modified: result.modifiedCount 
  });
}
