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

type Artist = {
  id: string,
  name: string,
  genres: string[]
}

type Track = {
  id: string,
  name: string,
  artist: Artist
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
  suggestions: number,
  apply: boolean
}

type Feature = {
  acousticness: number,
  danceability: number,
  instrumentalness: number,
  key: number,
  mode: number,
  tempo: number
}

type AverageSongFeature = {
  artistName: string,
  albumName: string
  acousticness: number,
  danceability: number,
  instrumentalness: number,
  key: number,
  mode: number,
  tempo: number
}