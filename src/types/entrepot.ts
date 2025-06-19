export interface EntrepotData {
  // Informations générales
  SubmissionDate: string;
  start: string;
  today: string;
  deviceid: string;
  startoff: string;
  
  // Agent
  'info_generales-agent_nom': string;
  'info_generales-agent_telephone': string;
  'info_generales-province': string;
  'info_generales-health_zone': string;
  'info_generales-health_area': string;
  
  // Identification entrepôt
  'ident_entrepot-type_entrepot': string;
  'ident_entrepot-coordonnees_gps-Latitude': string;
  'ident_entrepot-coordonnees_gps-Longitude': string;
  'ident_entrepot-coordonnees_gps-Altitude': string;
  'ident_entrepot-coordonnees_gps-Accuracy': string;
  'ident_entrepot-avenue': string;
  'ident_entrepot-num_maison': string;
  'ident_entrepot-proprietaire': string;
  'ident_entrepot-telephone': string;
  
  // Mensuration
  'mensuration-surface_requise': string;
  'mensuration-longueur': string;
  'mensuration-largeur': string;
  'mensuration-hauteur': string;
  'mensuration-volume_disponible': string;
  'mensuration-surface_disponible': string;
  'mensuration-info_mensuration': string;
  
  // Critères
  'criteres-bon_pavement': string;
  'criteres-palettes': string;
  'criteres-toiture': string;
  'criteres-aeration': string;
  'criteres-canalisation': string;
  'criteres-voie_principale': string;
  'criteres-acces_poids_lourd': string;
  'criteres-route_pluie': string;
  'criteres-milieu_secure': string;
  'criteres-parcelle_cloturee': string;
  'criteres-porte_fer': string;
  'criteres-extincteurs': string;
  
  // Photos
  'photos-photo_facade': string;
  'photos-photo_gauche': string;
  'photos-photo_droit': string;
  'photos-photo_arriere': string;
  'photos-photo_env': string;
  
  // Autres
  commentaires: string;
  conclusion_entrepot: string;
  
  // Métadonnées
  'meta-instanceID': string;
  'meta-instanceName': string;
  KEY: string;
  SubmitterID: string;
  SubmitterName: string;
  AttachmentsPresent: string;
  AttachmentsExpected: string;
  Status: string;
  ReviewState: string;
  DeviceID: string;
  Edits: string;
  FormVersion: string;
}

export interface PhotoData {
  name: string;
  url: string;
  description: string;
}

export interface EntrepotStats {
  total: number;
  parProvince: Record<string, number>;
  parType: Record<string, number>;
  parConclusion: Record<string, number>;
  criteresComplets: number;
  criteresIncomplets: number;
} 