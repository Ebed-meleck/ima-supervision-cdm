/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function getPhotoData(entrepot: any): Array<{name: string, url: string, description: string}> {
  const photos: Array<{name: string, url: string, description: string}> = [];
  
  if (entrepot['photos-photo_facade']) {
    photos.push({
      name: 'Façade',
      url: `/media/${entrepot['photos-photo_facade']}`,
      description: 'Photo de la façade de l\'entrepôt'
    });
  }
  
  if (entrepot['photos-photo_gauche']) {
    photos.push({
      name: 'Côté gauche',
      url: `/media/${entrepot['photos-photo_gauche']}`,
      description: 'Photo du côté gauche de l\'entrepôt'
    });
  }
  
  if (entrepot['photos-photo_droit']) {
    photos.push({
      name: 'Côté droit',
      url: `/media/${entrepot['photos-photo_droit']}`,
      description: 'Photo du côté droit de l\'entrepôt'
    });
  }
  
  if (entrepot['photos-photo_arriere']) {
    photos.push({
      name: 'Arrière',
      url: `/media/${entrepot['photos-photo_arriere']}`,
      description: 'Photo de l\'arrière de l\'entrepôt'
    });
  }
  
  if (entrepot['photos-photo_env']) {
    photos.push({
      name: 'Environnement',
      url: `/media/${entrepot['photos-photo_env']}`,
      description: 'Photo de l\'environnement autour de l\'entrepôt'
    });
  }
  
  return photos;
}

export function calculateStats(data: any[]): any {
  const stats = {
    total: data.length,
    parProvince: {} as Record<string, number>,
    parType: {} as Record<string, number>,
    parConclusion: {} as Record<string, number>,
    criteresComplets: 0,
    criteresIncomplets: 0
  };

  data.forEach(entrepot => {
    // Par province
    const province = entrepot['info_generales-province'] || 'Non spécifié';
    stats.parProvince[province] = (stats.parProvince[province] || 0) + 1;

    // Par type
    const type = entrepot['ident_entrepot-type_entrepot'] || 'Non spécifié';
    stats.parType[type] = (stats.parType[type] || 0) + 1;

    // Par conclusion
    const conclusion = entrepot.conclusion_entrepot || 'Non spécifié';
    stats.parConclusion[conclusion] = (stats.parConclusion[conclusion] || 0) + 1;

    // Critères complets
    const criteres = [
      entrepot['criteres-bon_pavement'],
      entrepot['criteres-palettes'],
      entrepot['criteres-toiture'],
      entrepot['criteres-aeration'],
      entrepot['criteres-canalisation'],
      entrepot['criteres-voie_principale'],
      entrepot['criteres-acces_poids_lourd'],
      entrepot['criteres-route_pluie'],
      entrepot['criteres-milieu_secure'],
      entrepot['criteres-parcelle_cloturee'],
      entrepot['criteres-porte_fer'],
      entrepot['criteres-extincteurs']
    ];

    const criteresComplets = criteres.filter(c => c === 'oui').length;
    if (criteresComplets >= 10) {
      stats.criteresComplets++;
    } else {
      stats.criteresIncomplets++;
    }
  });

  return stats;
}

export const parseQuery = (params?: any) => params
  ? Object.entries(params)
    .map(([keys, value]) => `${keys}=${value}`)
    .join('&')
  : '';