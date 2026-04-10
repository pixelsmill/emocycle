---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-04-08'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# Emotions - Epic Breakdown

## Overview

Ce document décompose les exigences du PRD, de la spec UX et de l'architecture en épics et stories implémentables pour le projet **Emotions** (PWA Angular, MVP).

## Requirements Inventory

### Functional Requirements

FR1: Le visiteur voit un écran d'accueil épuré avec une promesse d'introduction
FR2: Le visiteur peut choisir une couleur parmi une palette de 6 familles émotionnelles
FR3: Chaque couleur est accompagnée d'un label textuel accessible aux lecteurs d'écran
FR4: Le visiteur voit une liste d'émotions simples associées à la couleur choisie
FR5: Le visiteur peut parcourir la liste par scroll et sélectionner une émotion par tap/clic
FR6: Le visiteur voit la fiche de l'émotion sélectionnée (définition, exemples, utilité)
FR7: La couleur choisie est utilisée comme couleur de fond pour la fiche et les étapes du cycle
FR8: Le système affiche un texte de fallback bienveillant quand le contenu spécifique à une étape du cycle est absent
FR9: Le visiteur est guidé à travers les 5 étapes du cycle (émergence, sensation, reconnaissance, expression, action)
FR10: Le système adapte le langage du cycle selon la valence de l'émotion (positif/négatif)
FR11: Chaque étape du cycle affiche des exemples-guides pour aider le visiteur
FR12: Les erreurs typiques liées à l'émotion sont affichées si présentes dans la fiche Larivey
FR13: Le visiteur peut progresser d'une étape à la suivante à son rythme (swipe mobile, boutons desktop)
FR14: Le visiteur voit un message de sortie douce à la fin du cycle
FR15: Le visiteur peut indiquer son ressenti via [Merci] ou [Pas vraiment]
FR16: Le message affiché après [Pas vraiment] est humble et non culpabilisant
FR17: Le visiteur peut accéder à des numéros d'écoute (filet de sécurité) depuis l'écran de sortie
FR18: Le visiteur peut accéder à une page de crédits depuis un lien discret
FR19: La page de crédits présente les sources (Garneau & Larivey), l'intention du projet et un moyen de contact
FR20: Le système charge les données des ~80 émotions depuis un fichier JSON structuré
FR21: Chaque émotion possède un type, une valence, une famille de couleur et un genre grammatical
FR22: Le MVP affiche uniquement les émotions de type "simple" dans la liste par couleur

### NonFunctional Requirements

NFR1: Transitions entre étapes du cycle fluides (< 300ms) — CSS pur
NFR2: Contenu statique chargé au démarrage ou en lazy loading transparent
NFR3: First Contentful Paint < 2s sur connexion 3G
NFR4: Lighthouse Performance ≥ 90
NFR5: Lighthouse PWA ≥ 90 — app installable
NFR6: WCAG AA sur l'ensemble du parcours — zéro erreur AXE
NFR7: Focus management séquentiel entre les étapes du cycle
NFR8: Contrastes validés sur tous les fonds colorés dynamiques
NFR9: Navigation clavier complète du parcours
NFR10: L'app fonctionne hors-ligne pour le contenu statique (Service Worker)
NFR11: Aucune perte de parcours si la connexion est interrompue en cours de cycle
NFR12: Aucune donnée personnelle collectée dans le MVP
NFR13: Pas de cookies de tracking, pas de fingerprinting

### Additional Requirements

- ARCH1: Configurer `ng add @angular/pwa` — génère service worker + manifest PWA
- ARCH2: Installer `marked` (`npm install marked`) — parser markdown pour ContentService
- ARCH3: Configurer `provideHttpClient()` dans `app.config.ts` pour ContentService
- ARCH4: Créer `public/data/emotions.json` — index de toutes les émotions (~80 entrées avec id, name, family, valence, type, gender, contentFile)
- ARCH5: Générer `public/content/*.md` via script `scripts/prepare-content.ts` depuis `documents/redpsy/guide-md/` (nettoyage des liens HTML)
- ARCH6: Créer `src/app/data/cycle-templates.ts` — textes des 5 étapes par valence + gender
- ARCH7: Configurer routing lazy-loaded complet dans `app.routes.ts` (6 routes)
- ARCH8: Configurer `ngsw-config.json` — CacheFirst sur `emotions.json` et `public/content/*.md`

