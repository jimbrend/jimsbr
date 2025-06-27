"use client"

import { useEffect, useRef } from "react"

interface AudioVisualizerProps {
  isPlaying: boolean
}

export default function AudioVisualizer({ isPlaying }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let time = 0
    const points = 100
    const height = canvas.height / 2
    const amplitude = canvas.height / 6
    const frequency = 0.01
    const speed = 0.05

    // Animation function
    const animate = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw visualizer line
      ctx.beginPath()
      ctx.moveTo(0, height)

      // Create wave effect
      for (let i = 0; i < points; i++) {
        const x = (canvas.width / points) * i
        const y =
          height +
          Math.sin(i * frequency + time) * amplitude * (isPlaying ? 1 : 0.2) +
          Math.sin(i * frequency * 2 + time * 1.5) * (amplitude / 2) * (isPlaying ? 1 : 0.1)

        ctx.lineTo(x, y)
      }

      // Style the line
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, "rgba(255, 184, 0, 0.8)")
      gradient.addColorStop(0.5, "rgba(255, 84, 84, 0.8)")
      gradient.addColorStop(1, "rgba(255, 184, 0, 0.8)")

      ctx.strokeStyle = gradient
      ctx.lineWidth = 4
      ctx.stroke()

      // Update time
      time += isPlaying ? speed : speed / 3

      // Request next frame
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying])

  return (
    <div className="w-full h-16 mb-6 rounded-xl overflow-hidden backdrop-blur-sm bg-black/10">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
