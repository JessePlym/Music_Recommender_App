"use server"

import { revalidatePath } from "next/cache"

import clientPromise from "../mongo"

export async function savePreferences(preferenceData: FormData) {

  const songPreference: Preference = {
    key: 0,
    isAcoustic: false,
    isInstrumental: false,
    tempo: 0,
    mode: 0,
    apply: false
  }

  songPreference.key = Number(preferenceData.get("key"))
  songPreference.tempo = Number(preferenceData.get("tempo"))
  songPreference.isAcoustic = Boolean(preferenceData.get("acoustic"))
  songPreference.isInstrumental = Boolean(preferenceData.get("instrumental"))
  songPreference.mode = Number(preferenceData.get("mode"))

  const userId = preferenceData.get("userId")

  try {
    const client = await clientPromise
    const db = client.db("MusicDB")
    
    const collection = db.collection("preferences")
    const payload = {
      $set: {
        songPreference
      }
    }
    const filter = { id: userId}
    const options = { upsert: true}
  
    await collection.updateOne(filter, payload, options)

    revalidatePath("/preferences")

  } catch (err) {
    console.log(err)
  }

} 