"use client"

import Link from "next/link"
import { useState } from "react"
import { FaWrench, FaSignOutAlt } from "react-icons/fa"
import useWindowSize from "../hooks/useWindowSize"

export default function Header() {
  const [searchInput, setSearchInput] = useState("")
  const { width } = useWindowSize()

  return (
    <header className="relative bg-teal-700 text-white top-0 z-20 flex flex-col sm:flex-row justify-between items-center">
      { width > 1000 ? 
        <h1 className="mx-10 hidden lg:flex p-4">
          Music Recommender App
        </h1>
        : <h1></h1>
      }
      <nav className="mx-10 sm:w-1/2 w-5/6 flex items-center h-full justify-between">
        <form className="lg:w-1/2 w-full hidden md:block" onSubmit={e => e.preventDefault()}>
          <input
            className="text-2xl h-full p-2 rounded-lg text-black w-full focus:outline-none focus:border-1 border border-teal-500"
            type="text"
            name="search"
            value={searchInput}
            placeholder="Search"
            onChange={e => setSearchInput(e.target.value)}
          />
        </form>
        { width > 1100 ? 
          <div className="flex gap-6 items-center">
            <Link className="hover:text-slate-300" href="/">Home</Link>
            <Link href="/preferences">
              <FaWrench />
            </Link>
            <Link href="/api/auth/signout">
              <FaSignOutAlt />
            </Link>
          </div>
          : 
          <div className="flex flex-row w-full justify-between py-4">
            <Link className="hover:text-slate-300" href="/">Home</Link>
            <Link href="/preferences">
              <FaWrench />
            </Link>
            <Link href="/api/auth/signout">
              <FaSignOutAlt />
            </Link>
          </div>
          }
      </nav>
    </header>
  )
}
