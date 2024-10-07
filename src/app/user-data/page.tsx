"use client"

import { deleteUserData } from "@/lib/requests/deleteAllData"
import { getSession } from "next-auth/react"
import { useState } from "react"

export default function DeleteData() {
  const [message, setMessage] = useState("")

  const handleClick = async () => {
    if (confirm("Are you sure?")) {
      const session = await getSession()
      const userId = session ? session?.userId : null
      if (userId) {
        const response = await deleteUserData(userId)
        setMessage(response)
      }
    }
    
  }
  return (
    <main className={`bg-slate-950 w-5/6 z-20 mx-auto mt-5 shadow-xl border border-white/80 p-2 flex flex-col gap-5 justify-center items-center`}>
      <h2>Here you can delete all data collected from you</h2>
      <button className="border border-red-600 w-fit bg-red-600 py-2 px-2 rounded" onClick={handleClick}>Delete Your Data</button>
      <p>{message}</p>
    </main>
  )
}
