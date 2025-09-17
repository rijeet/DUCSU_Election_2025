import { cookies } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import Panel from "@/models/Panel";
import { signSession, verifySession } from "@/lib/jwt";

function getOrCreateSubjectCookie() {
  const jar = cookies();
  let token = jar.get("sid")?.value;
  let sub = verifySession(token || "")?.sub;
  if (!sub) {
    sub = require('crypto').randomUUID();
    token = signSession(sub);
    jar.set("sid", token, { httpOnly: true, sameSite: "lax", secure: false, path: "/", maxAge: 60*60*24*90 });
  }
  return sub;
}

export async function GET() {
  await dbConnect();
  const sub = getOrCreateSubjectCookie();
  const panel = await Panel.findOne({ ownerId: sub });
  return Response.json(panel ?? { ownerId: sub, selections: {} });
}

export async function POST(req: Request) {
  await dbConnect();
  const sub = getOrCreateSubjectCookie();
  const body = await req.json();
  // body: { positionKey: string, candidateIds: string[] }
  const { positionKey, candidateIds } = body;

  // enforce rule: member up to 13, others max 1
  const isMember = positionKey === "member";
  if (!isMember && Array.isArray(candidateIds) && candidateIds.length > 1) {
    return new Response(JSON.stringify({ error: "Only one candidate allowed for this position" }), { status: 400 });
  }

  const panel = await Panel.findOneAndUpdate(
    { ownerId: sub },
    { $set: { [`selections.${positionKey}`]: candidateIds } },
    { upsert: true, new: true }
  );

  // global cap for member = 13
  if (isMember) {
    const count = Object.entries(panel.selections)
      .filter(([k]) => k === "member")
      .flatMap(([, v]) => v as string[]).length;
    if (count > 13) {
      return new Response(JSON.stringify({ error: "Member selections cannot exceed 13" }), { status: 400 });
    }
  }

  return Response.json(panel);
}
