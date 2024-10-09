"use client"

import { deleteUserData } from "@/lib/requests/deleteAllData"
import { getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteData() {
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleClick = async () => {
    if (confirm("Are you sure?")) {
      const session = await getSession()
      const userId = session ? session?.userId : null
      if (userId) {
        const response = await deleteUserData(userId)
        setMessage(response)
        setTimeout(() => {
          router.push("api/auth/signout")
        }, 5000)
      }
    }
    
  }
  return (
    <main className={`bg-slate-950 w-5/6 z-20 mx-auto mt-5 shadow-xl border border-white/80 p-2 flex flex-col gap-5 justify-center items-center`}>
      <h2 className="text-2xl">Here you can delete all data collected from you</h2>
      <button className="border border-red-600 w-fit bg-red-600 py-2 px-2 rounded hover:bg-red-500" onClick={handleClick}>Delete Your Data</button>
      <p>{message}</p>
    </main>
  )
}
