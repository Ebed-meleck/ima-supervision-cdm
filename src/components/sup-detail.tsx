/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import dayjs from 'dayjs';
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
  Building,
  Calendar,
  User,
  Users,
  MapPin,
  Phone
} from "lucide-react"
import { FormRecord, AnyFormData, SupervisionFormData, RecoFormData } from "@/types/forms"
import { MapViewerGoogle } from "./map-viewer-google"

interface FormDetailsProps {
  record: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
}

// Questionnaires mappings
const QUESTIONNAIRES = {
  can_sup_bcz_equateur_gc7: {
    constat_tech: {
      q2: "Existe t –il les différents documents normatifs ou les directives de la campagne ?",
      q3: "Existe t –il des Micro plans Validés des AS et de la ZS au niveau du BCZS ?",
      q4: "Le CLC Existe-t-il et fonctionnel (CR, listes de présence, etc.) ?",
      q5: "Les fonds de la campagne sont ils disponibles dans la ZS ?",
      q6: "Les ressources locales additionnelles sont elles mobilisées dans la communauté ?",
      q7: "Existe-t-il les listes de prestataires affichées au BCZ ?",
      q8: "Existe-t-il les rapports de briefing des IT/ Presi Codesa, Mobilisateurs et des RECO avec listes de présence au BCZ ?",
      q9: "Existe-t-il un plan de déploiement des superviseurs sur terrain (leur nom, axes de supervision, Coordonnés téléphoniques et date) ?",
      q10: "Existe-t-il des différents rapports de supervision ?",
      q11: "Existe-t-il un cahier ou registre de supervision au BCZ ?",
      q12: "Existe-t-il des Feed back des supervisions réalisées écrits dans ledit cahier?"
    },
    constat_com: {
      q13: "La ZS dispose-t-elle un plan de communication actualisé bien détaillé pour la campagne ?",
      q14: "Les autorités politico-administratives, leaders d'opinion sont –ils sensibilisés/informés sur le Dénombrement couplé à la distribution ?",
      q15: "Les OAC, églises, écoles, associations des jeunes, médias sont ils impliqués dans la campagne ?",
      q16: "Les supports et matériels de communication (affiches, dépliant, messages, banderoles, piles, mégaphones) sont ils utilisés dans la ZS?"
    },
    constat_log: {
      q17: "Les supports et matériels de communication (affiches, dépliant, messages, banderoles, piles, mégaphones T-shirt) sont-ils disponibles et en quantité suffisante dans la ZS?",
      q18: "Les bons de livraison + bon de réception et PV de réception des outils et intrants sont- ils disponibles et bien tenus au BCZ ?",
      q19: "Les équipements de protection individuel (EPI) sont –ils disponibles et en quantité suffisante ?",
      q20: "Le plan de distribution des outils et intrants est –il disponible et affiché au BCZ (analyser ce plan de distribution) ?",
      q21: "Les outils de collecte des données sont- ils disponibles et en quantité suffisante au BCZS (Fiches de pointage, fiches de compilation AS / BCZS, Téléphones et accessoire)"
    },
    constat_data: {
      q22: "Existe-t-il des fiches de compilation des données des AS au BCZS ?",
      q23: "Les fiches de compilation des AS sont-elles bien remplies ?",
      q24: "Les Fiches de compilation des données au niveau du BCZS sont- elles correctement tenue et à jour ?",
      q25: "Existe-t-il une base de données de dénombrement couplé à la distribution à jours au BCZS ?",
      q26: "Les données présentes dans la base sont elles équivalentes à celles des fiches de compilation transmises par les IT des AS ?",
      q27: "Les données compilées sont –elles transmises au quotidien à la DPS ?"
    }
  },
  can_super_reco_equateur_gc7: {
    technique: {
      q1_n: "Le Binôme RECO est-il présent sur terrain ?",
      q2_n: "A–t-il été formé ?",
      q3_n: "Le Binôme RECO est–il muni de la cartographie de son rayon d'action ?",
      q4_n: "Le Binôme RECO suit –il sa cartographie de son rayon d'action ?",
      q5_n: "Tous les ménages prévus sont- ils systématiquement visités, y compris les zones d'accès difficile?",
      q6_n: "Tous les ménages dénombrés –servis sont-ils systématiquement enregistrés sur le téléphone ? Vérifier 5 ménages au hasard sur téléphone.",
      q7_n: "Les fiches de pointages sont – elles correctement remplies ?",
      q8_n: "Le marquage des ménages dénombrés-servis est –il systématique.",
      q9_n: "Le point GPS a-t-il été bien collecté lors de cette activité ?",
      q10_n: "Le scannage des moustiquaires (QR code) a-t-il été bien effectué ?"
    },
    Mobilisation: {
      q10_n: "Les mobilisateurs de l'AS utilisent-ils les mégaphones pour la sensibilisation ?",
      q12_n: "Les mobilisateurs disposent-ils les messages de dénombrement - distribution et communique à la population ?",
      q13_n: "Le message délivré par le mobilisateur de l'AS est-il conforme (action, cible, bénéfice, période, stratégie de la distribution) ?",
      q14_n: "Les messages-clés en rapport avec la prévention, sont-ils délivrés aux ménages par le Binôme RECO : Objectifs, Cibles, utilisation de la MII.",
      q15_n: "Les RECO portent-ils les signes distinctifs ?"
    },
    logistique: {
      q16_n: "Les MII sont –elles en quantité suffisante ? si rupture, notez le nombre des ménages restant non dénombré et non servis par rapport à la charge journalière.",
      q17_n: "Les fiches de déploiement journalières de RECO sont-elles correctement remplies et à jour par le chef du village/avenue ?",
      q18_n: "Les téléphones et Power-Banks fonctionnent-ils normalement ?",
      q19_n: "Les équipements de protection individuel (EPI) sont –ils disponibles et en quantité suffisante ?",
      q20_n: "Les fiches de pointage et craies sont–ils en quantité suffisante ?"
    }
  },
  can_sup_as_equateur_gc7: {
    constat_tech: {
      q1: "Existe t –il les différents documents normatifs ou les directives de la campagne ?",
      q2: "Existe t-il un micro plan validé de l'AS ?",
      q3: "La cartographie pour chaque BINOME RECO est- elle disponible et affichée au niveau de l'AS?",
      q4: "La liste des villages/rues est elle affichée au niveau de l'AS",
      q5: "La liste des RECO et mobilisateurs de l'AS est-elle disponible et affichée ?",
      q6: "Existe-t-il le rapport de briefing des RECO/ Mobilisateurs avec listes de présence ?",
      q7: "Existe-t-il un plan de déploiement des RECO et de mobilisateurs de l'AS ?",
      q8: "Existent-ils les différents rapports de supervision des activités de dénombrement couplé à la distribution dans l'AS ?",
      q9: "Existe-t-il un cahier ou registre de supervision de routine à l'AS",
      q10: "Existence des Feedback des supervisions réalisées (vérifier le contenu de ce cahier)",
      q11: "Les rapports d'activités sont –ils archivés au CS",
      q12: "Les fiches de compilation des données de l'AS existent- elles et bien tenues ?",
      q13: "Les données compilées sont –elles transmises au quotidien au BCZS ?"
    },
    constat_com: {
      q15: "L'As dispose-t-il d'un chronogramme d'activité pour la communication ?",
      q16: "Les mobilisateurs disposent-ils les messages de dénombrement Couplé à la distribution et communiquent à la population?",
      q17: "Les autorités politico-administratives, leaders d'opinions sont-ils sensibilisés/informés sur le dénombrement couplé à la distribution ?",
      q18: "Les outils de communication : Affiches, dépliants, mégaphones, piles, T-shirt sont –ils en quantité suffisante"
    },
    constat_log: {
      q19: "Les bons de livraisons, réception + PV de réception des outils et intrants sont-ils disponible dans l'AS ?",
      q20: "Existe-t-il un plan de distribution des outils et intrants ? (Analyser le plan de distribution)",
      q21: "Existe t-il des fiches de stock des outils et intrants à l'AS ?",
      q22: "Les fiches de stock de différents intrants (MII, Craie, Fiche de pointage, fiche de compilations,) sont- elles tenues correctement et à jour ?",
      q23: "Les outils de collecte des données (fiche de pointage, fiche de compilation) sont –ils disponibles et en quantité suffisante ?",
      q24: "Les outils de gestions (BL, BR, PV de réception, Fiche de stock) sont –ils disponible et en quantité suffisante) ?",
      q25: "Les équipements de protection individuel (EPI) sont –ils disponibles et en quantité suffisante ?"
    }
  }
}

