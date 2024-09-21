type Album = {
  name: string,
  artists: [
    {
      name: string
    }
  ],
  images: [
    {
      url: string,
      height: number,
      width: number
    }
  ]
}

type Track = {
  name: string,
  album: Album,
  uri: string,
  id: string,
  popularity: number
}

type Preference = {
  key: number,
  isAcoustic: boolean,
  isDance: boolean,
  tempo: number,
  mode: number
}