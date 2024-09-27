"use client"

import { useEffect, useState } from 'react'
import SpotifyWebPlayer from 'react-spotify-web-playback'

type Props = {
  accessToken: string,
  trackUri: string,
  recentTracks?: Track[]
}
export default function Player({ accessToken, trackUri, recentTracks}: Props) {
  const [play, setPlay] = useState(false)
  const [recentTrackUris, setRecentTrackUris] = useState<string[]>([])

  useEffect(() => {
    setPlay(true) 
    if (recentTracks) {
      setRecentTrackUris(recentTracks.map(track => track ? track.uri : ""))
    }
  }, [trackUri, recentTracks])

  if (!accessToken) return null

  return (
    <SpotifyWebPlayer 
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri ? [trackUri] : recentTrackUris}
    />
  )
}