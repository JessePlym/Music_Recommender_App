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
  id: string,
  name: string,
  genre?: string | null,
  artist: string,
  album?: Album,
  albumName: string,
  uri: string,
  popularity: number,
  features: Feature
}

type Preference = {
  key: number,
  isAcoustic: boolean,
  isInstrumental: boolean,
  tempo: number,
  mode: number,
}

type Feature = {
  acousticness: number,
  danceability: number,
  instrumentalness: number,
  key: number,
  mode: number,
  tempo: number
}