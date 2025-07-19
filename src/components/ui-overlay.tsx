"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Info, Settings } from "lucide-react"

export function UI() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-light text-white">Interactive Globe</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 left-6 z-20">
          <Card className="w-80 bg-black/20 backdrop-blur-md border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">About This Globe</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                An interactive 3D Earth visualization powered by React Three Fiber. Drag to rotate, scroll to zoom, and
                explore our beautiful planet.
              </p>
              <div className="space-y-2 text-xs text-white/60">
                <div>• Auto-rotation enabled</div>
                <div>• Real-time lighting simulation</div>
                <div>• High-resolution Earth textures</div>
                <div>• Atmospheric effects</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls Info */}
      <div className="absolute bottom-6 left-6 z-10">
        <Card className="bg-black/20 backdrop-blur-md border-white/10">
          <CardContent className="p-4">
            <div className="text-white/80 text-sm space-y-1">
              <div>🖱️ Drag to rotate</div>
              <div>🔍 Scroll to zoom</div>
              <div>🌍 Auto-rotating</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="absolute bottom-6 right-6 z-10">
        <Card className="bg-black/20 backdrop-blur-md border-white/10">
          <CardContent className="p-4">
            <div className="text-white/80 text-sm text-right space-y-1">
              <div>Earth Radius: 6,371 km</div>
              <div>Surface Area: 510M km²</div>
              <div>Oceans: 71% coverage</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
