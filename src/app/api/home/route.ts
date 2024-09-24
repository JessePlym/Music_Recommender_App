
import clientPromise from '@/lib/mongo'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("MusicDB")

    
    const data = await db.collection("songs").find({}).toArray()
    console.log("Request done")
    return NextResponse.json(data)
   
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong', error })
  }
}