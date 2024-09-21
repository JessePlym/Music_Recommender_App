export async function getRecentTracks(accessToken: string): Promise<Track[]> {
  try {
    if (accessToken) {
      const response = await fetch("http://localhost:3000/api/songs/recent", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      const items = await response.json()
      const uniqueTracks: Track[] = [];
      const seenIds = new Set();
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items.forEach((item: any) => {
        if (!seenIds.has(item.track.id)) {
        seenIds.add(item.track.id);
        uniqueTracks.push({
          name: item.track.name,
          id: item.track.id,
          album: item.track.album,
          popularity: item.track.popularity,
          uri: item.track.uri
          })
        }
      })
      return uniqueTracks
      } else {
        console.log("No token")
        return []
    }
  } catch (err) {
    console.log(err)
    return []
  }
}