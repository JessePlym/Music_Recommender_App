import clientPromise from "../mongo"

export async function getTracksFromMongo(userId: string, collection: string) {
  try {
    const client = await clientPromise
    const db = client.db("MusicDB")

    const items = await db.collection(collection).find({ "id": userId}).toArray()
    const hour = 1000 * 60 * 60
    
    if (items.length > 0 && items[0].updatedAt + hour > Date.now()) {
      const tracks: Track[] = items[0].tracks
      console.log("Data retreived from " + collection + " collection\nTime left: " + ((items[0].updatedAt + hour) - Date.now()))
      return tracks
    }
    return null

  } catch (err) {
    console.log("Error while retrieving data from mongo")
    return null
  }
}