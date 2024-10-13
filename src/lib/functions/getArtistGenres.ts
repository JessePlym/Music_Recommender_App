const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"

export async function getArtistGenres(tracks: Track[], accessToken: string) {

  const artistIds = tracks.map(track => track.artist.id)
  const artistIdsString = artistIds.join(",")

  try {
    const response = await fetch(`${SPOTIFY_DATA_SOURCE_URL}/artists?ids=${artistIdsString}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    if (response.ok) {
      const { artists } = await response.json()
      return tracks.map(track => {
        const artistWithGenres = artists.find((artist: Artist) => artist.id === track.artist.id)
        return {...track, 
          artist: {
            ...track.artist,
            genres: [...artistWithGenres.genres]}}
      })
      }
  } catch (err) {
    console.log(err)
  }

}