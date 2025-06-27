"use client"

import type React from "react"

import { useState } from "react"
import { Volume2, VolumeX, Play, Pause, Volume1 } from "lucide-react"

interface AudioControlsProps {
  player: any
}

export default function AudioControls({ player }: AudioControlsProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState(50)

  const toggleMute = () => {
    if (!player) return

    if (isMuted) {
      player.unMute()
    } else {
      player.mute()
    }
    setIsMuted(!isMuted)
  }

  const togglePlayPause = () => {
    if (!player) return

    if (isPlaying) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return

    const newVolume = Number.parseInt(e.target.value)
    setVolume(newVolume)
    player.setVolume(newVolume)
  }

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {/* Now Playing */}
      <div className="backdrop-blur-xl bg-white/10 rounded-full border border-white/20 px-4 py-2 overflow-hidden max-w-[250px]">
        <div className="text-white text-sm whitespace-nowrap animate-scroll">Now Playing: Qveen Herby - BOB DYLAN</div>
      </div>

      {/* Audio Controls */}
      <div className="flex gap-2">
        <button
          onClick={togglePlayPause}
          className="p-3 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleMute}
          className="p-3 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
          aria-label={isMuted ? "Unmute music" : "Mute music"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 px-3 py-2">
          <Volume1 className="w-4 h-4 text-white" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  )
}
