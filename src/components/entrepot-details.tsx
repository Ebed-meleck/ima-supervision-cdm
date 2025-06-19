/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Building, 
  Ruler,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { EntrepotData, PhotoData } from "@/types/entrepot"
import { getPhotoData, formatDate } from "@/lib/utils"
import { MapViewer } from "./map-viewer"
import { MapViewerGoogle } from "./map-viewer-google"

interface EntrepotDetailsProps {
  entrepot: EntrepotData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EntrepotDetails({ entrepot, open, onOpenChange }: EntrepotDetailsProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [mapType, setMapType] = useState<'leaflet' | 'google'>('leaflet')
  const photos = getPhotoData(entrepot)

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const getCriteresStatus = (value: string) => {
    if (value === 'oui') {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    } else if (value === 'non') {
      return <XCircle className="h-4 w-4 text-red-500" />
    } else {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  // Construire l'adresse complète
  const address = `${entrepot['ident_entrepot-avenue'] || ''} ${entrepot['ident_entrepot-num_maison'] || ''}, ${entrepot['info_generales-health_area'] || ''}, ${entrepot['info_generales-health_zone'] || ''}, ${entrepot['info_generales-province'] || ''}`.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Détails de l&apos;entrepôt - {entrepot['ident_entrepot-proprietaire']}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="localisation">Localisation</TabsTrigger>
            <TabsTrigger value="criteres">Critères</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations du propriétaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Nom:</span>
                    <span>{entrepot['ident_entrepot-proprietaire'] || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Téléphone:</span>
                    <span>{entrepot['ident_entrepot-telephone'] || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Avenue:</span>
                    <span>{entrepot['ident_entrepot-avenue'] || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Numéro:</span>
                    <span>{entrepot['ident_entrepot-num_maison'] || 'Non spécifié'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mensurations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Surface requise:</span>
                    <span>{entrepot['mensuration-surface_requise'] || 'Non spécifié'} m²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Longueur:</span>
                    <span>{entrepot['mensuration-longueur'] || 'Non spécifié'} m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Largeur:</span>
                    <span>{entrepot['mensuration-largeur'] || 'Non spécifié'} m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Hauteur:</span>
                    <span>{entrepot['mensuration-hauteur'] || 'Non spécifié'} m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Volume disponible:</span>
                    <span>{entrepot['mensuration-volume_disponible'] || 'Non spécifié'} m³</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conclusion et commentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Statut:</span>
                  <Badge variant={entrepot.conclusion_entrepot === 'oui' ? 'default' : 'destructive'}>
                    {entrepot.conclusion_entrepot === 'oui' ? 'Approuvé' : 
                     entrepot.conclusion_entrepot === 'ameliorer' ? 'À améliorer' : 'Rejeté'}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Commentaires:</span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entrepot.commentaires || 'Aucun commentaire'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="localisation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Localisation
                  {/* <span className="ml-auto flex gap-2 items-center">
                    <button
                      className={`px-2 py-1 rounded text-xs font-medium border ${mapType === 'leaflet' ? 'bg-primary text-white' : 'bg-muted text-primary border-primary'}`}
                      onClick={() => setMapType('leaflet')}
                    >
                      OpenStreetMap
                    </button>
                    <button
                      className={`px-2 py-1 rounded text-xs font-medium border ${mapType === 'google' ? 'bg-primary text-white' : 'bg-muted text-primary border-primary'}`}
                      onClick={() => setMapType('google')}
                    >
                      Google Maps
                    </button>
                  </span> */}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Province:</span>
                      <span>{entrepot['info_generales-province'] || 'Non spécifié'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Zone de santé:</span>
                      <span>{entrepot['info_generales-health_zone'] || 'Non spécifié'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Aire de santé:</span>
                      <span>{entrepot['info_generales-health_area'] || 'Non spécifié'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Latitude:</span>
                      <span>{entrepot['ident_entrepot-coordonnees_gps-Latitude'] || 'Non spécifié'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Longitude:</span>
                      <span>{entrepot['ident_entrepot-coordonnees_gps-Longitude'] || 'Non spécifié'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Altitude:</span>
                      <span>{entrepot['ident_entrepot-coordonnees_gps-Altitude'] || 'Non spécifié'} m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Précision GPS:</span>
                      <span>{entrepot['ident_entrepot-coordonnees_gps-Accuracy'] || 'Non spécifié'} m</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carte interactive avec switch */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Carte de localisation</CardTitle>
              </CardHeader>
              <CardContent>
                {/* {mapType === 'leaflet' ? (
                  <MapViewer
                    latitude={entrepot['ident_entrepot-coordonnees_gps-Latitude'] || '0'}
                    longitude={entrepot['ident_entrepot-coordonnees_gps-Longitude'] || '0'}
                    altitude={entrepot['ident_entrepot-coordonnees_gps-Altitude']}
                    accuracy={entrepot['ident_entrepot-coordonnees_gps-Accuracy']}
                    entrepotName={entrepot['ident_entrepot-proprietaire'] || 'Entrepôt'}
                    address={address}
                  />
                ) : ( */}
                  <MapViewerGoogle
                    latitude={entrepot['ident_entrepot-coordonnees_gps-Latitude'] || '0'}
                    longitude={entrepot['ident_entrepot-coordonnees_gps-Longitude'] || '0'}
                    altitude={entrepot['ident_entrepot-coordonnees_gps-Altitude']}
                    accuracy={entrepot['ident_entrepot-coordonnees_gps-Accuracy']}
                    entrepotName={entrepot['ident_entrepot-proprietaire'] || 'Entrepôt'}
                    address={address}
                  />
                {/* )} */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="criteres" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Critères d&apos;évaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Bon pavement</span>
                      {getCriteresStatus(entrepot['criteres-bon_pavement'])}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Palettes</span>
                      {getCriteresStatus(entrepot['criteres-palettes'])}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Toiture</span>
                      {getCriteresStatus(entrepot['criteres-toiture'])}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Aération</span>
                      {getCriteresStatus(entrepot['criteres-aeration'])}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Canalisation</span>
                      {getCriteresStatus(entrepot['criteres-canalisation'])}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Voie principale</span>
                      {getCriteresStatus(entrepot['criteres-voie_principale'])}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Accès poids lourd</span>
                      {getCriteresStatus(entrepot['criteres-acces_poids_lourd'])}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Route pluie</span>
                      {getCriteresStatus(entrepot['criteres-route_pluie'])}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Milieu sécurisé</span>
                      {getCriteresStatus(entrepot['criteres-milieu_secure'])}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Parcelle clôturée</span>
                      {getCriteresStatus(entrepot['criteres-parcelle_cloturee'])}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Porte fer</span>
                      {getCriteresStatus(entrepot['criteres-porte_fer'])}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Extincteurs</span>
                      {getCriteresStatus(entrepot['criteres-extincteurs'])}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Photos de l&apos;entrepôt</CardTitle>
              </CardHeader>
              <CardContent>
                {photos.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                      <Image
                        width={180}
                        height={80}
                        src={photos[currentPhotoIndex].url}
                        alt={photos[currentPhotoIndex].description}
                        className="w-full h-full object-cover"
                      />
                      {photos.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2"
                            onClick={prevPhoto}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={nextPhoto}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{photos[currentPhotoIndex].name}</p>
                      <p className="text-xs text-muted-foreground">
                        {currentPhotoIndex + 1} sur {photos.length}
                      </p>
                    </div>
                    {photos.length > 1 && (
                      <div className="flex justify-center space-x-2">
                        {photos.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentPhotoIndex ? 'bg-primary' : 'bg-muted'
                            }`}
                            onClick={() => setCurrentPhotoIndex(index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune photo disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 