### UX Design Requirements

UX-DR1: Implémenter les tokens CSS custom properties globaux dans `styles.scss` (--color-joie, --color-joie-dark, …×6 familles, --text, --text-on-dark, --bg-warm, --radius, --transition, --btn-bg)
UX-DR2: Implémenter la typographie Lora (Google Fonts) avec hiérarchie complète : clamp(72px,15vw,140px) hero, 48px titre émotion, 24px liste, 16-18px corps, interlignage 1.6-1.8
UX-DR3: Implémenter l'animation fadeIn (2s ease) sur l'écran d'accueil — révélation de la palette
UX-DR4: Implémenter la baseline d'accueil coupée en deux avec gap 90px : "L'émotion que vous vivez" / "a un message."
UX-DR5: Implémenter les 6 ronds de couleur cliquables avec labels pluriels (Joies, Amours…) et taille tactile ≥ 44px
UX-DR6: Implémenter le fond sombre par famille (`--color-*-dark`) sur tous les écrans intérieurs (liste, fiche, cycle, sortie)
UX-DR7: Implémenter le bouton "Votre [émotion] a quelque chose à vous dire" fixed en bas de la fiche — toujours visible pendant le scroll
UX-DR8: Implémenter le diaporama horizontal du cycle : 5 écrans plein écran, slide CSS (translateX), swipe tactile mobile, boutons gauche/droite desktop, 5 puces de pagination
UX-DR9: Implémenter l'accord grammatical (gender m/f) dans tous les textes du cycle ("Le/La [émotion] est là")
UX-DR10: Implémenter le text-indent sur les paragraphes de contenu Larivey dans la fiche
UX-DR11: Implémenter le bouton [Pas vraiment] avec bordure visible pour assurer le contraste sur fond sombre
UX-DR12: Valider les contrastes WCAG AA sur tous les fonds colorés dynamiques (blanc sur dark)

### FR Coverage Map

