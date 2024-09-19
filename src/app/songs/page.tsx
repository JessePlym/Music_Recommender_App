"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Songs() {
  const { data: session } = useSession()

    const getRecentTracks = async () => {
      if (session?.accessToken) {
        const response = await fetch("http://localhost:3000/api/songs/recent", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${session.accessToken}`
          }
        })
        const data = await response.json()
        console.log(data)
      } else {
        console.log("No token")
      }
      }
    return (
      <>
        <button onClick={getRecentTracks}>Test</button>
      </>
    )
  }