export function FormDetailsTabs({ record, open, onOpenChange, formId }: FormDetailsProps) {
  const data = record.data as AnyFormData

  const getValue = (obj: any, key: string) => {
    return key.split(".").reduce((acc, k) => acc?.[k], obj) ?? "Non spécifié"
  }
  function isISOFormat(dateString: string) {
  // Regex pour le format ISO 8601
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  
  // Vérifier le format ET la validité de la date
  return isoRegex.test(dateString) && dayjs(dateString).isValid();
}

  const getQuestionLabel = (sectionKey: string, questionKey: string): string => {
    const questionnaire = QUESTIONNAIRES[formId as keyof typeof QUESTIONNAIRES]
    if (questionnaire && questionnaire[sectionKey as keyof typeof questionnaire]) {
      return questionnaire[sectionKey as keyof typeof questionnaire][questionKey as keyof any] || questionKey
    }
    return questionKey
  }

  const renderStatus = (value: string | number) => {
    if (value === "oui") return <Badge className="bg-green-500 hover:bg-green-600">Oui</Badge>
    if (value === "non") return <Badge variant="destructive">Non</Badge>
    if (value === "Non spécifié") return <Badge variant="outline" className="text-gray-500">Non spécifié</Badge>
    return <span className="text-sm">{value}</span>
  }

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  const sections = (() => {
    if ("constat_com" in data) {
      const supervisionData = data as SupervisionFormData
      const sections = [
        {
          name: "Identification",
          icon: User,
          questions: [
            { key: "identification.province", label: "Province" },
            { key: "identification.health_zone", label: "Zone de santé" },
            { key: "identification.health_area", label: "Aire de santé" },
            { key: "identification.noms.prenom_superviseur", label: "Prénom du superviseur" },
            { key: "identification.noms.nom_superviseur", label: "Nom du superviseur" },
            { key: "identification.date_heure", label: "Date et heure", format: true },
          ]
        },
        {
          name: "Informations générales",
          icon: Users,
          questions: [
            { key: "information.pop_micro", label: "Population Micro Plan" },
            { key: "information.men_micro", label: "Ménages Micro plan" },
            { key: "information.nbr_as", label: "Nombre d'AS" },
            { key: "information.nom_mcz", label: "Nom de L'IT" },
            { key: "information.nbre_pers_renc", label: "Personnes rencontrées" },
          ]
        }
      ]

      if (formId !== 'can_sup_bcz_equateur_gc7' && supervisionData.constat_tech) {
        sections.push({
          name: "Constat - Technique",
          icon: Building,
          questions: Object.keys(supervisionData.constat_tech).map(k => ({ 
            key: `constat_tech.${k}`, 
            label: getQuestionLabel('constat_tech', k),
            sectionKey: 'constat_tech',
            questionKey: k
          }))
        })
      }

      sections.push({
        name: "Constat - Communication",
        icon: Phone,
        questions: Object.keys(supervisionData.constat_com).map(k => ({ 
          key: `constat_com.${k}`, 
          label: getQuestionLabel('constat_com', k),
          sectionKey: 'constat_com',
          questionKey: k
        }))
      })

      sections.push({
        name: "Constat - Logistique",
        icon: Building,
        questions: Object.keys(supervisionData.constat_log).map(k => ({ 
          key: `constat_log.${k}`, 
          label: getQuestionLabel('constat_log', k),
          sectionKey: 'constat_log',
          questionKey: k
        }))
      })

      if (formId === 'can_sup_bcz_equateur_gc7' && 'constat_data' in supervisionData) {
        sections.push({
          name: "Constat - Data",
          icon: Building,
          questions: Object.keys((supervisionData as any).constat_data).map(k => ({ 
            key: `constat_data.${k}`, 
            label: getQuestionLabel('constat_data', k),
            sectionKey: 'constat_data',
            questionKey: k
          }))
        })
      }

      if (formId === 'can_sup_bcz_equateur_gc7' && supervisionData.constat_tech) {
        sections.push({
          name: "Constat - Technique et coordination",
          icon: Building,
          questions: Object.keys(supervisionData.constat_tech).map(k => ({ 
            key: `constat_tech.${k}`, 
            label: getQuestionLabel('constat_tech', k),
            sectionKey: 'constat_tech',
            questionKey: k
          }))
        })
      }

      return sections
    } else {
      const recoData = data as RecoFormData
      return [
        {
          name: "Identification",
          icon: User,
          questions: [
            { key: "identification.province", label: "Province" },
            { key: "identification.health_zone", label: "Zone de santé" },
            { key: "identification.health_area", label: "Aire de santé" },
            { key: "identification.village", label: "Village" },
            { key: "identification.date_heure", label: "Date et heure", format: true },
          ]
        },
        {
          name: "Technique",
          icon: Building,
          questions: [
            { key: "technique.name_superviseur_n", label: "Nom du superviseur" },
            { key: "technique.name_reco_n", label: "Nom du RECO" },
            ...Object.keys(recoData.technique).filter(k => k.startsWith('q')).map(k => ({ 
              key: `technique.${k}`, 
              label: getQuestionLabel('technique', k),
              sectionKey: 'technique',
              questionKey: k
            }))
          ]
        },
        {
          name: "Mobilisation",
          icon: Users,
          questions: Object.keys(recoData.Mobilisation).map(k => ({ 
            key: `Mobilisation.${k}`, 
            label: getQuestionLabel('Mobilisation', k),
            sectionKey: 'Mobilisation',
            questionKey: k
          }))
        },
        {
          name: "Logistique",
          icon: Building,
          questions: Object.keys(recoData.logistique).map(k => ({ 
            key: `logistique.${k}`, 
            label: getQuestionLabel('logistique', k),
            sectionKey: 'logistique',
            questionKey: k
          }))
        }
      ]
    }
  })()

  const gpsCoords = "GPS_menage" in data.identification 
    ? (data as SupervisionFormData).identification.GPS_menage.coordinates 
    : (data as RecoFormData).identification.gps.coordinates

  const supervisorName = "noms" in data.identification 
    ? `${(data as SupervisionFormData).identification.noms.prenom_superviseur} ${(data as SupervisionFormData).identification.noms.nom_superviseur}`
    : (data as RecoFormData).technique.name_superviseur_n

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5 text-blue-600" />
            {record.form_name}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            <Calendar className="h-3.5 w-3.5 inline mr-1" />
            Soumis le {formatDateTime(data.__system.submissionDate)}
          </p>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="general">Informations</TabsTrigger>
            <TabsTrigger value="constats">Constats</TabsTrigger>
            <TabsTrigger value="map">Localisation</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            {sections
              .filter(s => s.name.includes("Identification") || s.name.includes("Informations générales"))
              .map((section) => (
                <Card key={section.name} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <section.icon className="h-4 w-4 text-blue-600" />
                      {section.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {section.questions.map(q => {
                      const value = getValue(data, q.key)
                      return (
                        <div key={q.key} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <span className="text-sm font-medium text-gray-700">{q.label}</span>
                          <span className="text-sm">
                            {isISOFormat(value) ? formatDateTime(value) : renderStatus(value)}
                          </span>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              ))}
            
            {data.commentaire_n && (
              <Card className="shadow-sm border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Commentaires / Actions prises</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.commentaire_n}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="constats" className="space-y-4 mt-4">
            {sections
              .filter(s => !s.name.includes("Identification") && !s.name.includes("Informations générales"))
              .map(section => (
                <Card key={section.name} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <section.icon className="h-4 w-4 text-blue-600" />
                      {section.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {section.questions.map(q => (
                      <div key={q.key} className="flex justify-between items-start gap-4 py-2.5 border-b last:border-b-0">
                        <span className="text-sm text-gray-700 flex-1">{q.label}</span>
                        <span className="flex-shrink-0">
                          {renderStatus(getValue(data, q.key))}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="map" className="space-y-4 mt-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" />
                  Carte de localisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 p-3 bg-gray-50 rounded-md space-y-1">
                  <p className="text-sm"><span className="font-medium">Superviseur:</span> {supervisorName}</p>
                  <p className="text-sm"><span className="font-medium">Lieu:</span> {getValue(data, "identification.health_area")}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Coordonnées:</span> {gpsCoords[1].toFixed(6)}, {gpsCoords[0].toFixed(6)}
                  </p>
                </div>
                <MapViewerGoogle
                  latitude={gpsCoords[1].toString()}
                  longitude={gpsCoords[0].toString()}
                  altitude={gpsCoords[2].toString()}
                  entrepotName={supervisorName}
                  address={getValue(data, "identification.health_area")}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}