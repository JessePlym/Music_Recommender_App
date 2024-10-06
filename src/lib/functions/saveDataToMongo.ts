import clientPromise from "../mongo"

export async function saveTracksToMongo(tracks: Track[], collection: string, userId: string) {

  if (tracks.length > 0) {
    // save to db

    const updatedAt = Date.now()
    
    try {
      const client = await clientPromise
      const db = client.db("MusicDB")
      let dbCollection
      let payload

      const expiresIn = 60 * 60 * 24
      const expireAfterSeconds = expiresIn

      if (collection === "recent") {
        dbCollection = db.collection("recent")
        payload = {
          $set: {
            tracks,
            updatedAt,
            expireAfterSeconds
          }
        }
      } else {
        dbCollection = db.collection("songs")
        payload = {
          $set: {
            tracks,
            updatedAt,
            expireAfterSeconds
          }
        }
      }
   
      const filter = { id: userId}
      const options = { upsert: true}
    
      await dbCollection.updateOne(filter, payload, options)
      
    } catch (err) {
      console.log(err)
    }
  }
}