
import { getUserIdFromRequestParams } from '@/lib/functions/getRequestParams'
import clientPromise from '@/lib/mongo'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {

  const defaultPreferences: Preference = {
    key: 0,
    isAcoustic: false,
    isInstrumental: false,
    tempo: 100,
    mode: 0,
    suggestions: 5,
    apply: false
  }

  const userId = getUserIdFromRequestParams(request)

  if (!userId) {
    return NextResponse.json({ "message": "No User id provided"})
  }

  try {
    const client = await clientPromise
    const db = client.db("MusicDB")
    
    const items = await db.collection("preferences").find({ "id": userId }).toArray()
    if (items.length !== 0 || !items) {
      return NextResponse.json(items[0].songPreference)
    } else {
      return NextResponse.json(defaultPreferences)
    }
   
  } catch (error) {
    console.log(error)
    return NextResponse.json(defaultPreferences)
  }
}