# Story 3.1 : Affichage de la fiche émotion

**Story Key:** 3-1-fiche-emotion
**Status:** in-progress
**Epic:** 3 — La fiche : découverte du contenu Larivey

## Story

En tant que visiteur, je veux lire la fiche de l'émotion choisie.

## Acceptance Criteria

- EmotionService.getById() + ContentService.loadContent() appelés au chargement
- Fond --color-*-dark via ThemeService
- Nom émotion : Lora 48px, blanc, opacity 0.7
- Sections Définition/Exemples/À quoi ça sert en 16-18px, text-indent sur paragraphes
- Labels sections : 13px uppercase, letter-spacing 0.08em
- Erreurs typiques affichées si présentes
- emotionId inconnu → redirect /

## Tasks/Subtasks

- [x] T1 : Implémenter FicheComponent (template + styles)
- [x] T2 : Bouton fixe cycle (Story 3.2)
- [x] T3 : Fallback bienveillant (Story 3.3)
- [x] T4 : Tests unitaires

## Dev Agent Record

### Completion Notes
Stories 3.1, 3.2, 3.3 implémentées ensemble dans FicheComponent.

## File List
- src/app/features/fiche/fiche.ts
- src/app/features/fiche/fiche.html
- src/app/features/fiche/fiche.scss
- src/app/features/fiche/fiche.spec.ts

## Change Log
- 2026-04-10 : Implémentation initiale

## Status: review
