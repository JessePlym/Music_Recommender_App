type avgFeatures = {
  artist: string,
  albumName: string,
  key: number,
  acousticness: number,
  danceability: number,
  instrumentalness: number,
  mode: number,
  tempo: number
}

export function calcAvgFeaturesOfListeningHistory(tracks: Track[] | null) {

  if (!tracks) return null

  const tracklistLength = tracks.length


  const sumOfTrackFeatures = {
    totalAcousticness: 0,
    totalDanceability: 0,
    totalInstrumentalness: 0,
    totalTempo: 0
  }

  const mostCommonArtistMap: Map<string, number> = new Map()
  const mostCommonAlbumMap: Map<string, number> = new Map()
  const mostCommonKeyMap: Map<number, number> = new Map()
  const mostCommonModeMap: Map<number, number> = new Map()
  
  for (let i = 0; i < tracklistLength; i++) {
    sumOfTrackFeatures.totalAcousticness += tracks[i].features.acousticness
    sumOfTrackFeatures.totalDanceability += tracks[i].features.danceability
    sumOfTrackFeatures.totalInstrumentalness += tracks[i].features.instrumentalness
    sumOfTrackFeatures.totalTempo += tracks[i].features.tempo

  /**
    * For artist, album, mode and key, calculate the most common appearence
    * The key referenced here is a musical key of a song
    */

    const albumName = tracks[i].albumName
    const key = tracks[i].features.key
    const artist = tracks[i].artist
    const mode = tracks[i].features.mode

    mostCommonAlbumMap.set(albumName, (mostCommonAlbumMap.get(albumName) || 0) + 1)
    mostCommonKeyMap.set(key, (mostCommonKeyMap.get(key) || 0) + 1)
    mostCommonArtistMap.set(artist, (mostCommonArtistMap.get(artist) || 0) + 1)
    mostCommonModeMap.set(mode, (mostCommonModeMap.get(mode) || 0) + 1)

  }

  
  const avgFeatures: avgFeatures = {
    acousticness: sumOfTrackFeatures.totalAcousticness / tracklistLength,
    danceability: sumOfTrackFeatures.totalDanceability / tracklistLength,
    instrumentalness: sumOfTrackFeatures.totalInstrumentalness / tracklistLength,
    tempo: sumOfTrackFeatures.totalTempo / tracklistLength,
    mode: 0,
    artist: "",
    albumName: "",
    key: -1
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function findMostCommon(map: Map<any, any>) {
    let highestCount = 0
    let mostCommonKey = ""
    for (const [key, value] of map) {
      if (value > highestCount) {
        highestCount = value
        mostCommonKey = key
      }
    }
    return mostCommonKey
  }

  avgFeatures.albumName = findMostCommon(mostCommonAlbumMap)
  avgFeatures.artist = findMostCommon(mostCommonArtistMap)
  avgFeatures.key = Number(findMostCommon(mostCommonKeyMap))
  avgFeatures.mode = Number(findMostCommon(mostCommonModeMap))

  return avgFeatures
  
}