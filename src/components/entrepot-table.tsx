"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MoreHorizontal, Eye, MapPin, Building, Phone } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { EntrepotData } from "@/types/entrepot"
import { EntrepotDetails } from "./entrepot-details"

interface EntrepotTableProps {
  data: EntrepotData[]
}

export function EntrepotTable({ data }: EntrepotTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEntrepot, setSelectedEntrepot] = useState<EntrepotData | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const filteredData = data.filter((entrepot) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      entrepot['ident_entrepot-proprietaire']?.toLowerCase().includes(searchLower) ||
      entrepot['info_generales-province']?.toLowerCase().includes(searchLower) ||
      entrepot['ident_entrepot-avenue']?.toLowerCase().includes(searchLower) ||
      entrepot['info_generales-health_zone']?.toLowerCase().includes(searchLower)
    )
  })

  const handleViewDetails = (entrepot: EntrepotData) => {
    setSelectedEntrepot(entrepot)
    setShowDetails(true)
  }

  const getStatusBadge = (conclusion: string) => {
    switch (conclusion?.toLowerCase()) {
      case 'oui':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>
      case 'ameliorer':
        return <Badge className="bg-yellow-100 text-yellow-800">À améliorer</Badge>
      case 'non':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>
      default:
        return <Badge variant="secondary">En attente</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Inventaire des Entrepôts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par propriétaire, province, avenue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Province</TableHead>
                  <TableHead>Zone de Santé</TableHead>
                  <TableHead>Aire de Santé</TableHead>
                  <TableHead>Avenue/Village</TableHead>
                  <TableHead>Visite</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Collecté par </TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((entrepot, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {entrepot['ident_entrepot-proprietaire'] || 'Non spécifié'}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {entrepot['ident_entrepot-telephone'] || 'Non spécifié'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{entrepot['info_generales-province'] || 'Non spécifié'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{entrepot['info_generales-health_zone'] || 'Non spécifié'}</TableCell>
                    <TableCell>{entrepot['info_generales-health_area'] || 'Non spécifié'}</TableCell>
                    <TableCell>{entrepot['ident_entrepot-avenue'] || 'Non spécifié'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {entrepot['ident_entrepot-type_entrepot'] || 'Non spécifié'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(entrepot.SubmissionDate)}</TableCell>
                    <TableCell>{getStatusBadge(entrepot.conclusion_entrepot)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {entrepot['info_generales-agent_nom'] || 'Non spécifié'}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {entrepot['info_generales-agent_telephone'] || 'Non spécifié'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(entrepot)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {filteredData.length} entrepôt(s) trouvé(s) sur {data.length} total
          </div>
        </CardContent>
      </Card>

      {selectedEntrepot && (
        <EntrepotDetails
          entrepot={selectedEntrepot}
          open={showDetails}
          onOpenChange={setShowDetails}
        />
      )}
    </div>
  )
} 