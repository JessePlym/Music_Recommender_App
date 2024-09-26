import { HOSTNAME } from "../../../constants"

export async function getRecentTracks(accessToken: string, userId: string): Promise<Track[]> {
  try {
    if (accessToken) {
      const response = await fetch(`${HOSTNAME}/api/songs/recent?id=${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      const tracks = await response.json()
      return tracks
      } else {
        console.log("No token")
        return []
    }
  } catch (err) {
    console.log(err)
    return []
  }
}