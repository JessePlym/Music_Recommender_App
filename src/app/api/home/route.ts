
import clientPromise from '@/lib/mongo'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {

  const url = new URL(request.url)
  const userId: string | null = url.searchParams.get("id")

  if (!userId) {
    return NextResponse.json({ "message": "No User id provided"})
  }

  try {
    const client = await clientPromise
    const db = client.db("MusicDB")

    
    const items = await db.collection("preferences").find({ "id": userId }).toArray()
    return NextResponse.json(items[0].songPreference)
   
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong', error })
  }
}