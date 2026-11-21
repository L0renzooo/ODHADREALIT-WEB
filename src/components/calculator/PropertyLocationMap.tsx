import { useEffect, useMemo, useRef, useState, type RefObject } from "react"
import { divIcon, type LatLngTuple, type TileLayer as LeafletTiles, type Map as LeafletMap, type TileEvent } from "leaflet"
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { formatAddress, type Address } from "./model"

const slovakia: LatLngTuple = [48.72, 19.55]
const zoomByPrecision = { house: 17, street: 15, locality: 12, area: 9 }
const tileUrl = import.meta.env.VITE_OSM_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

const pulse = divIcon({
  className: "calc-location-pulse", iconSize: [108, 108], iconAnchor: [54, 54],
  html: '<span class="calc-pulse-waves"><i></i><i></i><b></b></span>',
})
function pin(animate: boolean) {
  return divIcon({
    className: "calc-location-pin" + (animate ? " is-arriving" : ""),
    iconSize: [30, 36], iconAnchor: [15, 36],
    html: '<i class="calc-pin-shape"><i></i></i>',
  })
}
const stillPin = pin(false), arrivingPin = pin(true)

type LocationProps = { address: Address; selection: number }
type TileImages = Map<HTMLImageElement, number>

function visibleTiles(map: LeafletMap, layer: LeafletTiles, images: TileImages) {
  if (layer.isLoading()) return "waiting"
  const view = map.getContainer().getBoundingClientRect()
  let rendered = false
  for (const [tile, zoom] of images) {
    if (zoom !== map.getZoom()) continue
    const box = tile.getBoundingClientRect()
    if (box.right <= view.left || box.left >= view.right || box.bottom <= view.top || box.top >= view.bottom) continue
    if (tile.complete && !tile.naturalWidth) return "failed"
    if (!tile.complete || !tile.classList.contains("leaflet-tile-loaded")) return "waiting"
    if (Number(tile.style.opacity || 1) < 1) return "fading"
    rendered = true
  }
  return rendered ? "ready" : "waiting"
}

function MapLocation({ address, selection, layerRef, images }: LocationProps & {
  layerRef: RefObject<LeafletTiles | null>; images: TileImages
}) {
  const map = useMap()
  const { latitude, longitude, precision, verified } = address
  const zoom = precision ? zoomByPrecision[precision] : 6
  const [phase, setPhase] = useState<"waiting" | "pulse" | "fade" | "pin" | "static">("waiting")
  useEffect(() => {
    map.stop()
    const layer = layerRef.current
    if (!layer || latitude === undefined || longitude === undefined) return
    const target: LatLngTuple = [latitude, longitude]
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const neighborhoodZoom = map.getSize().x < 500 ? 15 : 16
    let stage: "neighborhood" | "scanning" | "property" | "fading" | "pin" | "restore" | "done" = "neighborhood"
    let arrived = false
    let frame = 0, timer = 0

    function renderLocation() {
      if (!verified || !arrived || stage === "done") return
      const tiles = visibleTiles(map, layer!, images)
      if (tiles === "fading") schedule()
      if (tiles === "failed") {
        clearTimeout(timer)
        stage = "restore"
        setPhase("waiting")
        return
      }
      if (tiles !== "ready") return
      if (stage === "neighborhood") {
        stage = "scanning"
        setPhase("pulse")
        timer = window.setTimeout(() => {
          stage = "property"
          arrived = false
          map.flyTo(target, zoom, { duration: 0.85 })
        }, 3600)
      } else if (stage === "pin" || stage === "restore") {
        setPhase(stage === "restore" ? "static" : "pin")
        stage = "done"
      }
    }
    function schedule() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(renderLocation)
    }
    function onMoveEnd() {
      const expectedZoom = stage === "neighborhood" ? neighborhoodZoom : zoom
      if (map.getZoom() === expectedZoom && map.project(map.getCenter()).distanceTo(map.project(target)) < 2) {
        arrived = true
        if (stage === "property") {
          // End the scan when the camera lands, even if the close-up tiles are still in transit.
          stage = "fading"
          setPhase("fade")
          timer = window.setTimeout(() => {
            stage = "pin"
            setPhase("waiting")
            schedule()
          }, 200)
        }
      }
      schedule()
    }
    function restore() {
      clearTimeout(timer)
      stage = "restore"
      setPhase("waiting")
      map.stop().setView(target, zoom, { animate: false })
      arrived = true
      schedule()
    }
    function reduce() { if (motion.matches) restore() }

    // Let the user's camera take over if they interrupt either flight.
    function interruptFlight() {
      if (stage !== "neighborhood" && stage !== "property") return
      stage = "restore"
      arrived = true
      map.stop()
      setPhase("waiting")
      schedule()
    }
    const container = map.getContainer()
    container.addEventListener("pointerdown", interruptFlight)
    container.addEventListener("keydown", interruptFlight)
    map.on("moveend", onMoveEnd)
    layer.on("loading load tileload tileerror", schedule)
    motion.addEventListener("change", reduce)
    if (!selection || motion.matches) restore()
    else map.flyTo(target, verified ? neighborhoodZoom : zoom, { duration: 1.05 })
    return () => {
      container.removeEventListener("pointerdown", interruptFlight)
      container.removeEventListener("keydown", interruptFlight)
      map.off("moveend", onMoveEnd)
      layer.off("loading load tileload tileerror", schedule)
      motion.removeEventListener("change", reduce)
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [map, layerRef, images, latitude, longitude, verified, zoom, selection])
  if (!verified || phase === "waiting" || latitude === undefined || longitude === undefined) return null
  const scanning = phase === "pulse" || phase === "fade"
  return <Marker position={[latitude, longitude]} icon={scanning ? pulse : phase === "pin" ? arrivingPin : stillPin}
    opacity={phase === "fade" ? 0 : 1} title={formatAddress(address)} interactive={false} keyboard={false} />
}

function MapControls({ allowTouch }: { allowTouch: boolean }) {
  const map = useMap()
  useEffect(() => {
    if (allowTouch) { map.dragging.enable(); map.touchZoom.enable() }
    else { map.dragging.disable(); map.touchZoom.disable() }
  }, [map, allowTouch])
  useEffect(() => {
    let frame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => map.invalidateSize({ pan: false }))
    })
    observer.observe(map.getContainer())
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [map])
  return null
}

