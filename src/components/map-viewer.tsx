"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

interface MapViewerProps {
  latitude: string
  longitude: string
  altitude?: string
  accuracy?: string
  entrepotName: string
  address: string
}

// Composant de carte chargé dynamiquement
const MapComponent = dynamic(
  async () => {
    const mod = await import("react-leaflet")
    const { MapContainer, TileLayer, Marker, Popup, useMap } = mod
    const L = (await import("leaflet")).default
    // Icône SVG personnalisée (bleu, moderne)
    const customIcon = new L.Icon({
      iconUrl:
        "data:image/svg+xml;utf8,<svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='16' cy='16' r='12' fill='%23007bff' stroke='white' stroke-width='4'/><circle cx='16' cy='16' r='5' fill='white'/></svg>",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      shadowUrl: undefined,
    })

    // Helper pour centrer dynamiquement
    function CenterMap({ lat, lng }: { lat: number; lng: number }) {
      const map = useMap()
      useEffect(() => {
        if (!isNaN(lat) && !isNaN(lng)) {
          map.setView([lat, lng], map.getZoom(), { animate: true })
        }
      }, [lat, lng, map])
      return null
    }

    // Forcer le resize quand l'onglet devient visible
    function ForceResizeOnShow() {
      const map = useMap();
      useEffect(() => {
        setTimeout(() => {
          map.invalidateSize();
        }, 250);
      }, [map]);
      return null;
    }

    return function MapComponent({
      latitude,
      longitude,
      altitude,
      accuracy,
      entrepotName,
      address,
    }: MapViewerProps) {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      const rdcCenter: [number, number] = [-4.4419, 15.2663]
      const hasCoords = !isNaN(lat) && !isNaN(lng)
      return (
        <div className="w-full h-96">
          <MapContainer
            center={hasCoords ? [lat, lng] : rdcCenter}
            zoom={hasCoords ? 15 : 6}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", borderRadius: 16 }}
            className="leaflet-container"
          >
            <ForceResizeOnShow />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hasCoords && (
              <Marker position={[lat, lng]} icon={customIcon}>
                <Popup>
                  <div className="p-2 min-w-[180px]">
                    <h3 className="font-medium text-base mb-1 text-primary">{entrepotName}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{address}</p>
                    <div className="text-xs space-y-1">
                      <div>Lat: {lat.toFixed(6)}</div>
                      <div>Lng: {lng.toFixed(6)}</div>
                      {altitude && <div>Altitude: {altitude} m</div>}
                      {accuracy && <div>Précision: {accuracy} m</div>}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
            {hasCoords && <CenterMap lat={lat} lng={lng} />}
          </MapContainer>
        </div>
      )
    }
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
        </div>
      </div>
    ),
  }
)

export function MapViewer({
  latitude,
  longitude,
  altitude,
  accuracy,
  entrepotName,
  address,
}: MapViewerProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Convertir les coordonnées en nombres
  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)

  // Vérifier si les coordonnées sont valides
  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Informations GPS</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Latitude:</span>
              <span className="ml-2 font-mono text-red-500">Non disponible</span>
            </div>
            <div>
              <span className="text-muted-foreground">Longitude:</span>
              <span className="ml-2 font-mono text-red-500">Non disponible</span>
            </div>
            {altitude && (
              <div>
                <span className="text-muted-foreground">Altitude:</span>
                <span className="ml-2">{altitude} m</span>
              </div>
            )}
            {accuracy && (
              <div>
                <span className="text-muted-foreground">Précision:</span>
                <span className="ml-2">{accuracy} m</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-96 rounded-lg overflow-hidden border">
          {isClient ? (
            <MapComponent
              latitude="0"
              longitude="0"
              altitude={altitude}
              accuracy={accuracy}
              entrepotName={entrepotName}
              address={address}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="text-lg font-medium text-muted-foreground mb-2">
            Coordonnées GPS non disponibles
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            Les coordonnées GPS ne sont pas valides pour cet entrepôt. 
            La carte affiche le centre de la République Démocratique du Congo.
          </div>
          <div className="text-xs text-muted-foreground">
            Carte fournie par OpenStreetMap • Centrée sur la RDC
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium mb-2">Informations GPS</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Latitude:</span>
            <span className="ml-2 font-mono">{lat.toFixed(6)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Longitude:</span>
            <span className="ml-2 font-mono">{lng.toFixed(6)}</span>
          </div>
          {altitude && (
            <div>
              <span className="text-muted-foreground">Altitude:</span>
              <span className="ml-2">{altitude} m</span>
            </div>
          )}
          {accuracy && (
            <div>
              <span className="text-muted-foreground">Précision:</span>
              <span className="ml-2">{accuracy} m</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-96 rounded-lg overflow-hidden border">
        {isClient ? (
          <MapComponent
            latitude={latitude}
            longitude={longitude}
            altitude={altitude}
            accuracy={accuracy}
            entrepotName={entrepotName}
            address={address}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Carte fournie par OpenStreetMap • Cliquez sur le marqueur pour plus d&apos;informations
      </div>
    </div>
  )
} 