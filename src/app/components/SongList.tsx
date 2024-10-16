import Image from "next/image"

type Props = {
  tracks: Track[] | null,
  handlePlayingTrack: (uri: string) => void
  mobile: boolean
}

export default function SongList({ tracks, handlePlayingTrack, mobile }: Props) {
  return (
    <ul className={`${mobile ? "text-sm" : "text-xl"} flex-col flex gap-2`}>
      { tracks && tracks.length > 0 && tracks.slice(0, 20).map(track => (
        <li className="flex justify-start items-center gap-2" key={track?.id}>
          <Image 
            alt="album cover"
            width={40}
            height={40}
            src={track?.album?.images[0].url ?? ""}
          />
          <div>
            <button onClick={() => handlePlayingTrack(track?.uri ?? "")}><p className="hover:text-white/80">{track?.name}</p></button>
            <p className={`${mobile ? "text-xs" : "text-base"}`}>{track?.artist.name}</p>
          </div>
        </li>
      ))}
      </ul>
  )
}
