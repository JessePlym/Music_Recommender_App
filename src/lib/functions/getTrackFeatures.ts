const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"

export async function getTrackFeatures(tracks: Track[], accessToken: string) {
  if (tracks.length === 0) return

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
        await timeout(10)
      } else if (response.status === 429) {
        console.log("Too many requests", response)
        break
      } else {
        console.log("Could not add features")
        break
      }
      
    } catch (err) {
      console.log(err)
      break
    }
  }
  
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}