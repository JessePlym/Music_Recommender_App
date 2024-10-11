"use server"

import { revalidatePath } from "next/cache"
import { validatePreferences } from "../functions/validate"

import clientPromise from "../mongo"

export async function savePreferences(userId: string, preferenceData: FormData) {

  const songPreference: Preference = {
    key: 0,
    isAcoustic: false,
    isInstrumental: false,
    tempo: 0,
    mode: 0,
    suggestions: 5,
    apply: false
  }

  songPreference.key = Number(preferenceData.get("key"))
  songPreference.tempo = Number(preferenceData.get("tempo"))
  songPreference.isAcoustic = Boolean(preferenceData.get("acoustic"))
  songPreference.isInstrumental = Boolean(preferenceData.get("instrumental"))
  songPreference.mode = Number(preferenceData.get("mode"))
  songPreference.suggestions = Number(preferenceData.get("suggestions"))
  songPreference.apply = Boolean(preferenceData.get("apply"))

  const valid = validatePreferences(songPreference)

  if (!valid) return

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

export async function deleteUserData(userId: string) {

  let message = ""

  try {
    const client = await clientPromise
    const db = client.db("MusicDB")

    await db.collection("songs").deleteOne({ "id": userId})
    await db.collection("preferences").deleteOne({ "id": userId})

    message = "User data deleted successfully"

  } catch (err) {
    message = "Could not delete data"
  } finally {
    console.log(message)
    return message
  }
}