import { NextResponse } from "next/server";
import { verifyJwt } from "../../../lib/jwt";
import {extractAccessToken} from  "../../../lib/api";// 壮真さんの自作JWT検証関数

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = extractAccessToken(cookie); 

  if (!token || !verifyJwt(token)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return new NextResponse("OK", { status: 200 });
}