"use client"

import { useSession } from "next-auth/react"

// This is a testing page


export default function Songs() {
  const { data: session } = useSession() 
  
  async function test(accessToken: string) {
    if (accessToken) {
      const response = await fetch("http://localhost:3000/api/songs/song-data", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(["2NPduAUeLVsfIauhRwuft1", "2UOVgpgiNTC6KK0vSC77aD"])
      })
      //console.log(await response.json())
    } else {
      console.log("No token")
    }
  }

  return <div>
    <button onClick={() => test(session?.accessToken ?? "")}>Test</button>
  </div>
  }
