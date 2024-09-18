import { NextRequest, NextResponse } from "next/server"

type Song = {
  songId: string
  name: string,
  artist: string,
  genre: string
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const params = url.searchParams
  const obj = Object.fromEntries(params.entries())
  return NextResponse.json(obj)
}

export async function POST(request: NextRequest) {
  const song: Song = await request.json()
  return NextResponse.json({"name": song.name, "artist": song.artist})
}