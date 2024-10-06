import { HOSTNAME } from "../../../constants"

export async function getSongData(accessToken: string, artistIds: string[], userId: string) {
  let songData: Track[]

  if (accessToken) {
    try {
      const response = await fetch(`${HOSTNAME}/api/songs/song-data?id=${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(artistIds)
      })
      if (response.ok) {
        const data = await response.json()
        songData = data.tracks
        if (data.dataFromMongo) {
          return songData
        }
      } else {
        console.log(response.status)
        return null
      }

      /**
       * Add features in batches of 50 so that vercel doesn't return 504
       */

      let songsToReturn: Track[] = []

      for (let i = 0; i < songData.length; i = i + 50) {
        const partialSongData = songData.slice(i, i + 50)
        const songDataWithFeatures = await addAudioFeatures(accessToken, partialSongData, false, userId)
        songsToReturn = [...songsToReturn, ...songDataWithFeatures]
      }

      /**
       * Make one more request to save all songs to db
       */

      await addAudioFeatures(accessToken, songsToReturn, true, userId)

      return songsToReturn
    } catch (err) {
      console.log("Error while fetching data")
    }
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