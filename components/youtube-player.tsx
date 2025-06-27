"use client"

import { useEffect, useRef, useState } from "react"

interface YouTubePlayerProps {
  videoId: string
  onPlayerReady?: (player: any) => void
}

export default function YouTubePlayer({ videoId, onPlayerReady }: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<any>(null)

  useEffect(() => {
    // Load YouTube API
    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"
    script.async = true
    document.body.appendChild(script)

    // Create global callback for YouTube API
    ;(window as any).onYouTubeIframeAPIReady = () => {
      if (!playerRef.current) return

      const ytPlayer = new (window as any).YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          loop: 1,
          playlist: videoId,
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target)
            if (onPlayerReady) {
              onPlayerReady(event.target)
            }
          },
        },
      })
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [videoId, onPlayerReady])

  return (
    <div className="absolute inset-0 opacity-0 pointer-events-none">
      <div ref={playerRef} className="w-full h-full" />
    </div>
  )
}
