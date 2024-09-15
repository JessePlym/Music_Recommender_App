"use client"

import { Dispatch, SetStateAction } from "react"
import { getAccessTokenFromAuthorizeUser } from "../../../lib/authenticate"

type Props = {
  code: string | null,
  token: string,
  setToken: Dispatch<SetStateAction<string>>
}


export default function Login({ code, setToken }: Props) {

  const getToken = async () => {
    if (!code) return
    setToken(await getAccessTokenFromAuthorizeUser(code))
  } 

  return (
      <button className="border-2 rounded-lg border-teal-700 p-2 text-lg hover:bg-teal-200" onClick={getToken}>Authenticate</button>
  )
}
