"use client"

import { useEffect, useRef, useState } from "react"

interface AudioPlayerProps {
  audioSrc: string
  onPlayerReady?: (player: HTMLAudioElement) => void
  onLoadError?: (error: string) => void
}

export default function AudioPlayer({ audioSrc, onPlayerReady, onLoadError }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      console.log("Audio ref not available")
      return
    }

    // Only initialize once
    if (isInitialized) {
      console.log("Audio already initialized, skipping...")
      return
    }

    console.log("Setting up audio element with src:", audioSrc)
    setIsInitialized(true)

    const handleCanPlay = () => {
      console.log("Audio can play - ready to play")
      setIsLoaded(true)
      setHasError(false)
      if (onPlayerReady) {
        console.log("Calling onPlayerReady")
        onPlayerReady(audio)
      }
    }

    const handleLoadedData = () => {
      console.log("Audio loaded data")
      // Don't auto-play, let user click play button
    }

    const handleError = (e: Event) => {
      console.error("Audio loading error:", e)
      console.error("Audio error details:", (e.target as HTMLAudioElement).error)
      setHasError(true)
      if (onLoadError) {
        onLoadError("Failed to load audio file")
      }
    }

    const handleLoadStart = () => {
      console.log("Audio loading started")
    }

    const handleLoad = () => {
      console.log("Audio load event fired")
    }

    const handleCanPlayThrough = () => {
      console.log("Audio can play through")
    }

    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("loadeddata", handleLoadedData)
    audio.addEventListener("error", handleError)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("load", handleLoad)
    audio.addEventListener("canplaythrough", handleCanPlayThrough)

    // Set the src and load only once
    if (audio.src !== audioSrc) {
      audio.src = audioSrc
      console.log("Forcing audio load...")
      audio.load()
    }

    return () => {
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("loadeddata", handleLoadedData)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("load", handleLoad)
      audio.removeEventListener("canplaythrough", handleCanPlayThrough)
    }
  }, [audioSrc, onPlayerReady, onLoadError, isInitialized])

  return (
    <div>
      <audio ref={audioRef} loop preload="auto" className="hidden" />
      {hasError && (
        <div className="fixed top-4 left-4 bg-red-500 text-white p-2 rounded z-50">Error loading audio: {audioSrc}</div>
      )}
    </div>
  )
}
