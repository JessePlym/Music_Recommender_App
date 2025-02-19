"use client"

import { deleteUserData } from "@/lib/server/actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import useAuth from "../hooks/useAuth"

export default function DeleteData() {
  const [message, setMessage] = useState("")
  const router = useRouter()
  const { userId } = useAuth()

  const handleClick = async () => {
    if (confirm("Are you sure?")) {
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
    <section className={`bg-slate-950 w-full z-20 mt-5 shadow-xl border border-white/80 p-10 flex flex-col gap-5 justify-start items-center`}>
      <h2 className="text-2xl">Here you can delete all data collected from you</h2>
      <button className="border border-red-600 w-fit bg-red-600 py-2 px-2 rounded hover:bg-red-500" onClick={handleClick}>Delete Your Data</button>
      <p>{message}</p>
    </section>
  )
}
