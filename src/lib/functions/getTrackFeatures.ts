const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"

type AudioFeature = {
  id: string,
  acousticness: number,
  danceability: number,
  instrumentalness: number,
  key: number,
  mode: number,
  tempo: number
}

export async function getTrackFeatures(tracks: Track[] | undefined, accessToken: string) {
  if (tracks === undefined || tracks.length === 0) return

  const trackIds = tracks.map(track => track.id)
  const trackIdsString = trackIds.join(",")

  try {
    const response = await fetch(`${SPOTIFY_DATA_SOURCE_URL}/audio-features?ids=${trackIdsString}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    if (response.ok) {
      const data = await response.json()
      const audioFeatures: AudioFeature[] = data.audio_features
      for (const feature of audioFeatures) {
        for (const track of tracks) {
          if (track.id === feature.id) {
            track.features.acousticness = feature.acousticness
            track.features.danceability = feature.danceability
            track.features.instrumentalness = feature.instrumentalness
            track.features.key = feature.key
            track.features.mode = feature.mode
            track.features.tempo = feature.tempo
          }
        }
      }
    } 
  } catch (err) {
    console.log(err)
    
  } 
}