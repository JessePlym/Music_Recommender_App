import clientPromise from "../mongo"

const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"

export async function getTrackFeatures(tracks: Track[], accessToken: string, userId?: string) {
  if (tracks.length === 0) return
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //const tracksWithFeatures: Track[] = tracks.map(({ album, ...rest}) => rest)
  for (const track of tracks) {
    try {
      const response = await fetch(`${SPOTIFY_DATA_SOURCE_URL}/audio-features/${track.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      if (response.ok) {
        const featureData = await response.json()
        track.features.acousticness = featureData.acousticness
        track.features.danceability = featureData.danceability
        track.features.instrumentalness = featureData.instrumentalness
        track.features.key = featureData.key
        track.features.mode = featureData.mode
        track.features.tempo = featureData.tempo
      } else if (response.status === 429) {
        console.log("Too many requests")
        break
      } else {
        console.log("Could not add features")
      }
      
    } catch (err) {
      return
    }
  }
  if (tracks.length > 10) {
    // save to db for testing

    const updatedAt = Date.now()
    
    try {
      const client = await clientPromise
      const db = client.db("MusicDB")
      
      const collection = db.collection("songs")
      const payload = {
        $set: {
          tracks,
          updatedAt
        }
      }
   
      const filter = { id: userId}
      const options = { upsert: true}
    
      await collection.updateOne(filter, payload, options)
      
    } catch (err) {
      console.log(err)
    }
  }
}