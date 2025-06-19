/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api"
import { useMemo } from "react"

interface MapViewerGoogleProps {
  latitude: string
  longitude: string
  altitude?: string
  accuracy?: string
  entrepotName: string
  address: string
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px',
}

// Coordonnées du centre de la RDC (Kinshasa)
const RDC_CENTER = { lat: -4.4419, lng: 15.2663 }

export function MapViewerGoogle({
  latitude,
  longitude,
  entrepotName,
  address,
}: MapViewerGoogleProps) {
  // Remplace cette clé par la tienne !
  const GOOGLE_MAPS_API_KEY = "AIzaSyD-AxtDoi5YRn4fGvKynAn_Xsdb6fnarv8"

  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)
  const hasCoords = !isNaN(lat) && !isNaN(lng)

  const center = useMemo(() =>
    hasCoords ? { lat, lng } : RDC_CENTER
  , [lat, lng, hasCoords])

  const { isLoaded } = useJsApiLoader({
    libraries: ['places', 'geometry', 'drawing', 'visualization'],
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    region: 'CD',
    mapIds: ['satellite']
  })

  // Icône SVG personnalisée (bleu, cercle blanc)
  const markerIcon = useMemo(() => {
    if (!isLoaded || typeof window === "undefined" || !window.google) return undefined;
    return {
      url: "data:image/svg+xml;utf8,<svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='16' cy='16' r='12' fill='%23007bff' stroke='white' stroke-width='4'/><circle cx='16' cy='16' r='5' fill='white'/></svg>",
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32),
    };
  }, [isLoaded]);

  return (
    <div className="w-full h-96">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={hasCoords ? 15 : 6}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            clickableIcons: true,
            gestureHandling: "greedy",
            mapTypeId: 'hybrid'
          }}
        >
          {hasCoords && (
            <Marker
              position={{ lat, lng }}
              // icon={markerIcon}
              title={entrepotName}
            />
          )}
        </GoogleMap>
      ) : (
        <div className="flex items-center justify-center h-full bg-muted rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Chargement de la carte Google...</p>
          </div>
        </div>
      )}
    </div>
  )
} 