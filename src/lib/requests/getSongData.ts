import { HOSTNAME } from "../../../constants"

export async function getSongData(accessToken: string, artistIds: string[], userId: string) {
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
        const songData: Track[] = await response.json()
        return songData
      } else {
        console.log(response.status)
        return null
      }
    } catch (err) {
      console.log("Error while fetching data")
    }
  } else {
    console.log("No token")
  }
}