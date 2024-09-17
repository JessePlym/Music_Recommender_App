import React from 'react'
import SpotifyWebPlayer from 'react-spotify-web-playback'

type Props = {
  accessToken: string,
  trackUri: string
}
export default function Player({ accessToken, trackUri}: Props) {
  return (
    <SpotifyWebPlayer 
      token={accessToken}
      showSaveIcon
      uris={trackUri ? [trackUri] : "4BP3uh0hFLFRb5cjsgLqDh"}
    />
  )
}