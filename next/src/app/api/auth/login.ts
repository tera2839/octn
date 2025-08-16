import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from 'fs';

const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH!, 'utf8');

export async function POST(req: Request) {
  const {mail,pass} = await req.json();

  
}

