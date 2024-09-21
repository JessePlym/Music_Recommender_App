"use client"

import { FormEvent } from "react"
import { useRouter } from "next/navigation"

const KEYS = ["C", "C#/D♭", "D", "D#/E♭", "E", "F", "F#/G♭", "G", "G#/A♭", "A", "A#/B♭", "B"]

export default function Preferences() {
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push("/")
  }
  return (
    <div className="flex justify-center">
      <main className="bg-slate-950 m-5 z-20 shadow-xl border border-white/80 p-2 flex flex-col md:w-1/2 w-full justify-center items-center">
        <h2>Select your musical preferences</h2>
        <form className="flex flex-col gap-4 mt-4 w-full items-center p-2" onSubmit={handleSubmit}>
        <div className="flex w-full justify-between">
            <label htmlFor="key">Key</label>
            <select className="text-black"  name="key" id="key">
              {
                KEYS.map((key, index) => (
                  <option key={index} value={index}>{key}</option>
                ))
              }
            </select>
          </div>
          <div className="flex w-full justify-between">
            <label htmlFor="acoustic">Acoustic</label>
            <input
              className="size-8" 
              type="checkbox"
              id="acoustic"
            />
          </div>
          <div className="flex w-full justify-between">
            <label htmlFor="dance">Dance</label>
            <input 
              className="size-8"
              type="checkbox"
              id="dance"
            />
          </div>
          <div className="flex w-full justify-between">
            <label htmlFor="tempo">Tempo</label>
            <div>
              <input 
                className="w-20 px-2 py-1 text-black"
                type="number"
                min={1}
                max={200}
                id="tempo"
              />
              <span className="ml-2">BPM</span>
            </div>
          </div>
          <div className="flex w-full justify-items-start gap-8 items-center">
            <label htmlFor="major">
              <input 
                className="size-8"
                type="radio"
                name="mode"
                value={1}
                id="major"
              />
              Major
            </label>
            <label htmlFor="minor">
              <input 
                className="size-8"
                type="radio"
                name="mode"
                value={0}
                id="minor"
                
              />
              Minor
            </label>
          </div>
          <button className="border-2 border-transparent z-20 rounded py-1 px-3 bg-teal-700 hover:bg-teal-800 w-1/6" type="submit">Save</button>
        </form>
      </main>
    </div>
  )
}
