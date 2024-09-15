"use client"

import { useEffect, useState } from "react"
import Songs from "./components/Songs"
import Authorize from "./components/Authorize"
import { useRouter, useSearchParams } from "next/navigation"
import { getAccessTokenFromAuthorizeUser } from "../../lib/authenticate"

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const params = useSearchParams()
  const code  = params.get("code")
  const router = useRouter()

  

  useEffect(() => {
    const getToken = async () => {
      const storedToken = localStorage.getItem("access_token")
      if (!code) {
        return
      }

      if (storedToken) {
        setAccessToken(storedToken)
        return
      }

      const token = await getAccessTokenFromAuthorizeUser(code)
      
      if (token) {
        localStorage.setItem("access_token", token)
        setAccessToken(token)
      }
    }
    getToken()
    return () => {
      if (code) {
        router.replace("/")
      }
    }
  }, [code])


  return (
    <>
      <main className="min-h-screen mx-auto flex-col justify-between">
        <div>Music Recommender App</div>
        <p>Code: {code}</p>
        <p>Token: {accessToken}</p>
        <br />
        <div className="flex gap-2">
          <Songs token={accessToken} />
          { (!accessToken) && <Authorize />}
        </div>
      </main>
    </>
  )
}
