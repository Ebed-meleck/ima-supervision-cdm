/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { formatDate, parseQuery } from "@/lib/utils";
import api from "@/services/api";
import {Eye, MapPin, MoreHorizontal, NotepadText, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
// import { FormDetails } from "./supervison-detail";
import { FormDetailsTabs } from "./sup-detail";
import { ImaPagination } from "./paginate-ima";

const SupervisionContent: React.FC<{ form: FormSup }> = ({ form }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [pageLimit, setPageLimit] = useState({ limit: 100, page: 1 });
  const handleViewDetails = (formData: any) => {
    setSelectedForm(formData);
    setOpen(true);
  };


  const loadData = useCallback(() => {
    setLoading(true);
    const params = { searchTerm, form_id: form.form_id, ...pageLimit };
    api.get(`/forms-sup/${form.form_id}?${parseQuery(params)}`)
      .then(response => {
        setData(response.data.rows);
        setPagination(response.data.pagination);
      })
      .catch(() => {
        toast.error('Erreur lors du chargement des données du formulaire');
      })
      .finally(() => setLoading(false));
  }, [searchTerm, form.form_id, pageLimit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

    const handlePageClick = (page: { selected: number }) => {
    setPageLimit((prev) => ({...prev, page: page.selected + 1}));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <NotepadText className="h-5 w-5" />
            {form.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par Nom complet superviseur, province, zone de santé, aire de santé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            {pagination !== null && <ImaPagination pagination={pagination} handlePageClick={handlePageClick} />}
          </div>
          {loading ? (
            <div className="mt-10 flex items-center justify-center">
              <div className="text-center space-y-2">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-lg font-medium">Chargement des données...</p>
              </div>
            </div>
          ) :
            (<div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Superviseur / Collecteur</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Zone de Santé</TableHead>
                    <TableHead>Aire de Santé</TableHead>
                    <TableHead>Village / Localité</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.map((form, index) => {
                    const d = form.data;
                    const identification = d.identification || {};

                    // Nom du superviseur / collecteur
                    const superviseur =
                      identification.noms?.prenom_superviseur && identification.noms?.nom_superviseur
                        ? `${identification.noms.prenom_superviseur} ${identification.noms.nom_superviseur}`
                        : d.technique?.name_superviseur_n ||
                        d.technique?.name_reco_n ||
                        d.__system?.submitterName ||
                        "Non spécifié";

                    // Province / Zone / Aire / Village
                    const province =
                      identification.province ||
                      d["info_generales-province"] ||
                      "Non spécifié";

                    const healthZone =
                      identification.health_zone ||
                      d["info_generales-health_zone"] ||
                      "Non spécifié";

                    const healthArea =
                      identification.health_area ||
                      d["info_generales-health_area"] ||
                      "Non spécifié";

                    const village =
                      identification.village ||
                      d["ident_entrepot-avenue"] ||
                      "Non spécifié";

                    const dateVisite = d.__system?.submissionDate || d.start;

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{superviseur}</span>
                            {d.__system?.submitterName && (
                              <span className="text-sm text-muted-foreground">
                                {d.__system.submitterName}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{province}</span>
                          </div>
                        </TableCell>

                        <TableCell>{healthZone}</TableCell>
                        <TableCell>{healthArea}</TableCell>
                        <TableCell>{village}</TableCell>
                        <TableCell>{formatDate(dateVisite)}</TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(form)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les détails
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div >
            )}
        </CardContent>
      </Card>
      {selectedForm !== null && (
        <FormDetailsTabs
          open={open}
          onOpenChange={setOpen}
          record={selectedForm}
          formId={form.form_id}
        />
      )}
    </div>
  );
};

export default SupervisionContent;
