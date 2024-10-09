"use client"

import Link from "next/link"
import { FaWrench, FaSignOutAlt } from "react-icons/fa"
import useWindowSize from "../hooks/useWindowSize"
import { FaTrashCan } from "react-icons/fa6"

export default function Header() {
  const { width } = useWindowSize()

  const wideScreen = width > 1100

  return ( 
    <header className="relative bg-teal-700 text-white top-0 z-20 flex flex-col sm:flex-row justify-between items-center">
      { wideScreen ? 
        <h1 className="mx-10 hidden lg:flex p-4">
          Music Recommender App
        </h1>
        : <h1></h1>
      }
      <nav className="mx-10 sm:w-1/2 w-5/6 flex items-center h-full">
        { wideScreen ? 
          <div className="flex gap-10 items-end">
            <Link className="hover:text-slate-300" href="/">
              Home
            </Link>
            <Link className="hover:text-slate-300" href="/preferences">
              Preferences
            </Link>
            <Link className="hover:text-slate-300" href="/api/auth/signout">
              Sign Out
            </Link>
            <Link className="hover:text-slate-300" href="/user-data">
              <FaTrashCan />
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
            <Link href="/user-data">
              <FaTrashCan />
            </Link>
          </div>
          }
      </nav>
    </header>
  )
}
