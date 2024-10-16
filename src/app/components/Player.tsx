"use client"

import { useEffect, useState } from 'react'
import SpotifyWebPlayer from 'react-spotify-web-playback'
import useAuth from '../hooks/useAuth'
import usePlayer from '../hooks/usePlayer'

export default function Player() {
  const [play, setPlay] = useState(false)
  const { accessToken } = useAuth()
  const { playingTrack: trackUri } = usePlayer() 

  useEffect(() => {
    setPlay(true) 
  }, [trackUri])
  
  if (!accessToken) return null

  return (
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
}