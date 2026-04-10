# Story 2.1 : Écran d'accueil avec palette de couleurs

**Story Key:** 2-1-ecran-accueil-palette
**Status:** in-progress
**Epic:** 2 — L'entrée : accueil et sélection de l'émotion

## Story

En tant que visiteur,
je veux voir un écran d'accueil épuré avec le titre "Émocycle", la baseline et 6 ronds de couleur cliquables,
afin d'entrer dans l'expérience par le ressenti plutôt que par la cognition.

## Acceptance Criteria

**Given** le visiteur arrive sur `/`
**When** la page se charge
**Then** le titre "Émocycle" s'affiche en Lora Bold, clamp(72px, 15vw, 140px) (UX-DR2)
**And** la baseline est coupée en deux lignes avec un gap de ~90px : "L'émotion que vous vivez" / "a un message." (UX-DR4)
**And** une animation fadeIn de 2s révèle progressivement le contenu (UX-DR3)
**And** 6 ronds de couleur s'affichent avec leurs labels pluriels : Joies, Amours, Désirs, Tristesses, Colères, Peurs (FR2, FR3, UX-DR5)
**And** chaque rond a une taille tactile ≥ 44×44px
**And** chaque rond possède un `aria-label` décrivant la famille (FR3)
**And** le fond est `--bg-warm`

**Given** le visiteur clique sur un rond de couleur
**When** la navigation s'effectue
**Then** `ThemeService.applyFamily(famille)` est appelé
**And** `EmotionSessionService.selectedFamily` est mis à jour
**And** le visiteur est redirigé vers `/famille/:familleId`

## Tasks/Subtasks

- [ ] T1 : Implémenter `AccueilComponent` (template + styles)
  - [ ] Structure HTML : titre, baseline deux lignes, grille 6 ronds
  - [ ] Styles CSS : clamp typo, gap baseline, ronds colorés tactiles
  - [ ] Animation fadeIn 2s sur le contenu
- [ ] T2 : Logique de navigation au clic
  - [ ] Injecter `ThemeService`, `EmotionSessionService`, `Router`
  - [ ] `onFamilleSelect(famille)` : applyFamily + selectFamily + navigate
- [ ] T3 : Accessibilité
  - [ ] `aria-label` sur chaque bouton rond
  - [ ] Focus visible, navigation clavier
- [ ] T4 : Tests unitaires

## Dev Notes

### Familles et labels
```ts
const FAMILLES = [
  { id: 'joie',      label: 'Joies',      ariaLabel: 'Famille Joies' },
  { id: 'amour',     label: 'Amours',     ariaLabel: 'Famille Amours' },
  { id: 'desir',     label: 'Désirs',     ariaLabel: 'Famille Désirs' },
  { id: 'tristesse', label: 'Tristesses', ariaLabel: 'Famille Tristesses' },
  { id: 'colere',    label: 'Colères',    ariaLabel: 'Famille Colères' },
  { id: 'peur',      label: 'Peurs',      ariaLabel: 'Famille Peurs' },
]
```

### CSS tokens à utiliser
- `--color-*` pour les ronds
- `--bg-warm` pour le fond de la page
- `--transition` pour les hover

## Dev Agent Record

### Debug Log
### Completion Notes
### Implementation Plan

## File List

## Change Log
