# Story 2.2 : Liste des émotions par famille

**Story Key:** 2-2-liste-emotions-famille
**Status:** ready-for-dev
**Epic:** 2 — L'entrée : accueil et sélection de l'émotion

## Story

En tant que visiteur,
je veux voir la liste des émotions simples associées à la couleur que j'ai choisie,
afin de trouver le mot qui correspond à ce que je ressens.

## Acceptance Criteria

**Given** le visiteur arrive sur `/famille/:familleId`
**When** la page se charge
**Then** le fond est la couleur sombre de la famille (`--color-*-dark`) sur toute la hauteur (UX-DR6)
**And** le titre de la famille s'affiche en Lora grand format en défonce blanche
**And** la liste affiche uniquement les émotions de `type: 'simple'` de cette famille (FR4, FR22)
**And** chaque mot s'affiche en Lora 24px, centré, avec padding tactile ≥ 44px de hauteur (FR5)
**And** la liste est scrollable verticalement

**Given** le visiteur tape/clique sur une émotion
**When** la sélection s'effectue
**Then** `EmotionSessionService.select(emotion)` est appelé
**And** le visiteur est redirigé vers `/emotion/:emotionId`

**Given** `familleId` ne correspond à aucune famille connue
**When** la page tente de charger
**Then** le visiteur est redirigé vers `/`

## Tasks/Subtasks

- [ ] T1 : Implémenter `ListeComponent`
  - [ ] Lire `familleId` depuis `ActivatedRoute`
  - [ ] Valider `familleId` et rediriger vers `/` si inconnu
  - [ ] Appliquer `ThemeService.applyFamily()` au chargement
  - [ ] Charger les émotions via `EmotionService.getByFamily()`
- [ ] T2 : Template et styles
  - [ ] Fond sombre full-height via classe `bg-*` sur `:host`
  - [ ] Titre famille en blanc, grand format
  - [ ] Bouton/item par émotion : Lora 24px, centré, min-height 44px
  - [ ] Liste scrollable verticalement
- [ ] T3 : Logique de sélection
  - [ ] `onEmotionSelect(emotion)` : session.select() + navigate to /emotion/:id
- [ ] T4 : Tests unitaires

## Dev Notes

### Validation familleId
```ts
const VALID_FAMILIES = ['joie','amour','desir','tristesse','colere','peur'];
if (!VALID_FAMILIES.includes(familleId)) router.navigate(['/']);
```

### Fond sombre
Le fond est géré par `ThemeService.applyFamily()` sur `<body>`. Le composant doit être
full-height pour que le fond couvre tout l'écran.

## Dev Agent Record
### Debug Log
### Completion Notes
### Implementation Plan

## File List

## Change Log
