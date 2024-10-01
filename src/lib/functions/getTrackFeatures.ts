const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"

export async function getTrackFeatures(tracks: Track[], accessToken: string) {
  if (tracks.length === 0) return
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tracksWithFeatures: Track[] = tracks.map(({ album, ...rest}) => rest)
  for (const track of tracksWithFeatures) {
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
      }

    } catch (err) {
      return
    }
  }
}