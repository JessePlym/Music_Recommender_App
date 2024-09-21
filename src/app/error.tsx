"use client"

import { useEffect } from "react"

type Props = {
  error: Error & { digest?: string },
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.log(error)
  }, [error])
  return (
    <>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => reset()}
      >
        Try Again
      </button>
    </>
  )
}
