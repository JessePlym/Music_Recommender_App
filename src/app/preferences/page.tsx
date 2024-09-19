"use client"

import { FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function Preferences() {
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push("/")
  }
  return (
    <div className="flex justify-center">
      <main className="bg-slate-950 m-5 z-20 shadow-xl border border-white/80 p-2 flex flex-col md:w-1/2 w-full justify-center items-center">
        <form className="flex flex-col gap-4 mt-4 w-full items-center p-2" onSubmit={handleSubmit}>
          <div className="flex w-full justify-between">
            <label htmlFor="preference1">Preference 1</label>
            <input
              className="size-8" 
              type="checkbox"
              id="preference1"
            />
          </div>
          <div className="flex w-full justify-between">
            <label htmlFor="preference2">Preference 2</label>
            <input 
              className="size-8"
              type="checkbox"
              id="preference2"
            />
          </div>
          <button className="border-2 border-transparent z-20 rounded py-1 px-3 bg-teal-700 hover:bg-teal-800 w-1/6" type="submit">Save</button>
        </form>
      </main>
    </div>
  )
}
