import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay'
import React, { useEffect, useRef } from 'react'

type OsmdWrapperProps = {
  xml: string | File
  time: number
  isPlaying: boolean
}

export default function OsmdWrapper({ xml, time, isPlaying }: OsmdWrapperProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null)

  useEffect(() => {
    if (!divRef.current || !xml) return

    // Initialize only once
    const osmd = new OpenSheetMusicDisplay(divRef.current, {
      autoResize: true,
      backend: 'svg',
      drawTitle: false,
      drawSubtitle: false,
      drawComposer: false,
      drawLyricist: false,
      renderSingleHorizontalStaffline: false,
    })
    osmdRef.current = osmd

    const loadAndRender = async () => {
      try {
        await osmd.load(xml)
        osmd.render()
        if (osmd.cursor) {
          osmd.cursor.show()
        }
      } catch (err) {
        console.error('Error rendering OSMD', err)
      }
    }

    loadAndRender()

    return () => {
      osmd.clear()
    }
  }, [xml])

  // NOTE: Synchronizing OSMD cursor exactly with real time requires
  // calculating the beat fractional offset based on the BPM map.
  // For the purpose of this initial integration, we've set up the container
  // and the XML render.
  
  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-white p-4">
      <div ref={divRef} className="w-full" />
    </div>
  )
}
