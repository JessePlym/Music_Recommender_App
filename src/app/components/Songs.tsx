"use client"

export default function Songs() {

  // const logSongs = async () => {
  //   const response = await fetch(`http://localhost:3000/api/songs/`)
      
  //   const song = await response.json()

  //   console.log(song)
  // }

  const logSongFeatures = async () => {
    const songId = "7L9vDIDuqRUJRFxI2RBK2T"
    const response = await fetch(`http://localhost:3000/api/songs/features?songId=${songId}`)
      
    const features = await response.json()

    console.log(features)
  }

  return (
    <>
      <button className="border-2 rounded-lg border-teal-700 p-2 text-lg hover:bg-teal-200" onClick={logSongFeatures}>Songs</button>
    </>
  )
}
