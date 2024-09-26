export function calcMostSimilarItem(tracks: Track[], avgFeatures: AverageSongFeature, userPreferences: Preference, applyPreferences: boolean) {

  /**
   * Users own preferences override average feataures based on listening history
   * If applyPreferences is set to false, users' preferences are not taken into consideration
   */

  if (applyPreferences) {
    avgFeatures.mode = userPreferences.mode ?? avgFeatures.mode
    avgFeatures.key = userPreferences.key ?? avgFeatures.key
    avgFeatures.tempo = userPreferences.tempo ?? avgFeatures.tempo
    avgFeatures.acousticness = Number(userPreferences.isAcoustic ?? 0)
    avgFeatures.instrumentalness = Number(userPreferences.isInstrumental ?? 0)
  }

  console.log(avgFeatures)
  
  const distanceMap = new Map<string, number>()
  
  for (const track of tracks) {

   /** 
    * Attributes artist, album and key must be converted to numbers between 0-1
    * if values are same the difference is 0, otherwise 1
    */

    const artistDiff = track.artist !== avgFeatures.artist ? 1 : 0
    const albumDiff = track.albumName !== avgFeatures.albumName ? 1 : 0
    const keyDiff = track.features.key !== avgFeatures.key ? 1 : 0
    const modeDiff = avgFeatures.mode !== track.features.mode ? 1 : 0

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

  // find track with shortest distance

  function findMostSimilar(map: Map<string, number>) {
    if (!map.size) return
    const lowestValue = Math.min(...map.values())
    for (const [key, value] of map) {
      if (value === lowestValue) {
        return key
      }
    }
  }

  const recommendedSongId = findMostSimilar(distanceMap)
  
  if (recommendedSongId !== undefined) {
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].id === recommendedSongId) {
        return [tracks[i]]
      }
    }
  }
  return null

}