FR1: Epic 2 — Écran d'accueil épuré
FR2: Epic 2 — Palette 6 familles émotionnelles
FR3: Epic 2 — Labels textuels accessibles sur les couleurs
FR4: Epic 2 — Liste d'émotions simples par couleur
FR5: Epic 2 — Scroll et tap sur la liste
FR6: Epic 3 — Fiche émotion (définition, exemples, utilité)
FR7: Epic 3 — Couleur de fond persistante sur fiche et cycle
FR8: Epic 3 — Fallback bienveillant pour étapes du cycle sans contenu
FR9: Epic 4 — 5 étapes du cycle émotionnel
FR10: Epic 4 — Adaptation du langage selon valence (positif/négatif)
FR11: Epic 4 — Exemples-guides par étape du cycle
FR12: Epic 3 — Erreurs typiques affichées si présentes dans la fiche
FR13: Epic 4 — Progression libre entre étapes (swipe + boutons)
FR14: Epic 5 — Message de sortie douce
FR15: Epic 5 — Boutons [Merci] / [Pas vraiment]
FR16: Epic 5 — Message humble après [Pas vraiment]
FR17: Epic 5 — Filet de sécurité (numéros d'écoute) en sortie
FR18: Epic 5 — Lien discret vers page de crédits
FR19: Epic 5 — Page de crédits (sources, intention, contact)
FR20: Epic 1 — Chargement depuis emotions.json
FR21: Epic 1 — Modèle de données (type, valence, famille, genre)
FR22: Epic 1 — Filtrage MVP sur type "simple"
NFR1-13: Epic 6 — Qualité, accessibilité, performance, PWA, RGPD
ARCH1-7: Epic 1 — Setup PWA, données, routing
ARCH8: Epic 6 — Configuration ngsw-config.json finale
UX-DR1-2: Epic 1 — Tokens CSS et typographie Lora
UX-DR3-5: Epic 2 — Animation accueil, baseline, ronds de couleur
UX-DR6: Épics 2-5 — Fond sombre par famille (appliqué progressivement)
UX-DR7: Epic 3 — Bouton fixed en bas de fiche
UX-DR8-9: Epic 4 — Diaporama cycle + accord grammatical
UX-DR10: Epic 3 — Text-indent contenu Larivey
UX-DR11: Epic 5 — Bouton [Pas vraiment] avec bordure
UX-DR12: Epic 6 — Audit contrastes WCAG AA

## Epic List

### Epic 1 — Fondations : PWA, données et structure
L'app Angular est configurée en PWA, les données des ~80 émotions sont disponibles, le routing lazy est en place — la base est prête à recevoir toutes les features.
**Couvre :** ARCH1-7, FR20, FR21, FR22, UX-DR1, UX-DR2

### Epic 2 — L'entrée : accueil et sélection de l'émotion
Le visiteur peut arriver sur l'app, choisir une couleur parmi 6 familles émotionnelles et trouver l'émotion qui lui correspond dans la liste.
**Couvre :** FR1, FR2, FR3, FR4, FR5, UX-DR3, UX-DR4, UX-DR5, UX-DR6 (accueil + liste)

### Epic 3 — La fiche : découverte du contenu Larivey
Le visiteur peut lire la fiche de l'émotion choisie (définition, exemples, utilité, erreurs typiques), baignée dans la couleur sélectionnée, avec un bouton fixe pour entrer dans le cycle.
**Couvre :** FR6, FR7, FR8, FR12, UX-DR6 (fiche), UX-DR7, UX-DR10

### Epic 4 — Le cycle : traverser l'émotion
Le visiteur peut traverser les 5 étapes du cycle émotionnel via un diaporama horizontal, guidé par des textes adaptés à son émotion et sa valence.
**Couvre :** FR9, FR10, FR11, FR13, UX-DR6 (cycle), UX-DR8, UX-DR9

### Epic 5 — La sortie et les crédits : clore le parcours
Le visiteur peut clore son parcours avec un message doux, exprimer son ressenti, accéder au filet de sécurité, et découvrir les crédits du projet.
**Couvre :** FR14, FR15, FR16, FR17, FR18, FR19, UX-DR11

### Epic 6 — Qualité et mise en production
L'app est accessible WCAG AA, installable en PWA, performante (Lighthouse ≥ 90), offline-first et conforme RGPD.
**Couvre :** NFR1-13, ARCH8, UX-DR12

---

## Epic 1 : Fondations — PWA, données et structure

L'app Angular est configurée en PWA, les données des ~80 émotions sont disponibles, le routing lazy est en place — la base est prête à recevoir toutes les features.

### Story 1.1 : Configuration PWA et routing

En tant que développeur,
je veux configurer l'app comme PWA avec un routing lazy complet,
afin que toutes les features suivantes puissent être développées sur une base solide.

**Acceptance Criteria :**

**Given** le projet Angular 21 existe
**When** `ng add @angular/pwa` est exécuté et `app.config.ts` est configuré
**Then** `ngsw-worker.js` et `manifest.webmanifest` sont générés dans `public/`
**And** `provideHttpClient()` est présent dans `app.config.ts`
**And** `app.routes.ts` définit les 6 routes lazy : `/`, `/famille/:familleId`, `/emotion/:emotionId`, `/cycle/:emotionId`, `/sortie/:emotionId`, `/credits`
**And** `ng build` produit un build sans erreur

### Story 1.2 : Modèle de données et contenu Larivey

En tant que développeur,
je veux définir le modèle TypeScript des émotions et générer les fichiers de contenu,
afin que les services aient une source de données typée et complète.

**Acceptance Criteria :**

**Given** le dossier `documents/redpsy/guide-md/` contient ~80 fichiers `.md`
**When** `emotion.model.ts` est créé et `scripts/prepare-content.ts` est exécuté
**Then** `emotion.model.ts` exporte `Emotion`, `EmotionFamily`, `Valence`, `EmotionType`, `Gender`
**And** `public/data/emotions.json` contient ~80 entrées avec les champs `id`, `name`, `family`, `valence`, `type`, `gender`, `contentFile`
**And** `public/content/*.md` contient ~80 fichiers Larivey nettoyés (liens HTML supprimés)
**And** `EmotionFamily` couvre les 6 valeurs : `joie`, `amour`, `desir`, `tristesse`, `colere`, `peur`
**And** seules les émotions `type: 'simple'` sont marquées comme affichables en liste MVP (FR22)

### Story 1.3 : Services de données et session

En tant que développeur,
je veux les services `EmotionService`, `ContentService`, `MarkdownParserService` et `EmotionSessionService` implémentés,
afin que les composants des features suivantes aient accès aux données sans logique de chargement dupliquée.

**Acceptance Criteria :**

**Given** `public/data/emotions.json` et `public/content/*.md` existent
**When** `EmotionService` est injecté dans un composant
**Then** `EmotionService.getAll()` retourne toutes les émotions du JSON (signal)
**And** `EmotionService.getById(id)` retourne l'émotion correspondante ou `null`
**And** `EmotionService.getByFamily(family)` retourne les émotions de type `simple` de cette famille

**Given** une émotion sélectionnée
**When** `ContentService.loadContent(id)` est appelé
**Then** le fichier `.md` correspondant est fetché via `HttpClient`
**And** `MarkdownParserService` extrait les sections : `examples`, `description`, `utility`, `typicalErrors` (null si absente)
**And** si le fetch échoue, un objet de fallback bienveillant est retourné (FR8)

**Given** un composant injecte `EmotionSessionService`
**When** `select(emotion)` est appelé
**Then** `selectedEmotion` et `selectedFamily` sont mis à jour (signals)

### Story 1.4 : Design system CSS et ThemeService

En tant que développeur,
je veux les tokens CSS globaux et le service de theming en place,
afin que tous les composants partagent le même langage visuel dès le départ.

**Acceptance Criteria :**

**Given** le fichier `src/styles.scss`
**When** l'app est chargée
**Then** toutes les CSS custom properties sont disponibles globalement : `--color-joie`, `--color-joie-dark`, …×6 familles, `--text`, `--text-on-dark`, `--bg-warm`, `--radius`, `--transition`, `--btn-bg`
**And** la police Lora est importée depuis Google Fonts et appliquée sur `body` (UX-DR2)

**Given** `ThemeService` est injecté
**When** `ThemeService.applyFamily('colere')` est appelé
**Then** la classe `bg-colere` est ajoutée sur `<body>` et les classes des autres familles sont retirées
**And** aucun composant n'applique de classe de couleur directement sans passer par `ThemeService`

---

## Epic 2 : L'entrée — accueil et sélection de l'émotion

Le visiteur peut arriver sur l'app, choisir une couleur parmi 6 familles émotionnelles et trouver l'émotion qui lui correspond dans la liste.

### Story 2.1 : Écran d'accueil avec palette de couleurs

En tant que visiteur,
je veux voir un écran d'accueil épuré avec le titre "Émocycle", la baseline et 6 ronds de couleur cliquables,
afin d'entrer dans l'expérience par le ressenti plutôt que par la cognition.

**Acceptance Criteria :**

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

### Story 2.2 : Liste des émotions par famille

En tant que visiteur,
je veux voir la liste des émotions simples associées à la couleur que j'ai choisie,
afin de trouver le mot qui correspond à ce que je ressens.

**Acceptance Criteria :**

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

---

## Epic 3 : La fiche — découverte du contenu Larivey

Le visiteur peut lire la fiche de l'émotion choisie (définition, exemples, utilité, erreurs typiques), baignée dans la couleur sélectionnée, avec un bouton fixe pour entrer dans le cycle.

### Story 3.1 : Affichage de la fiche émotion

En tant que visiteur,
je veux lire la fiche de l'émotion que j'ai choisie (définition, exemples, utilité),
afin de comprendre ce que cette émotion signifie et me sentir reconnu.

**Acceptance Criteria :**

**Given** le visiteur arrive sur `/emotion/:emotionId`
**When** la fiche se charge
**Then** `EmotionService.getById(emotionId)` et `ContentService.loadContent(emotionId)` sont appelés
**And** le fond est la couleur sombre de la famille de l'émotion (`--color-*-dark`) — UX-DR6
**And** le nom de l'émotion s'affiche en Lora 48px en défonce blanche, opacity 0.7
**And** les sections "Définition", "Exemples", "À quoi ça sert" s'affichent en Lora 16-18px avec text-indent sur les paragraphes (UX-DR10)
**And** les labels de sections s'affichent en 13px uppercase avec letter-spacing 0.08em (FR6)

**Given** la section "erreurs typiques" est présente dans le markdown Larivey
**When** la fiche s'affiche
**Then** les erreurs typiques sont visibles dans la fiche (FR12)

**Given** `emotionId` ne correspond à aucune émotion connue
**When** la page tente de charger
**Then** le visiteur est redirigé vers `/`

### Story 3.2 : Bouton fixe "Votre émotion a quelque chose à vous dire"

En tant que visiteur,
je veux voir un bouton toujours accessible en bas de la fiche pour entrer dans le cycle,
afin de pouvoir commencer le cycle à tout moment pendant ma lecture sans devoir scroller jusqu'en bas.

**Acceptance Criteria :**

**Given** le visiteur est sur la fiche `/emotion/:emotionId`
**When** la page s'affiche ou que le visiteur scrolle
**Then** le bouton "Votre [émotion] a quelque chose à vous dire" reste fixé en bas de l'écran (UX-DR7)
**And** le bouton utilise le nom exact de l'émotion (ex. "Votre ressentiment a quelque chose à vous dire")
**And** le bouton a un fond `rgba(255,255,255,0.2)` avec backdrop-filter blur
**And** le bouton a une taille tactile ≥ 44px de hauteur

**Given** le visiteur appuie sur le bouton
**When** la navigation s'effectue
**Then** le visiteur est redirigé vers `/cycle/:emotionId`

### Story 3.3 : Fallback bienveillant pour contenu manquant

En tant que visiteur,
je veux que l'app reste fonctionnelle et bienveillante même si la fiche d'une émotion est incomplète,
afin de ne jamais me retrouver face à un écran vide ou cassé.

**Acceptance Criteria :**

**Given** une émotion dont le fichier `.md` est absent ou ne contient pas toutes les sections
**When** `ContentService.loadContent(id)` est appelé
**Then** les sections manquantes sont remplacées par des textes génériques bienveillants (FR8)
**And** aucun message d'erreur technique n'est affiché au visiteur
**And** le bouton fixe pour entrer dans le cycle reste présent et fonctionnel
**And** un `console.error` est émis en dev pour signaler le contenu manquant

---

## Epic 4 : Le cycle — traverser l'émotion

Le visiteur peut traverser les 5 étapes du cycle émotionnel via un diaporama horizontal, guidé par des textes adaptés à son émotion et sa valence.

### Story 4.1 : Templates du cycle et accord grammatical

En tant que développeur,
je veux les textes des 5 étapes du cycle définis dans `cycle-templates.ts`, adaptés par valence et genre grammatical,
afin que tous les composants du cycle utilisent une source de vérité unique pour les textes.

**Acceptance Criteria :**

**Given** le fichier `src/app/data/cycle-templates.ts`
**When** il est importé
**Then** il exporte `CYCLE_TEMPLATES` de type `Record<Valence, CycleStep[]>` avec 5 étapes pour `positive` et `negative`
**And** chaque `CycleStep` contient `name`, `question` et `guide`
**And** une fonction utilitaire `interpolate(template, emotion)` remplace `[émotion]` par le nom accordé selon `emotion.gender` (ex. "Le ressentiment" / "La colère") — UX-DR9
**And** les textes `question` de l'étape Reconnaissance diffèrent selon la valence (FR10) :
négative : "Et si [cette émotion] était liée à un besoin qui vous appelle ?"
positive : "Et si [cette émotion] vous montrait ce qui compte vraiment pour vous ?"

### Story 4.2 : Diaporama du cycle — navigation et pagination

En tant que visiteur,
je veux naviguer entre les 5 étapes du cycle via swipe (mobile) ou boutons (desktop),
afin de progresser dans le cycle à mon propre rythme.

**Acceptance Criteria :**

**Given** le visiteur arrive sur `/cycle/:emotionId`
**When** la page se charge
**Then** l'émotion est chargée via `EmotionService.getById(emotionId)` (deep link safe)
**And** le fond est la couleur sombre de la famille (`--color-*-dark`) — UX-DR6
**And** le nom de l'émotion s'affiche en grand, opacity 0.7, en haut de l'écran
**And** l'étape 1 (Émergence) est affichée en premier
**And** 5 puces de pagination sont visibles en bas, la puce active est blanche opaque (UX-DR8)

**Given** le visiteur est sur une étape du cycle
**When** il swipe horizontalement (mobile) ou clique les boutons ← → (desktop)
**Then** la transition est un slide CSS horizontal (`transform: translateX`) en < 300ms (NFR1, UX-DR8)
**And** la puce active se met à jour
**And** le bouton ← est absent ou désactivé à l'étape 1
**And** le bouton → est remplacé par "Terminer" à l'étape 5

**Given** le visiteur est sur l'étape 1
**When** il clique ← Fiche
**Then** il est redirigé vers `/emotion/:emotionId`

### Story 4.3 : Contenu des étapes et exemples-guides

En tant que visiteur,
je veux que chaque étape du cycle affiche un texte adapté à mon émotion avec des exemples-guides,
afin d'être accompagné de manière personnalisée à chaque étape.

**Acceptance Criteria :**

**Given** le visiteur est sur une étape du cycle
**When** l'étape s'affiche
**Then** le nom de l'étape s'affiche en uppercase, 14px, letter-spacing 0.1em, opacity 0.55 (UX-DR8)
**And** la `question` interpolée avec le nom de l'émotion s'affiche en 24px (FR9, FR11)
**And** le `guide` s'affiche en 16px italique, max-width 380px centré (FR11)
**And** les textes sont ceux de `CYCLE_TEMPLATES[emotion.valence]` pour cette étape (FR10)

**Given** une étape sans contenu spécifique dans le fallback
**When** l'étape s'affiche
**Then** le texte générique bienveillant de `CYCLE_TEMPLATES` est utilisé — jamais d'écran vide (FR8)

---

## Epic 5 : La sortie et les crédits — clore le parcours

Le visiteur peut clore son parcours avec un message doux, exprimer son ressenti, accéder au filet de sécurité, et découvrir les crédits du projet.

### Story 5.1 : Écran de sortie

En tant que visiteur,
je veux voir un message de sortie douce à la fin du cycle avec les boutons [Merci] et [Pas vraiment],
afin de clore mon parcours émotionnel de façon bienveillante.

**Acceptance Criteria :**

**Given** le visiteur arrive sur `/sortie/:emotionId`
**When** la page se charge
**Then** le fond est la couleur sombre de la famille de l'émotion (`--color-*-dark`)
**And** le nom de l'émotion s'affiche en grand, opacity 0.7
**And** un message de sortie douce s'affiche en Lora 20px (FR14) : "Prenez soin de vous. Revenez quand vous voulez."
**And** les boutons [Merci] et [Pas vraiment] sont visibles (FR15)
**And** le bouton [Pas vraiment] a une bordure visible (`border: 1px solid rgba(255,255,255,0.25)`) pour assurer le contraste sur fond sombre (UX-DR11)
**And** les deux boutons ont une taille tactile ≥ 44px

**Given** le visiteur appuie sur [Merci]
**When** l'action s'effectue
**Then** un message de clôture positif s'affiche
**And** un bouton [Recommencer] redirige vers `/`

**Given** le visiteur appuie sur [Pas vraiment]
**When** l'action s'effectue
**Then** le message humble s'affiche : "Ce n'est pas grave. Vous avez eu le courage d'essayer, et c'est déjà beaucoup." (FR16)
**And** un bouton [Recommencer] est proposé et redirige vers `/`

### Story 5.2 : Filet de sécurité en sortie

En tant que visiteur,
je veux voir les numéros d'écoute accessibles sur l'écran de sortie,
afin de pouvoir trouver de l'aide si j'en ai besoin à ce moment.

**Acceptance Criteria :**

**Given** le visiteur est sur `/sortie/:emotionId`
**When** la page s'affiche
**Then** les numéros d'écoute sont visibles : 3114 et SOS Amitié (09 72 39 40 50) (FR17)
**And** les numéros sont des liens `<a href="tel:...">` cliquables sur mobile
**And** le texte est sobre et non anxiogène : "Si vous traversez un moment difficile, vous pouvez appeler le 3114..."
**And** le filet est visible sans scroller, en dessous des boutons [Merci] / [Pas vraiment]

### Story 5.3 : Page de crédits

En tant que visiteur,
je veux accéder à une page de crédits depuis un lien discret,
afin de comprendre l'origine du contenu et contacter le créateur si je le souhaite.

**Acceptance Criteria :**

**Given** un lien discret vers `/credits` est accessible depuis l'app
**When** le visiteur clique sur le lien
**Then** il arrive sur `/credits` (FR18)
**And** la page présente les sources : Michelle Larivey & Jean Garneau, "Les émotions source de vie", redpsy.com (FR19)
**And** l'intention du projet est décrite (FR19)
**And** un moyen de contacter le créateur est présent (lien email) (FR19)
**And** un lien ← retour vers l'accueil est accessible

---

## Epic 6 : Qualité et mise en production

L'app est accessible WCAG AA, installable en PWA, performante (Lighthouse ≥ 90), offline-first et conforme RGPD.

### Story 6.1 : Configuration Service Worker et offline complet

En tant que visiteur,
je veux que l'app fonctionne hors-ligne après la première visite,
afin de pouvoir traverser un cycle émotionnel même sans connexion.

**Acceptance Criteria :**

**Given** `ngsw-config.json` est configuré
**When** le build de production est généré
**Then** `public/data/emotions.json` est dans un `assetGroup` avec stratégie `CacheFirst` (ARCH8)
**And** `public/content/*.md` est dans un `assetGroup` avec stratégie `CacheFirst`
**And** les fonts Google Fonts sont mises en cache
**And** après une première visite avec connexion, recharger sans réseau affiche l'app complète (NFR10, NFR11)
**And** aucune erreur réseau ne bloque le parcours en mode offline

### Story 6.2 : Audit accessibilité WCAG AA

En tant que visiteur utilisant un lecteur d'écran ou la navigation clavier,
je veux que l'app soit entièrement accessible,
afin de pouvoir traverser le cycle émotionnel quelle que soit ma façon d'interagir.

**Acceptance Criteria :**

**Given** l'app est complète (Epics 1-5)
**When** un audit AXE est exécuté sur chaque écran
**Then** zéro erreur AXE sur tous les écrans (NFR6)
**And** chaque rond de couleur de la palette a un `aria-label` descriptif (NFR6)
**And** la navigation clavier parcourt tous les éléments interactifs dans l'ordre logique (NFR9)
**And** le focus management est correct aux transitions de route — le focus revient en haut de page (NFR7)
**And** les boutons [Merci], [Pas vraiment] et boutons cycle ont tous un label accessible

**Given** l'app s'affiche sur un fond coloré sombre
**When** les contrastes sont vérifiés avec un outil WCAG
**Then** le ratio texte blanc / fond coloré est ≥ 4.5:1 sur tous les fonds `--color-*-dark` (NFR8, UX-DR12)
**And** si le contraste d'une famille est insuffisant, la valeur HSL est ajustée

### Story 6.3 : Audit performance et PWA Lighthouse

En tant que visiteur sur mobile 3G,
je veux que l'app se charge rapidement et soit installable,
afin d'avoir une expérience fluide même sur connexion lente.

**Acceptance Criteria :**

**Given** le build de production est servi en HTTPS
**When** un audit Lighthouse est exécuté en mode mobile
**Then** score Performance ≥ 90 (NFR4)
**And** score PWA ≥ 90 — app installable (NFR5)
**And** First Contentful Paint < 2s sur connexion 3G simulée (NFR3)
**And** les transitions CSS entre étapes du cycle sont < 300ms (NFR1)
**And** le bundle initial respecte le budget 500kB warning configuré dans `angular.json`

### Story 6.4 : Conformité RGPD et absence de tracking

En tant que visiteur,
je veux être certain que l'app ne collecte aucune donnée personnelle,
afin de traverser un moment émotionnel intime en toute confiance.

**Acceptance Criteria :**

**Given** l'app est complète
**When** le trafic réseau est inspecté pendant un parcours complet
**Then** aucune requête vers un service d'analytics tiers n'est émise (NFR12, NFR13)
**And** aucun cookie n'est créé ou lu
**And** aucune donnée n'est stockée dans `localStorage`, `sessionStorage` ou `IndexedDB`
**And** aucune mention de collecte de données n'est requise (pas de cookie banner)
