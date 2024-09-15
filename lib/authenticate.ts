

// const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID
// const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

// export async function getAccessTokenFromAuthorizeUser(code: string) {
//   const grantType = "authorization_code"
//   const redirectUri = "http://localhost:3000"
//   const encodedString = Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")

//   try {
//     const response = await fetch("https://accounts.spotify.com/api/token", {
//       method: "POST",
//       body: new URLSearchParams({
//         code: code,
//         redirect_uri: redirectUri,
//         grant_type: grantType
//       }),
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Authorization": "Basic " + encodedString
//       }
//     })
//     if (!response.ok) return
//     const data = await response.json()
//     return data["access_token"]
//   } catch (err) {
//     console.log(err)
//   }
// }

export async function getAccessTokenFromAuthorizeUser(code: string) {
  const grantType = "authorization_code"
  const redirectUri = "http://localhost:3000"
  const encodedString = Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")

  try {
    const response = await fetch("http://localhost:3000/api/auth", {
      method: "POST",
      body: JSON.stringify({
        "code": code
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })
    if (!response.ok) return
    const data = await response.json()
    return data["token"]
  } catch (err) {
    console.log(err)
  }
}

export async function getAccessToken() {

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST"})
    if (!response.ok) return
    const data = await response.json()
    return data["token"]
  } catch (err) {
    console.log(err)
  }
}
