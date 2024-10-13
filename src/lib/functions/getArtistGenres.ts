const SPOTIFY_DATA_SOURCE_URL = "https://api.spotify.com/v1"

type Artist = {
  id: string,
  name: string,
  genres: string[]
}

export async function getArtistGenres(artists: Artist[], accessToken: string) {

  const artistIds = artists.map(artist => artist.id)
  const artistIdsString = artistIds.join(",")

  try {
    const response = await fetch(`${SPOTIFY_DATA_SOURCE_URL}/artists?ids=${artistIdsString}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    if (response.ok) {
      
    }

  } catch (err) {
    console.log(err)
  }

}