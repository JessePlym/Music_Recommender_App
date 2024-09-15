"use client"

import Login from "./components/Login"
import { useState } from "react"
import Songs from "./components/Songs"

export default function Home() {
  const [ token, setToken ] = useState("")



  return (
    <>
      <main className="min-h-screen mx-auto flex-col justify-between">
        <div>Music Recommender App</div>
        <p>{token}</p>
        <br />
        <div className="flex gap-2">
          <Login token={token} setToken={setToken} />
          <Songs token={token} />
        </div>
      </main>
    </>
  )
}
