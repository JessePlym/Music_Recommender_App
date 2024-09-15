import { getSong } from "../../../lib/getSongs"

type Props = {
  token: string
}

export default function Songs({ token }: Props) {

  const logSongs = async () => {
    const songId = "7L9vDIDuqRUJRFxI2RBK2T"
    console.log(await getSong(songId, token))
  }

  return (
    <>
      <button className="border-2 rounded-lg border-teal-700 p-2 text-lg hover:bg-teal-200" onClick={logSongs}>Songs</button>
    </>
  )
}
