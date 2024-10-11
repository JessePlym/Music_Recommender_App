export function calcRecommendedSongs(tracks: Track[], listeningHistory: Track[], avgFeatures: AverageSongFeature, userPreferences: Preference[], applyPreferences: boolean) {

  /**
   * Users own preferences override average features based on listening history
   * If applyPreferences is set to false, users' preferences are not taken into consideration
   */

  if (applyPreferences) {
    avgFeatures.mode = userPreferences[0].mode ?? avgFeatures.mode
    avgFeatures.key = userPreferences[0].key ?? avgFeatures.key
    avgFeatures.tempo = userPreferences[0].tempo ?? avgFeatures.tempo
    avgFeatures.acousticness = Number(userPreferences[0].isAcoustic ?? 0)
    avgFeatures.instrumentalness = Number(userPreferences[0].isInstrumental ?? 0)
  }
  
  const distanceMap = new Map<string, number>()
  
  for (const track of tracks) {

   /** 
    * Attributes artist, album and key must be converted to numbers between 0-1
    * if values are same the difference is 0, otherwise 1
    */

    const artistDiff = track.artist.name !== avgFeatures.artistName ? 1 : 0
    const albumDiff = track.albumName !== avgFeatures.albumName ? 1 : 0
    const keyDiff = track.features.key !== avgFeatures.key ? 1 : 0
    const modeDiff = track.features.mode !== avgFeatures.mode ? 1 : 0

    const acousticnessDiff = Math.abs(avgFeatures.acousticness - track.features.acousticness)
    const danceabilityDiff = Math.abs(avgFeatures.danceability - track.features.danceability)
    const instrumentalnessDiff = Math.abs(avgFeatures.instrumentalness - track.features.instrumentalness)
    const tempoDiff = Math.abs((avgFeatures.tempo / 200) - (track.features.tempo / 200))

    /**
     * Calculate Euclidean distance
     */
    const distance = Math.sqrt(
      Math.pow(artistDiff, 2) + 
      Math.pow(albumDiff, 2) + 
      Math.pow(modeDiff, 2) + 
      Math.pow(keyDiff, 2) + 
      Math.pow(acousticnessDiff, 2) + 
      Math.pow(danceabilityDiff, 2) + 
      Math.pow(instrumentalnessDiff, 2) +
      Math.pow(tempoDiff, 2)
    )

    distanceMap.set(track.id, distance)
    
  }

  const recommendedSongs: Track[] = []

  // find track with shortest distance helper function

  function findMostSimilar(map: Map<string, number>) {
    if (!map.size) return
    const lowestValue = Math.min(...map.values())
    for (const [key, value] of map) {
      if (value === lowestValue) {
        return key
      }
    }
    return [...map.keys()][0]
  }

  function isSongInListeningHistory(tracks: Track[], trackId: string) {
    for (const track of tracks) {
      if (track.id === trackId) {
        return true
      }
    }
    return false
  }

  /**
   * Find most similar songs to recommend
   * Number of songs to be recommended are based on user's choice
   */

  const numberOfSuggestions = applyPreferences ? userPreferences[0].suggestions ?? 5 : 5

  while (recommendedSongs.length < numberOfSuggestions && distanceMap.size !== 0) {
    const recommendedSongId = findMostSimilar(distanceMap)

    if (recommendedSongId !== undefined) {
      
      if (isSongInListeningHistory(listeningHistory, recommendedSongId)) {
        distanceMap.delete(recommendedSongId)
        continue
      }

      for (let j = 0; j < tracks.length; j++) { 
        if (tracks[j].id === recommendedSongId) {
          recommendedSongs.push(tracks[j])
          break
        }
      }
      distanceMap.delete(recommendedSongId)
    }
  }

  /**
   * Sort recommended songs array based on popularity attribute
   */

  const sortedSongs = recommendedSongs.sort((a: Track, b: Track) => b.popularity - a.popularity)

  console.log("function finished")

  return sortedSongs

}