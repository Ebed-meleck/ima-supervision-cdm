'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, RefreshCw, NotebookText } from "lucide-react";
import api from "@/services/api";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import SupervisionContent from "@/components/Supervision";


export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formSup, setFormSup] = useState<FormSup[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabsValue, setTabsValue] = useState<string>('0');

  const handleTabsValueChange = (value: string) => {
    setTabsValue(value);
  };

  const fetchData = useCallback(() => {
    setLoading(true);
    api.get('/forms-sup')
      .then(response => {
        setFormSup(response.data);
        setTabsValue(response.data[0]?.form_id || '0');
      })
      .catch(() => {
        toast.error('Erreur lors du chargement des données');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building className="h-8 w-8" />
              Tableau de bord de supervision - Equateur
            </h1>
            <p className="text-muted-foreground">
              Vue d&apos;ensemble de la supervision de la CDM equateur 2025
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formSup.length > 0 && formSup.map((form) => {
            return (
              <Card key={form.form_id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{form.name}</CardTitle>
                  <NotebookText className="h-7 w-7 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{form.nbre_forms}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <Tabs value={tabsValue} onValueChange={handleTabsValueChange} className="space-y-2">
          <TabsList className="grid w-full grid-cols-3 gap-10">
            {formSup.length > 0 && formSup.map((form) => (
              <TabsTrigger key={form.form_id} value={String(form.form_id)}
              >
                {form.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {formSup.length > 0 && formSup.map((form) => (
            <TabsContent key={form.form_id} value={String(form.form_id)} className="space-y-4">
              <SupervisionContent form={form} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}