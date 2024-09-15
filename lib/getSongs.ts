export async function getSong(id: string, token: string) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    if (!response.ok) return
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

export async function getSongs(token: string) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    if (!response.ok) return
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}