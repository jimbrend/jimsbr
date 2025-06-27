"use client"

import { useEffect, useRef } from "react"

interface BackgroundVisualizerProps {
  isPlaying: boolean
  audioData?: { frequencies: Uint8Array; volume: number; bass: number; treble: number }
}

export default function BackgroundVisualizer({ isPlaying, audioData }: BackgroundVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let time = 0

    // Animation function
    const animate = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerY = canvas.height / 2
      const maxAmplitude = canvas.height / 6

      // Use gentle audio reactivity or default gentle motion
      const volume = audioData?.volume || (isPlaying ? 0.5 : 0.2)
      const bass = audioData?.bass || (isPlaying ? 0.3 : 0.1)

      // Create gentle wave layers
      const waveCount = 5
      for (let waveIndex = 0; waveIndex < waveCount; waveIndex++) {
        ctx.beginPath()
        ctx.moveTo(0, centerY)

        const points = Math.floor(canvas.width / 8)

        for (let i = 0; i <= points; i++) {
          const x = (canvas.width / points) * i

          // Gentle wave calculation
          const frequency = 0.01 + waveIndex * 0.003
          const speed = 0.03 + waveIndex * 0.008

          // Gentle amplitude that slowly moves up and down
          const amplitude = maxAmplitude * (0.3 + waveIndex * 0.1) * (0.7 + volume * 0.6)

          // Calculate gentle wave position
          const baseY =
            centerY +
            Math.sin(i * frequency + time * speed) * amplitude +
            Math.sin(i * frequency * 2 + time * speed * 1.2) * amplitude * 0.4 +
            Math.sin(i * frequency * 0.5 + time * speed * 0.8) * amplitude * 0.6

          // Add gentle bass reaction
          const bassReaction = Math.sin(time * 0.1 + i * 0.01) * bass * maxAmplitude * 0.3

          const y = baseY + bassReaction

          ctx.lineTo(x, y)
        }

        // Create gradient for each wave
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        const alpha = (0.15 - waveIndex * 0.02) * (0.8 + volume * 0.4)

        gradient.addColorStop(0, `rgba(255, 184, 0, ${alpha})`)
        gradient.addColorStop(0.3, `rgba(255, 84, 84, ${alpha * 1.2})`)
        gradient.addColorStop(0.6, `rgba(100, 200, 255, ${alpha})`)
        gradient.addColorStop(1, `rgba(255, 184, 0, ${alpha})`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = (3 - waveIndex * 0.3) * (0.8 + volume * 0.4)
        ctx.stroke()
      }

      // Add gentle particles
      if (isPlaying && volume > 0.1) {
        const particleCount = Math.floor(volume * 15)
        for (let i = 0; i < particleCount; i++) {
          const x = Math.random() * canvas.width
          const y = centerY + Math.sin(time * 0.05 + i) * maxAmplitude * volume
          const size = Math.random() * 2 + 1
          const alpha = Math.random() * 0.3 + 0.1

          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 184, 0, ${alpha})`
          ctx.fill()
        }
      }

      // Update time with gentle speed
      time += isPlaying ? 0.05 : 0.02

      // Request next frame
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, audioData])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ mixBlendMode: "screen" }} />
}
