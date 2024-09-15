
export async function authenticateUser() {
  // const CLIENT_ID = "cf2d34dc0d5845eda598df0b031e3a01"
  // const redirectUri = "http://localhost:3000"
  // const state = generateRandomString(16)
  // const scope = "user-read-private%20user-read-email%20streaming"

  // const response = await fetch(`https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`)

  // if (!response.ok) return
  
  // const data = await response.text()
  // return data

}

export async function getAccessToken() {
  const CLIENT_ID = process.env.CLIENT_ID
  const CLIENT_SECRET = process.env.CLIENT_SECRET
  const grantType = "client_credentials"
  const encodedString = Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      body: new URLSearchParams({
        grant_type: grantType
      }),
      headers: {
        "Authorization": "Basic " + encodedString
      }
    })
    if (!response.ok) return
    const data = await response.json()
    return data["token"]
  } catch (err) {
    console.log(err)
  }
}
