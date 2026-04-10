# Story 1.1 : Configuration PWA et routing

**Story Key:** 1-1-pwa-setup-routing
**Status:** in-progress
**Epic:** 1 — Fondations : PWA, données et structure

## Story

En tant que développeur,
je veux configurer l'app comme PWA avec un routing lazy complet,
afin que toutes les features suivantes puissent être développées sur une base solide.

## Acceptance Criteria

**Given** le projet Angular 21 existe
**When** `@angular/pwa` est configuré et `app.config.ts` est mis à jour
**Then** `ngsw-worker.js` et `manifest.webmanifest` sont générés dans `public/`
**And** `provideHttpClient()` est présent dans `app.config.ts`
**And** `app.routes.ts` définit les 6 routes lazy : `/`, `/famille/:familleId`, `/emotion/:emotionId`, `/cycle/:emotionId`, `/sortie/:emotionId`, `/credits`
**And** `ng build` produit un build sans erreur

## Tasks/Subtasks

- [ ] T1 : Installer `@angular/service-worker` et configurer PWA manuellement
  - [ ] Installer `@angular/service-worker`
  - [ ] Créer `public/manifest.webmanifest`
  - [ ] Créer `ngsw-config.json`
  - [ ] Ajouter `provideServiceWorker` dans `app.config.ts`
- [ ] T2 : Ajouter `provideHttpClient()` dans `app.config.ts`
- [ ] T3 : Créer les 6 composants stub de features (lazy)
  - [ ] `src/app/features/accueil/accueil.ts`
  - [ ] `src/app/features/liste/liste.ts`
  - [ ] `src/app/features/fiche/fiche.ts`
  - [ ] `src/app/features/cycle/cycle.ts`
  - [ ] `src/app/features/sortie/sortie.ts`
  - [ ] `src/app/features/credits/credits.ts`
- [ ] T4 : Configurer les 6 routes lazy dans `app.routes.ts`
- [ ] T5 : Vérifier que `ng build` passe sans erreur

## Dev Notes

### Architecture
- Angular 21.2.0 standalone, pas de NgModules
- PWA : `@angular/service-worker` + `ngsw-config.json`
- Routing : `loadComponent` pour le lazy loading
- Tous les composants sont standalone (par défaut en v21+)

### Fichiers clés
- `src/app/app.config.ts` — providers
- `src/app/app.routes.ts` — routes lazy
- `public/manifest.webmanifest` — manifest PWA
- `ngsw-config.json` — config service worker (configuration finale à l'Epic 6)

## Dev Agent Record

### Debug Log

### Completion Notes

### Implementation Plan

## File List

## Change Log

---
_Story créée le 2026-04-08_
