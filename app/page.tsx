"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import SketchfabViewer from "@/components/sketchfab-viewer"
import BackgroundVisualizer from "@/components/background-visualizer"

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHoveringTechStack, setIsHoveringTechStack] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [videoAudioActive, setVideoAudioActive] = useState(false)
  const techStackRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-play the song when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
      setIsPlaying(true)
        if (videoRef.current) {
          videoRef.current.play()
        }
      }).catch((error) => {
        console.log("Auto-play failed:", error)
      })
    }
  }, [])

  // Audio event handlers for progress bar
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  // Mouse movement handler for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const togglePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.muted = true
      }
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      if (videoRef.current) {
        videoRef.current.play()
        videoRef.current.muted = true
      }
      setIsPlaying(true)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickRatio = clickX / rect.width
    const newTime = clickRatio * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleTechStackMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!techStackRef.current) return

    const rect = techStackRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setCursorPosition({ x, y })
  }

  const handleTechStackMouseEnter = () => {
    setIsHoveringTechStack(true)
  }

  const handleTechStackMouseLeave = () => {
    setIsHoveringTechStack(false)
  }

  const techStackItems = [
    { label: "Frontend", value: "Next.js 14, React, HTML Living Standard, Tailwind CSS, electron, shadcn/ui", htmlLivingStandardSmaller: true },
    { label: "Backend", value: "PHP, Drupal, SQL, Typescript, Supabase, Clerk, PostgreSQL, AWS Cloud, C++" },
    { label: "Payments", value: "Lightning Network, Stripe, BTCPayServer" },
    { label: "AI", value: "OpenAI, Claude, Grok and X's API, Browserbase, E2B, tinygrad, and more" },
    { label: "Deployment", value: "Vercel & GitHub, exploring other hosting options" },
    {
      label: "Game Development",
      value:
        "Unreal 5+, Unity CloudLua, O3DEC#, Google Extensions/Chromium, three.js, iOS + Mac, Metal, and Windows/Microsoft Store applications, Metahuman, and more",
    },
    { label: "3D/Animation", value: "Maya, ZBrush, Substance 3D Painter, Houdini, After Effects", isLarger: false },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Simple Audio Player */}
      <audio
        ref={audioRef}
        src="written-in-memory.mp3"
        loop
        autoPlay
      />

      {/* Parallax Background Image */}
      <div 
        className={`fixed inset-0 z-0 transition-all duration-1000 ${
          isPlaying ? 'opacity-30' : 'opacity-50'
        }`}
        style={{
          backgroundImage: 'url(/background-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${(mousePosition.x - 50) * 0.104}px, ${(mousePosition.y - 50) * 0.104}px)`,
          transition: 'transform 0.1s ease-out',
          filter: isPlaying ? 'brightness(1.1)' : 'brightness(0.7)'
        }}
      />

      {/* Parallax Background Video */}
      <video
        ref={videoRef}
        className={`fixed inset-0 z-0 opacity-35 transition-opacity duration-1000 object-cover ${
          isPlaying ? 'opacity-35' : 'opacity-0'
        }`}
        style={{
          left: '50%',
          top: '50%',
          width: '118vw',
          height: '118vh',
          transform: `translate(-50%, -50%) translate(${(mousePosition.x - 50) * 0.104}px, ${(mousePosition.y - 50) * 0.104}px)`,
          position: 'fixed',
          transition: 'transform 0.1s ease-out',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
        loop
        muted={true}
        playsInline
      >
        <source src="/background-video.mp4" type="video/mp4" />
      </video>

      {/* Background Visualizer */}
      <BackgroundVisualizer isPlaying={isPlaying} />

      {/* Large Scrolling Background Text */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${
          isPlaying ? 'opacity-20' : 'opacity-20'
        }`}>
          <div className={`text-white/35 font-mono text-lg md:text-xl lg:text-2xl leading-relaxed whitespace-nowrap ${
            !isPlaying ? 'animate-fade-to-deep-red' : ''
          }`}>
            {(isPlaying || !isPlaying) && (
              <>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '0s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '1s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '2s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '3s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '4s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '5s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '6s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '7s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '8s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '9s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '10s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '11s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '12s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '13s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '14s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
                <div className={`mb-4 ${isPlaying ? 'animate-scroll-left-to-right' : ''}`} style={{ animationDelay: '15s' }}>
                  01110111 01110010 01101001 01110100 01110100 01100101 01101110 00100000 01101001 01101110 00100000 01101101 01100101 01101101 01101111 01110010 01111001
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Gaussian blur background elements - reduced opacity */}
      <div className="fixed inset-0 z-0 opacity-75">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-[100px]" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/30 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[600px] h-[600px] rounded-full bg-cyan-500/30 blur-[100px]" />
      </div>

      {/* Glass container - reduced opacity */}
      <div className="container relative z-10 mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen opacity-75">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-4xl backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20"
        >
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 mb-6 opacity-80">
              Cooking up new things!
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 opacity-80">
              Including: AI Browser Operators, Shopping Assistants, Desktop Computers, e-commerce, gaming studio,
              bitcoin projects, <span
                className="cursor-pointer text-yellow-200 hover:text-yellow-400 active:text-yellow-500 transition-colors"
                onMouseEnter={() => {
                  // Do nothing on hover, only unmute on click
                }}
                onClick={() => {
                  if (videoRef.current) {
                    setVideoAudioActive(true);
                    videoRef.current.muted = false;
                    videoRef.current.currentTime = 0;
                    videoRef.current.loop = false;
                    videoRef.current.play();
                    // Pause after playing once
                    videoRef.current.onended = () => {
                      if (videoRef.current) {
                        videoRef.current.muted = true;
                        videoRef.current.loop = true;
                      }
                      setVideoAudioActive(false);
                    };
                  }
                }}
              >new media</span>, and more. If interested, just reach out on X or e-mail me
            </p>

            {/* Audio Controls - Always show, with loading state */}
            <div className="flex flex-col items-center gap-3 mb-8">
              {/* Progress Bar - classic look restored and fixed fill */}
              <div className="w-full max-w-md mx-auto mb-3 px-2">
                <div className="flex items-center justify-between text-white text-xs mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div
                  className="w-full h-3 bg-white/30 rounded-full cursor-pointer backdrop-blur-xl border border-white/20 shadow-md relative"
                  onClick={handleProgressClick}
                  style={{ minWidth: 120 }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full transition-all duration-100 shadow absolute top-0 left-0"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                {/* Volume Bar */}
                <div className="flex items-center gap-2 mt-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/></svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={audioRef.current?.volume ?? 1}
                    onChange={e => {
                      if (audioRef.current) audioRef.current.volume = parseFloat(e.target.value);
                    }}
                    className="slider w-32 h-1 bg-white/30 rounded-full appearance-none focus:outline-none"
                  />
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12c0-3.866-3.134-7-7-7m7 7c0 3.866-3.134 7-7 7m7-7H5"/></svg>
                </div>
              </div>

              {/* Now Playing and Play Button Row */}
              <div className="flex items-center gap-3">
                {/* Now Playing */}
                <div className="backdrop-blur-xl bg-white/10 rounded-full border border-white/20 px-4 py-2 overflow-hidden">
                  <div className="text-white text-sm whitespace-nowrap animate-scroll">
                    {isPlaying ? "Now Playing: Written in Memory" : "Loading: Written in Memory..."}
                  </div>
                </div>

                {/* Play Button */}
                <button
                  onClick={togglePlayPause}
                  className={`p-3 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors`}
                  aria-label="Toggle play/pause"
                >
                  {isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sketchfab Component */}
          <div className="h-[400px] mb-8 rounded-xl overflow-hidden">
            <SketchfabViewer modelId="df6e0ddf92ca44f3a0d5c4ee53ab9f31" transparent={true} ui_controls={0} />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="https://www.x.com/usernameisjim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black rounded-full text-white font-medium hover:bg-gray-800 transition-colors text-lg shadow-lg"
            >
              Message me on
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href="mailto:jim@sunbirdcomputer.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity text-lg shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              or e-mail me
            </a>
          </div>

          {/* Social Media Buttons */}
          <div className="flex flex-wrap gap-3 justify-center items-center mb-8">
            <a
              href="https://github.com/jimbrend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#333333] rounded-full text-white font-medium hover:shadow-inner hover:shadow-black/30 active:shadow-inner active:shadow-black/50 transition-all duration-200 transform hover:scale-[0.98] active:scale-95 text-sm shadow-lg hover:shadow-[#333333]/50"
              style={{ transform: 'scale(1.08)' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>

            <a
              href="https://www.instagram.com/usernameisjim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] rounded-full text-white font-medium hover:shadow-inner hover:shadow-black/30 active:shadow-inner active:shadow-black/50 transition-all duration-200 transform hover:scale-[0.98] active:scale-95 text-sm shadow-lg hover:shadow-pink-500/50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>

            <a
              href="https://www.youtube.com/@usernameisjim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF0000] rounded-full text-white font-medium hover:shadow-inner hover:shadow-black/30 active:shadow-inner active:shadow-black/50 transition-all duration-200 transform hover:scale-[0.98] active:scale-95 text-sm shadow-lg hover:shadow-red-500/50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              YouTube
            </a>

            <a
              href="https://discord.gg/82JKvBx3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] rounded-full text-white font-medium hover:shadow-inner hover:shadow-black/30 active:shadow-inner active:shadow-black/50 transition-all duration-200 transform hover:scale-[0.98] active:scale-95 text-sm shadow-lg hover:shadow-purple-500/50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
              </svg>
              Discord
            </a>

            <a
              href="https://www.twitch.tv/usernamejim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#9146FF] rounded-full text-white font-medium hover:shadow-inner hover:shadow-black/30 active:shadow-inner active:shadow-black/50 transition-all duration-200 transform hover:scale-[0.98] active:scale-95 text-sm shadow-lg hover:shadow-purple-500/50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
              Twitch
            </a>

            <a
              href="https://jimsuley.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6719] rounded-full text-white font-medium hover:shadow-inner hover:shadow-black/30 active:shadow-inner active:shadow-black/50 transition-all duration-200 transform hover:scale-[0.98] active:scale-95 text-sm shadow-lg hover:shadow-orange-500/50"
              style={{ transform: 'scale(1.08)' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Substack
            </a>

            <a
              href="https://www.linkedin.com/in/jimbrendlinger/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0077B5] rounded-full text-white font-medium hover:shadow-inner hover:shadow-black/30 active:shadow-inner active:shadow-black/50 transition-all duration-200 transform hover:scale-[0.98] active:scale-95 text-sm shadow-lg hover:shadow-[#0077B5]/50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>

            <a
              href="https://zap.stream/p/npub15jnskzcd5tga5rq2w0af0h46tf6lzkdkxjh58hewqrdglt0a0jkq9ygv88"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-900 rounded-full text-white font-medium hover:shadow-inner hover:shadow-black/30 active:shadow-inner active:shadow-black/50 transition-all duration-200 transform hover:scale-[0.98] active:scale-95 text-sm shadow-lg hover:shadow-purple-500/50 group"
              style={{ transform: 'scale(1.08)' }}
            >
              <img 
                src="/nostr.gif" 
                alt="Nostr" 
                className="w-5 h-5 group-hover:animate-pulse nostr-gif"
                style={{ animationPlayState: 'paused' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animationPlayState = 'running';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animationPlayState = 'paused';
                }}
              />
              Zap.stream
            </a>
          </div>

          {/* Tech Stack Section */}
          <div
            ref={techStackRef}
            className={`starfield-water-container rounded-2xl overflow-hidden ${isHoveringTechStack ? "water-ripple-active" : ""}`}
            onMouseMove={handleTechStackMouseMove}
            onMouseEnter={handleTechStackMouseEnter}
            onMouseLeave={handleTechStackMouseLeave}
            style={
              {
                "--cursor-x": `${cursorPosition.x}%`,
                "--cursor-y": `${cursorPosition.y}%`,
              } as React.CSSProperties
            }
          >
            <div className="tech-stack p-6 text-white text-center">
              <h2 className="text-xl font-semibold mb-6">Current Tech Stack:</h2>
              <div className="space-y-3">
                {techStackItems.map((item, index) => (
                  <div key={index} className={`tech-item ${item.isLarger ? "tech-item-large" : ""}`}>
                    <span className="tech-label text-black font-medium">{item.label}</span>
                    <span className="text-white">: {
                      item.htmlLivingStandardSmaller ? (
                        <>
                          Next.js 14, React, <span className="text-[0.9em]">HTML Living Standard</span>, Tailwind CSS, electron, shadcn/ui
                        </>
                      ) : (
                        item.value
                      )
                    }</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
