"use client"

import { useEffect, useState } from "react"
import { getPreferences } from "@/lib/requests/getPreferences"
import { savePreferences } from "@/lib/server/actions"
import useWindowSize from "../hooks/useWindowSize"
import useAuth from "../hooks/useAuth"
import { useFormStatus } from "react-dom"

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
  const { userId } = useAuth()
  const [ preference, setPreference ] = useState<Preference>(initPreference)
  const { pending } = useFormStatus()
  const { width } = useWindowSize()

  const mobile = width < 450

  useEffect(() => {
    const fetchPreferences = async () => {
      if (userId) {
        const preferences = await getPreferences(userId)
        setPreference(preferences)
      }
    }
    fetchPreferences()
  }, [userId])

  return (
    <div className="flex justify-center">
      <main className={`bg-slate-950 m-5 z-20 shadow-xl border border-white/80 p-2 flex flex-col md:w-1/2 w-full justify-center items-center ${mobile && "text-2xl"}`}>
        <h2 className={`${mobile && "text-lg"}`}>Select your musical preferences</h2>
        <form className={`flex flex-col ${mobile ? "gap-8" : "gap-4"} mt-4 w-full items-center p-2`} action={savePreferences.bind(null, userId ?? "")}>
        <div className="flex w-full justify-between items-center">
            <label htmlFor="key">Key</label>
            <select 
              className={`text-black w-20 ${mobile && "text-3xl"}`}
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
            <label htmlFor="tempo">{`Tempo (BPM)`}</label>
            <input 
              className={`w-20 px-2 py-1 text-black ${mobile && "text-3xl"}`}
              type="number"
              name="tempo"
              min={1}
              max={200}
              value={preference.tempo}
              id="tempo"
              onChange={e => setPreference({...preference, tempo: Number(e.target.value)})}
            />
          </div>
          <div className="flex w-full justify-between items-center">
            <label htmlFor="acoustic">Acoustic</label>
            <input
              className={`${mobile ? "size-12" : "size-8"}`} 
              type="checkbox"
              name="acoustic"
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
              name="instrumental"
              checked={preference.isInstrumental}
              id="instrumental"
              onChange={e => setPreference({...preference, isInstrumental: e.target.checked})}
            />
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
          <div className="flex w-full justify-between items-center mt-8 mb-4">
            <label htmlFor="apply">Apply these for suggestions</label>
            <input
              className={`${mobile ? "size-12" : "size-8"}`} 
              type="checkbox"
              name="apply"
              checked={preference.apply}
              id="apply"
              onChange={e => setPreference({...preference, apply: e.target.checked})}
            />
          </div>
          <button 
            className="border-2 border-transparent z-20 rounded py-2 px-5 bg-teal-700 hover:bg-teal-800 w-fit text-3xl" 
            type="submit"
            disabled={pending}
            onClick={e => e.currentTarget.innerHTML = "Saved"}
          >
            Save
          </button>
        </form>
      </main>
    </div>
  )
}
