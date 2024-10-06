"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

type Props = {
  error: Error & { digest?: string }
}

export default function Error({ error }: Props) {
  const router = useRouter()

  useEffect(() => {
    console.log(error)
  }, [error])
  return (
    <>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => router.push("/api/auth/signin")}
      >
        Try Again
      </button>
    </>
  )
}
