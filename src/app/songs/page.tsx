"use client"

import { getSongData } from "@/lib/requests/getSongData"
import { getSession } from "next-auth/react"
import { useEffect } from "react"

// This is a testing page

const testArtistIds = ["2NPduAUeLVsfIauhRwuft1", "2UOVgpgiNTC6KK0vSC77aD", "3plJVWt88EqjvtuB4ZDRV3", "70cRZdQywnSFp9pnc2WTCE", "5kwthnxNdfnqGk0nL35wDC"]

export default function Songs() { 

  useEffect(() => {
    const fetchSongData = async () => {
      const session = await getSession()
      console.log(session)
      if (!session) return
      const accessToken = session.accessToken
      console.log(accessToken)
      if (accessToken) {
        const songData = await getSongData(accessToken, testArtistIds)
        console.log(songData)
      } else {
        console.log("No token")
      }
    }
    fetchSongData()
  }, [])

  return <div>
    Songs
  </div>
  }
