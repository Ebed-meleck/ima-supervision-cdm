"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  BarChart3,
  TrendingUp
} from "lucide-react"
import { EntrepotData } from "@/types/entrepot"
import { calculateStats } from "@/lib/utils"

interface StatsDashboardProps {
  data: EntrepotData[]
}

export function StatsDashboard({ data }: StatsDashboardProps) {
  const stats = calculateStats(data)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entrepôts</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Entrepôts enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critères Complets</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.criteresComplets}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.criteresComplets / stats.total) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Améliorer</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.criteresIncomplets}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.criteresIncomplets / stats.total) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provinces</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.parProvince).length}</div>
            <p className="text-xs text-muted-foreground">
              Provinces couvertes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Répartition par Province
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.parProvince)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([province, count]) => (
                  <div key={province} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{province}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${((count as number) / stats.total) * 100}%` }}
                        />
                      </div>
                      <Badge variant="secondary">{count as number}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rang de l&apos;entrepôt visité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.parType)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${((count as number) / stats.total) * 100}%` }}
                        />
                      </div>
                      <Badge variant="outline">{count as number}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Statut des Évaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.parConclusion).map(([conclusion, count]) => (
              <div key={conclusion} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      conclusion === 'oui' ? 'default' :
                        conclusion === 'ameliorer' ? 'secondary' : 'destructive'
                    }
                  >
                    {conclusion === 'oui' ? 'Approuvé' :
                      conclusion === 'ameliorer' ? 'À améliorer' : 'Rejeté'}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{count as number}</div>
                  <div className="text-sm text-muted-foreground">
                    {(((count as number) / stats.total) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 