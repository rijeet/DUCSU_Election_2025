import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

export type SessionPayload = { sub: string };

export function signSession(sub: string) {
  return jwt.sign({ sub } as SessionPayload, JWT_SECRET, { expiresIn: "90d" });
}

export function verifySession(token?: string): SessionPayload | null {
  try { 
    if (!token) return null; 
    return jwt.verify(token, JWT_SECRET) as SessionPayload; 
  } catch { 
    return null; 
  }
}
