// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY!, "utf8");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { mail, pass } = await req.json();

  // Supabaseでログイン
  const { data, error } = await supabase.auth.signInWithPassword({
    email: mail,
    password: pass,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // 自前JWTを発行（access + refresh）
  const accessToken = jwt.sign({ sub: data.user.id }, privateKey, {
    algorithm: "RS256",
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ sub: data.user.id }, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });

  // HttpOnlyクッキーに保存
  const response = NextResponse.json({ success: true });

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
