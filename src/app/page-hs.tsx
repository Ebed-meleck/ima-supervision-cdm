/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building,
  BarChart3,
  Table,
  Download,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Papa from "papaparse";
import { EntrepotTable } from "@/components/entrepot-table"
import { StatsDashboard } from "@/components/stats-dashboard"
import { EntrepotData } from "@/types/entrepot"
import { Toaster } from "@/components/ui/sonner"

export default function Home() {
  const [data, setData] = useState<EntrepotData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/fm_gc7_eq_form_identification_entrepot_mii.csv')
      const csvText = await response.text()
      
       // Utiliser PapaParse pour parser le CSV
       const { data } = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });
      setData(data as EntrepotData[])
    } catch (err) {
      setError('Erreur lors du chargement des données')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    const csvContent = [
      Object.keys(data[0] || {}).join(';'),
      ...data.map(row => Object.values(row).join(';'))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'entrepots_export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-lg font-medium">Chargement des données...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="text-lg font-medium text-red-600">{error}</p>
          <Button onClick={loadData}>Réessayer</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building className="h-8 w-8" />
              Dashboard Entrepôts IMA
            </h1>
            <p className="text-muted-foreground">
              Gestion et suivi des entrepôts de la province de l&apos;Équateur
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entrepôts</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.length}</div>
              <p className="text-xs text-muted-foreground">
                Entrepôts enregistrés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
              <Badge className="bg-green-100 text-green-800">Approuvé</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {data.filter(e => e.conclusion_entrepot === 'oui').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {((data.filter(e => e.conclusion_entrepot === 'oui').length / data.length) * 100).toFixed(1)}% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">À Améliorer</CardTitle>
              <Badge className="bg-yellow-100 text-yellow-800">À améliorer</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {data.filter(e => e.conclusion_entrepot === 'ameliorer').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {((data.filter(e => e.conclusion_entrepot === 'ameliorer').length / data.length) * 100).toFixed(1)}% du total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Tableau des données
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-4">
            <EntrepotTable data={data} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <StatsDashboard data={data} />
          </TabsContent>
        </Tabs>
      </div>
      
      <Toaster />
    </div>
  )
} 