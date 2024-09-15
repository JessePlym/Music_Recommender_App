"use client"

import { Dispatch, SetStateAction } from "react"
import { getAccessToken } from "../../../lib/authenticate"

type Props = {
  token: string,
  setToken: Dispatch<SetStateAction<string>>
}


export default function Login({ setToken }: Props) {

  // const CLIENT_ID = "cf2d34dc0d5845eda598df0b031e3a01"
  // const redirectUri = "http://localhost:3000"
  // const state = generateRandomString(16)
  // const scope = "user-read-private%20user-read-email%20streaming"

  // const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`

  const getToken = async () => {
    setToken(await getAccessToken())
  } 

  return (
      <button className="border-2 rounded-lg border-teal-700 p-2 text-lg hover:bg-teal-200" onClick={getToken}>Authenticate</button>
  )
}
