"use client"

import { useEffect, useRef, useState } from "react"

interface AudioAnalyzerProps {
  audioPlayer: HTMLAudioElement | null
  onAudioData?: (data: { frequencies: Uint8Array; volume: number; bass: number; treble: number }) => void
}

export default function AudioAnalyzer({ audioPlayer, onAudioData }: AudioAnalyzerProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationRef = useRef<number>(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (!audioPlayer || !onAudioData) return

    const initializeAudioAnalysis = async () => {
      try {
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = audioContext

        // Resume audio context if it's suspended
        if (audioContext.state === 'suspended') {
          console.log("Audio context suspended, attempting to resume...")
          await audioContext.resume()
        }

        // Create analyser
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.8
        analyserRef.current = analyser

        // Create source from audio element
        const source = audioContext.createMediaElementSource(audioPlayer)
        sourceRef.current = source

        // Connect nodes
        source.connect(analyser)
        analyser.connect(audioContext.destination)

        setIsAnalyzing(true)
        console.log("Audio analysis initialized successfully")
      } catch (error) {
        console.log("Audio analysis not available, using simulated data:", error)
        setIsAnalyzing(true)
      }
    }

    // Only initialize if audio is ready
    if (audioPlayer.readyState >= 2) {
      initializeAudioAnalysis()
    } else {
      // Wait for audio to be ready
      const handleCanPlay = () => {
        initializeAudioAnalysis()
        audioPlayer.removeEventListener('canplay', handleCanPlay)
      }
      audioPlayer.addEventListener('canplay', handleCanPlay)
    }

    // Animation loop
    const analyze = () => {
      if (!analyserRef.current || !onAudioData) {
        // Use simulated data if analyzer isn't available
        simulateAudioData()
        animationRef.current = requestAnimationFrame(analyze)
        return
      }

      const frequencies = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(frequencies)

      // Calculate volume (average of all frequencies)
      const volume = frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length / 255

      // Calculate bass (low frequencies)
      const bassEnd = Math.floor(frequencies.length * 0.1)
      const bass = frequencies.slice(0, bassEnd).reduce((sum, freq) => sum + freq, 0) / bassEnd / 255

      // Calculate treble (high frequencies)
      const trebleStart = Math.floor(frequencies.length * 0.8)
      const treble =
        frequencies.slice(trebleStart).reduce((sum, freq) => sum + freq, 0) / (frequencies.length - trebleStart) / 255

      onAudioData({ frequencies, volume, bass, treble })
      animationRef.current = requestAnimationFrame(analyze)
    }

    const simulateAudioData = () => {
      const time = Date.now() * 0.001
      const frequencies = new Uint8Array(128)

      // Generate realistic-looking frequency data
      for (let i = 0; i < frequencies.length; i++) {
        const freq = i / frequencies.length
        const bass = Math.sin(time * 2 + freq * 10) * 0.5 + 0.5
        const mid = Math.sin(time * 3 + freq * 15) * 0.3 + 0.3
        const treble = Math.sin(time * 4 + freq * 20) * 0.2 + 0.2
        frequencies[i] = Math.floor((bass + mid + treble) * 255 * (!audioPlayer?.paused ? 1 : 0.1))
      }

      const volume = frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length / 255
      const bass = frequencies.slice(0, 12).reduce((sum, freq) => sum + freq, 0) / 12 / 255
      const treble = frequencies.slice(100).reduce((sum, freq) => sum + freq, 0) / 28 / 255

      onAudioData({ frequencies, volume, bass, treble })
    }

    // Start the animation loop
    analyze()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [audioPlayer, onAudioData])

  return null
}