export default function PropertyLocationMap({ address, selection }: LocationProps) {
  const [touch, setTouch] = useState(() => window.matchMedia("(pointer: coarse)").matches)
  const [enabled, setEnabled] = useState(false)
  const [tileError, setTileError] = useState(false)
  const tiles = useRef<LeafletTiles>(null)
  const images = useMemo(() => new Map<HTMLImageElement, number>(), [])
  const tileEvents = useMemo(() => ({
    tileloadstart: ({ coords, tile }: TileEvent) => images.set(tile as HTMLImageElement, coords.z),
    tileunload: ({ tile }: TileEvent) => images.delete(tile as HTMLImageElement),
    tileerror: () => setTileError(true),
    load: () => setTileError([...images.keys()].some(tile => tile.complete && !tile.naturalWidth)),
  }), [images])
  const [initial] = useState(() => {
    const restored = selection === 0 && address.latitude !== undefined && address.longitude !== undefined
    return { center: restored ? [address.latitude!, address.longitude!] as LatLngTuple : slovakia,
      zoom: restored && address.precision ? zoomByPrecision[address.precision] : 6 }
  })
  useEffect(() => {
    const pointer = window.matchMedia("(pointer: coarse)")
    const update = () => { setTouch(pointer.matches); setEnabled(false) }
    pointer.addEventListener("change", update)
    return () => pointer.removeEventListener("change", update)
  }, [])
  const gestures = !touch || enabled
  return (
    <>
      <MapContainer center={initial.center} zoom={initial.zoom} minZoom={3} maxZoom={19}
        className="calc-location-map"
        attributionControl={false} scrollWheelZoom={false} touchZoom={gestures} dragging={gestures} tapTolerance={12}>
        <TileLayer ref={tiles} url={tileUrl} keepBuffer={1}
          updateWhenIdle updateWhenZooming={false} maxZoom={19}
          eventHandlers={tileEvents} />
        <MapControls allowTouch={gestures} />
        <MapLocation key={[selection, address.latitude, address.longitude].join("/")} address={address} selection={selection} layerRef={tiles} images={images} />
      </MapContainer>
      {touch && <button type="button" className="calc-map-toggle" aria-pressed={enabled}
        onClick={() => setEnabled(value => !value)}>
        {enabled ? "Ukončiť ovládanie" : "Ovládať mapu"}
      </button>}
      {tileError && <span role="status" className="calc-map-notice">Mapové podklady sa nepodarilo načítať.</span>}
    </>
  )
}
