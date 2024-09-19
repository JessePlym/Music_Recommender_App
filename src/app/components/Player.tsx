"use client"

import { useEffect, useState } from 'react'
import SpotifyWebPlayer from 'react-spotify-web-playback'

type Props = {
  accessToken: string,
  trackUri: string
}
export default function Player({ accessToken, trackUri}: Props) {
  const [play, setPlay] = useState(false)

  useEffect(() => setPlay(true), [trackUri])

  if (!accessToken) return null
  return (
    <SpotifyWebPlayer 
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri ? [trackUri] : "4BP3uh0hFLFRb5cjsgLqDh"}
    />
  )
}