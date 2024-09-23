"use client"

import { useEffect, useState } from 'react'
import SpotifyWebPlayer from 'react-spotify-web-playback'

type Props = {
  accessToken: string,
  trackUri: string,
  recentTracks: (Track | undefined)[]
}
export default function Player({ accessToken, trackUri, recentTracks}: Props) {
  const [play, setPlay] = useState(false)

  useEffect(() => setPlay(true), [trackUri])

  if (!accessToken) return null

  const recentTrackUris: string[] = recentTracks.map(track => track ? track.uri : "")

  return (
    <SpotifyWebPlayer 
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state) return
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri ? [trackUri] : recentTrackUris}
    />
  )
}