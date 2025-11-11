/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Phone,
  MapPin
} from "lucide-react"
import { FormRecord, AnyFormData, SupervisionFormData, RecoFormData } from "@/types/forms"
import { formatDate } from "@/lib/utils"
import { MapViewerGoogle } from "./map-viewer-google"

interface FormDetailsProps {
  record: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
}

export function FormDetails({ record, open, onOpenChange }: FormDetailsProps) {

  const data = record.data as AnyFormData

  // Utilitaire pour récupérer les valeurs de manière sûre
  const getValue = (obj: any, key: string) => {
    return key.split(".").reduce((acc, k) => acc?.[k], obj) ?? "Non spécifié"
  }

  const renderStatus = (value: string | number) => {
    if (value === "oui") return <Badge variant="default">Oui</Badge>
    if (value === "non") return <Badge variant="destructive">Non</Badge>
    return <span>{value}</span>
  }

  // Construction dynamique des sections selon le type
  const sections = (() => {
    if ("constat_com" in data) {
      // SupervisionFormData
      return [
        {
          name: "Identification",
          questions: [
            { key: "identification.province", label: "Province" },
            { key: "identification.health_zone", label: "Zone de santé" },
            { key: "identification.health_area", label: "Aire de santé" },
            { key: "identification.noms.prenom_superviseur", label: "Prénom du superviseur" },
            { key: "identification.noms.nom_superviseur", label: "Nom du superviseur" },
            { key: "identification.date_heure", label: "Date et heure" },
          ]
        },
        {
          name: "Informations générales",
          questions: [
            { key: "information.pop_micro", label: "Population Micro Plan" },
            { key: "information.men_micro", label: "Ménages Micro plan" },
            { key: "information.nbr_as", label: "Nombre d'AS" },
            { key: "information.nom_mcz", label: "Nom du MCZ" },
            { key: "information.nbre_pers_renc", label: "Personnes rencontrées" },
          ]
        },
        {
          name: "Constat - Communication",
          questions: Object.entries((data as SupervisionFormData).constat_com).map(([k, v]) => ({ key: `constat_com.${k}`, label: `Q${k}` }))
        },
        {
          name: "Constat - Logistique",
          questions: Object.entries((data as SupervisionFormData).constat_log).map(([k, v]) => ({ key: `constat_log.${k}`, label: `Q${k}` }))
        },
        {
          name: "Constat - Technique",
          questions: Object.entries((data as SupervisionFormData)?.constat_tech).map(([k, v]) => ({ key: `constat_tech.${k}`, label: `Q${k}` })),
        }
      ]
    } else {
      // RecoFormData
      return [
        {
          name: "Identification",
          questions: [
            { key: "identification.province", label: "Province" },
            { key: "identification.health_zone", label: "Zone de santé" },
            { key: "identification.health_area", label: "Aire de santé" },
            { key: "identification.village", label: "Village" },
            { key: "identification.date_heure", label: "Date et heure" },
          ]
        },
        {
          name: "Technique",
          questions: Object.entries((data as RecoFormData).technique).map(([k, v]) => ({ key: `technique.${k}`, label: k }))
        },
        {
          name: "Mobilisation",
          questions: Object.entries((data as RecoFormData).Mobilisation).map(([k, v]) => ({ key: `Mobilisation.${k}`, label: k }))
        },
        {
          name: "Logistique",
          questions: Object.entries((data as RecoFormData).logistique).map(([k, v]) => ({ key: `logistique.${k}`, label: k }))
        }
      ]
    }
  })()

  // Coordonnées GPS dynamiques
  const gpsCoords = "GPS_menage" in data.identification 
    ? (data as SupervisionFormData).identification.GPS_menage.coordinates 
    : (data as RecoFormData).identification.gps.coordinates

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Détails du formulaire - {record.form_name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="general">Informations</TabsTrigger>
            <TabsTrigger value="constats">Constats</TabsTrigger>
            <TabsTrigger value="map">Localisation</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-2">
            {sections
              .filter(s => s.name.includes("Identification") || s.name.includes("Informations générales"))
              .map((section) => (
                <Card key={section.name}>
                  <CardHeader>
                    <CardTitle>{section.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {section.questions.map(q => (
                      <div key={q.key} className="flex justify-between py-1 border-b">
                        <span>{q.label}</span>
                        {renderStatus(getValue(data, q.key))}
                      </div>
                    ))}
                  </CardContent>
                </Card>
            ))}
          </TabsContent>

          <TabsContent value="constats" className="space-y-4 mt-2">
            {sections
              .filter(s => !s.name.includes("Identification") && !s.name.includes("Informations générales"))
              .map(section => (
                <Card key={section.name}>
                  <CardHeader>
                    <CardTitle>{section.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {section.questions.map(q => (
                      <div key={q.key} className="flex justify-between py-1 border-b">
                        <span>{q.label}</span>
                        {renderStatus(getValue(data, q.key))}
                      </div>
                    ))}
                  </CardContent>
                </Card>
            ))}
          </TabsContent>

          <TabsContent value="map" className="space-y-4 mt-2">
            <Card>
              <CardHeader>
                <CardTitle>Carte de localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <MapViewerGoogle
                  latitude={gpsCoords[1].toString()}
                  longitude={gpsCoords[0].toString()}
                  altitude={gpsCoords[2].toString()}
                  entrepotName={"noms" in data.identification 
                    ? `${(data as SupervisionFormData).identification.noms.prenom_superviseur} ${(data as SupervisionFormData).identification.noms.nom_superviseur}`
                    : (data as RecoFormData).technique.name_superviseur_n
                  }
                  address={getValue(data, "identification.health_area")}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}