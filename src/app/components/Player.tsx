"use client"

import { useEffect, useState } from 'react'
import SpotifyWebPlayer from 'react-spotify-web-playback'
import useAuth from '../hooks/useAuth'
import usePlayer from '../hooks/usePlayer'
import { useSession } from 'next-auth/react'

export default function Player() {
  const [play, setPlay] = useState(false)
  const { accessToken } = useAuth()
  const { status } = useSession()
  const { playingTrack: trackUri } = usePlayer() 

  useEffect(() => {
    setPlay(true) 
  }, [trackUri])
  
  if (!accessToken) return null

  if (status === "authenticated") {
    const player = (
      <SpotifyWebPlayer 
        token={accessToken}
        showSaveIcon
        callback={state => {
          if (state && !state.isPlaying) setPlay(false)
        }}
        play={play}
        uris={trackUri ? trackUri : []}
      />
    )

    return player
  }

  return null

}