"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { sendPreferences } from "@/lib/requests/sendPreferences"
import { useSession } from "next-auth/react"
import { getPreferences } from "@/lib/requests/getPreferences"
import useWindowSize from "../hooks/useWindowSize"

const KEYS = ["C", "C#/D♭", "D", "D#/E♭", "E", "F", "F#/G♭", "G", "G#/A♭", "A", "A#/B♭", "B"]

const initPreference: Preference = {
  key: 0,
  isAcoustic: false,
  isInstrumental: false,
  tempo: 100,
  mode: 0,
  apply: false
}

export default function Preferences() {
  const { data: session } = useSession()
  const [ preference, setPreference ] = useState<Preference>(initPreference)
  const [ buttonLabel, setButtonLabel] = useState(preference.apply ? "Don't apply" : "Apply")
  const router = useRouter()
  const { width } = useWindowSize()

  const mobile = width < 450

  useEffect(() => {
    const fetchPreferences = async () => {
      if (session?.userId) {
        const preferences = await getPreferences(session.userId)
        setButtonLabel(preferences.apply ? "Don't apply" : "Apply")
        setPreference(preferences)
      }
    }
    fetchPreferences()
  }, [session?.userId])

  const handlePreferences = () => {
    if (buttonLabel === "Apply") {
      setPreference({...preference, apply: true})
      setButtonLabel("Don't apply")
    } else {
      setPreference({...preference, apply: false})
      setButtonLabel("Apply")
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (session?.userId) {
      await sendPreferences(preference, session?.userId)
      router.push("/")
    }
  }
  return (
    <div className="flex justify-center">
      <main className={`bg-slate-950 m-5 z-20 shadow-xl border border-white/80 p-2 flex flex-col md:w-1/2 w-full justify-center items-center ${mobile && "text-2xl"}`}>
        <h2>Select your musical preferences</h2>
        <form className={`flex flex-col ${mobile ? "gap-8" : "gap-4"} mt-4 w-full items-center p-2`} onSubmit={handleSubmit}>
        <div className="flex w-full justify-between items-center">
            <label htmlFor="key">Key</label>
            <select 
              className={`text-black ${mobile && "text-3xl"}`}
              name="key"
              id="key"
              value={preference.key}
              onChange={e => setPreference({...preference, key: Number(e.target.value)})}
            >
              {
                KEYS.map((key, index) => (
                  <option key={index} value={index}>{key}</option>
                ))
              }
            </select>
          </div>
          <div className="flex w-full justify-between items-center">
            <label htmlFor="acoustic">Acoustic</label>
            <input
              className={`${mobile ? "size-12" : "size-8"}`} 
              type="checkbox"
              checked={preference.isAcoustic}
              id="acoustic"
              onChange={e => setPreference({...preference, isAcoustic: e.target.checked})}
            />
          </div>
          <div className="flex w-full justify-between items-center">
            <label htmlFor="instrumental">Instrumental</label>
            <input 
              className={`${mobile ? "size-12" : "size-8"}`} 
              type="checkbox"
              checked={preference.isInstrumental}
              id="instrumental"
              onChange={e => setPreference({...preference, isInstrumental: e.target.checked})}
            />
          </div>
          <div className="flex w-full justify-between items-center">
            <label htmlFor="tempo">Tempo</label>
            <div>
              <input 
                className={`w-20 px-2 py-1 text-black ${mobile && "text-3xl"}`}
                type="number"
                min={1}
                max={200}
                value={preference.tempo}
                id="tempo"
                onChange={e => setPreference({...preference, tempo: Number(e.target.value)})}
              />
              <span className="ml-2">BPM</span>
            </div>
          </div>
          <div className={`flex w-full ${mobile ? "justify-between" : "justify-items-start"} gap-8 items-center`}>
            <label htmlFor="major" className={`${mobile && "flex gap-2 items-center"}`}>
              <input 
                className={`${mobile ? "size-12" : "size-8"}`}
                type="radio"
                name="mode"
                value={1}
                checked={preference.mode === 1}
                id="major"
                onChange={e => setPreference({...preference, mode: Number(e.target.value)})}
              />
              Major
            </label>
            <label htmlFor="minor" className={`${mobile && "flex gap-2 items-center"}`}>
              <input 
                className={`${mobile ? "size-12" : "size-8"}`}
                type="radio"
                name="mode"
                value={0}
                checked={preference.mode === 0}
                id="minor"
                onChange={e => setPreference({...preference, mode: Number(e.target.value)})}
              />
              Minor
            </label>
          </div>
          <button className="border-2 border-transparent z-20 rounded py-2 px-5 bg-teal-700 hover:bg-teal-800 w-fit text-3xl" type="submit">Save</button>
        </form>
        <button className="border-2 border-transparent z-20 rounded py-2 px-3.5 bg-teal-700 hover:bg-teal-800 w-fit text-3xl" onClick={handlePreferences}>{buttonLabel}</button>
      </main>
    </div>
  )
}
