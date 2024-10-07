import { HOSTNAME } from "../../../constants"

export async function getSongData(accessToken: string, artistIds: string[], userId: string) {
  let songData: Track[] = []
  let dataReceivedFromMongo: boolean = false

  if (accessToken) {

    /**
     *  fetch songs in batches of 3 artist, prevents 504 in vercel 
     */

    for (let i = 0; i < artistIds.length; i = i + 3) {

      const partialArtistIds = artistIds.slice(i, i + 3)
      let partialSongData: Track[] = []

      try {
        const response = await fetch(`${HOSTNAME}/api/songs/song-data?id=${userId}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify(partialArtistIds)
        })
        if (response.ok) {
          const data = await response.json()
          if (data.dataFromMongo) {
            dataReceivedFromMongo = true
            songData = data.tracks
            break
          }
          partialSongData = data.tracks
          songData = [...songData, ...partialSongData]

        } else {
          console.log(response.status)
        }
      } catch (err) {
        console.log("Error while fetching data")
      }
    }

    if (dataReceivedFromMongo) {
      return songData
    }

      /**
       * Add features in batches of 100
       */

    let songsToReturn: Track[] = []

    for (let i = 0; i < songData.length; i = i + 100) {
      const partialSongData = songData.slice(i, i + 100)
      const songDataWithFeatures = await addAudioFeatures(accessToken, partialSongData, false, userId)
      songsToReturn = [...songsToReturn, ...songDataWithFeatures]
    }

      /**
       * Make one more request to save all songs to db
       */

    if (songsToReturn.length !== 0) {
      await addAudioFeatures(accessToken, songsToReturn, true, userId)
    }

    return songsToReturn
    
  } else {
    console.log("No token")
  }
}

async function addAudioFeatures(accessToken: string, tracks: Track[], saveToMongo: boolean, userId: string) {
  if (accessToken) {

    const payload = saveToMongo 
      ? { tracks: tracks, saveToMongo: saveToMongo, collection: "songs", userId: userId}
      : { tracks: tracks}

    try {
      const response = await fetch(`${HOSTNAME}/api/songs/song-data/audio-features`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      })
      if (response.ok) {
        const songDataWithFeatures: Track[] = await response.json()
        return songDataWithFeatures
      } else {
        console.log(response.status)
        return tracks
      }
    } catch (err) {
      console.log("Error while fetching data")
      return tracks
    }
  } else {
    console.log("No token")
    return tracks
  }
}