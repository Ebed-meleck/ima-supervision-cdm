# Dashboard Entrepôts IMA - Province de l'Équateur

Une application moderne de gestion et de suivi des entrepôts développée avec Next.js, React, TypeScript, Tailwind CSS et shadcn/ui.

## 🚀 Fonctionnalités

### 📊 Tableau de Bord Statistiques
- **Vue d'ensemble** : Total des entrepôts, répartition par statut
- **Statistiques détaillées** : Répartition par province, type d'entrepôt, critères d'évaluation
- **Graphiques visuels** : Barres de progression pour chaque catégorie
- **Métriques en temps réel** : Calculs automatiques des pourcentages

### 📋 Tableau des Données
- **Recherche avancée** : Filtrage par propriétaire, province, avenue, zone de santé
- **Affichage structuré** : Informations clés en un coup d'œil
- **Statuts visuels** : Badges colorés pour les différents états (Approuvé, À améliorer, Rejeté)
- **Actions rapides** : Menu contextuel pour chaque entrée

### 🔍 Détails Complets
- **Informations générales** : Propriétaire, coordonnées, mensurations
- **Localisation GPS** : Coordonnées précises avec altitude et précision
- **Critères d'évaluation** : 12 critères avec indicateurs visuels (✅ ❌ ⚠️)
- **Carrousel de photos** : Navigation intuitive entre les 5 photos par entrepôt
  - Façade
  - Côté gauche
  - Côté droit
  - Arrière
  - Environnement

### 📱 Interface Utilisateur
- **Design responsive** : Optimisé pour desktop, tablette et mobile
- **Navigation intuitive** : Onglets pour organiser l'information
- **Thème moderne** : Interface claire et professionnelle
- **Accessibilité** : Respect des standards d'accessibilité

## 🛠️ Technologies Utilisées

- **Framework** : Next.js 14 avec App Router
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **UI Components** : shadcn/ui
- **Icônes** : Lucide React
- **Parsing CSV** : Parser natif JavaScript
- **Notifications** : Sonner (Toast notifications)

## 📁 Structure du Projet

```
entrepot-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx          # Page principale
│   ├── components/
│   │   ├── ui/               # Composants shadcn/ui
│   │   ├── entrepot-table.tsx    # Tableau principal
│   │   ├── entrepot-details.tsx  # Modal de détails
│   │   └── stats-dashboard.tsx   # Dashboard statistiques
│   ├── types/
│   │   └── entrepot.ts       # Types TypeScript
│   └── lib/
│       └── utils.ts          # Fonctions utilitaires
├── public/
│   └── fm_gc7_eq_form_identification_entrepot_mii.csv
└── README.md
```

## 🚀 Installation et Démarrage

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd entrepot-dashboard
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir l'application**
   Naviguez vers [http://localhost:3000](http://localhost:3000)

## 📊 Structure des Données

L'application traite un fichier CSV contenant les informations suivantes :

### Informations Générales
- Date de soumission
- Informations de l'agent (nom, téléphone)
- Localisation (province, zone de santé, aire de santé)

### Identification Entrepôt
- Type d'entrepôt (premier, deuxième, troisième)
- Coordonnées GPS (latitude, longitude, altitude, précision)
- Adresse (avenue, numéro de maison)
- Propriétaire et téléphone

### Mensurations
- Surface requise, longueur, largeur, hauteur
- Volume et surface disponibles

### Critères d'Évaluation (12 critères)
- Bon pavement, palettes, toiture
- Aération, canalisation, voie principale
- Accès poids lourd, route pluie
- Milieu sécurisé, parcelle clôturée
- Porte fer, extincteurs

### Photos
- 5 photos par entrepôt (façade, côtés, arrière, environnement)

## 🎯 Fonctionnalités Avancées

### Recherche et Filtrage
- Recherche en temps réel
- Filtrage multi-critères
- Tri automatique des résultats

### Export de Données
- Export CSV des données filtrées
- Format compatible avec Excel

### Gestion des Erreurs
- Gestion gracieuse des erreurs de chargement
- Messages d'erreur informatifs
- Possibilité de recharger les données

### Performance
- Chargement optimisé des images
- Pagination virtuelle pour les grandes listes
- Mise en cache des données

## 🎨 Design System

L'application utilise un design system cohérent basé sur :
- **Couleurs** : Palette neutre avec accents pour les statuts
- **Typographie** : Hiérarchie claire des informations
- **Espacement** : Système de spacing cohérent
- **Composants** : Bibliothèque de composants réutilisables

## 📱 Responsive Design

- **Desktop** : Interface complète avec toutes les fonctionnalités
- **Tablette** : Adaptation des colonnes et navigation
- **Mobile** : Interface optimisée pour les écrans tactiles

## 🔧 Configuration

### Variables d'Environnement
Aucune variable d'environnement requise pour le moment.

### Personnalisation
- Modifiez `src/app/globals.css` pour personnaliser les couleurs
- Ajustez les composants dans `src/components/ui/` pour modifier l'apparence
- Modifiez les types dans `src/types/entrepot.ts` pour adapter la structure des données

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement si nécessaire
3. Déployez automatiquement

### Autres Plateformes
L'application peut être déployée sur n'importe quelle plateforme supportant Next.js :
- Netlify
- AWS Amplify
- Google Cloud Platform
- Azure Static Web Apps

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est développé pour l'IMA (Initiative Médicale d'Afrique) - Province de l'Équateur.

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement

---

**Développé avec ❤️ pour l'IMA - Province de l'Équateur** 