// lib/jwt.ts
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH || "./keys/public.pem";
const publicKey = fs.readFileSync(path.resolve(publicKeyPath), "utf8");

export function verifyJwt(token: string): null | jwt.JwtPayload {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    return typeof decoded === "object" ? decoded : null;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
