"use client"

import { useEffect, useRef } from "react"

interface SketchfabViewerProps {
  modelId: string
  autostart?: boolean
  transparent?: boolean
  ui_infos?: 0 | 1
  ui_controls?: 0 | 1
  ui_stop?: 0 | 1
}

export default function SketchfabViewer({
  modelId,
  autostart = true,
  transparent = true,
  ui_infos = 0,
  ui_controls = 0, // Changed from 1 to 0 to remove controls
  ui_stop = 0,
}: SketchfabViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const clientRef = useRef<any>(null)

  useEffect(() => {
    // Load the Sketchfab API script
    const script = document.createElement("script")
    script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js"
    script.async = true

    script.onload = () => {
      if (!containerRef.current) return

      // Create iframe
      const iframe = document.createElement("iframe")
      iframe.style.width = "100%"
      iframe.style.height = "100%"
      iframe.style.border = "0"
      containerRef.current.appendChild(iframe)
      iframeRef.current = iframe

      // Initialize the viewer
      const client = new (window as any).Sketchfab(iframe)

      client.init(modelId, {
        autostart,
        transparent,
        ui_infos,
        ui_controls,
        ui_stop,
        success: (api: any) => {
          clientRef.current = api
          api.start()
          api.addEventListener("viewerready", () => {
            console.log("Viewer ready")
          })
        },
        error: () => {
          console.error("Sketchfab API error")
        },
      })
    }

    document.body.appendChild(script)

    return () => {
      if (iframeRef.current && containerRef.current) {
        containerRef.current.removeChild(iframeRef.current)
      }
      document.body.removeChild(script)
    }
  }, [modelId, autostart, transparent, ui_infos, ui_controls, ui_stop])

  return <div ref={containerRef} className="w-full h-full" />
}
