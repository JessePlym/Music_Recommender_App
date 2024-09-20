type Album = {
  name: string,
  artists: [
    {
      name: string
    }
  ]
}

type Track = {
  name: string,
  album: Album | null,
  uri: string,
  id: string,
  popularity: number
}