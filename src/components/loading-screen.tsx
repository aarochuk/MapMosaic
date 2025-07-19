"use client"

import { useState, useEffect } from "react"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsLoading(false)
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600">
      <div className="text-center">
        {/* Loading spinner */}
        <div className="relative w-16 h-16 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div
            className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"
            style={{
              animationDuration: "1s",
            }}
          ></div>
        </div>

        {/* Loading text */}
        <div className="text-white text-xl font-light mb-4">Loading Globe</div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Progress percentage */}
        <div className="text-white/80 text-sm mt-2">{progress}%</div>
      </div>
    </div>
  )
}
