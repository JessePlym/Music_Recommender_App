"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Songs() {
  const {data: session} = useSession()
  const [ features, setFeatures] = useState(null)

  useEffect(() => {
    const getSongFeatures = async () => {
      const songId = "7L9vDIDuqRUJRFxI2RBK2T"
      const accessToken = session?.accessToken

      try {
        const response = await fetch(`https://api.spotify.com/v1/audio-features/${songId}`, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + accessToken
          }
        })
        if (!response.ok) return
        const data = await response.json()
        setFeatures(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    getSongFeatures()
  }, [session])

    
      
    //const features = await response.json()

    //console.log(await response.json())
    
  }
