import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest) {
  return NextResponse.json({ "Token": req.headers.get("authorization")})
}