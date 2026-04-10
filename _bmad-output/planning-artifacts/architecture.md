---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-04-08'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
workflowType: 'architecture'
project_name: 'emotions'
user_name: 'Beauty'
date: '2026-04-08'
---

# Architecture Decision Document

_Ce document se construit collaborativement étape par étape. Les sections sont ajoutées au fil de nos décisions architecturales._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
22 exigences réparties dans 7 groupes fonctionnels :
- Accueil et entrée (FR1-FR3) : écran épuré, palette 6 familles, labels accessibles
- Identification de l'émotion (FR4-FR5) : liste par couleur, scroll + tap
- Contenu Larivey (FR6-FR8) : fiche (définition/exemples/utilité), couleur de fond persistante, fallback bienveillant
- Cycle émotionnel (FR9-FR13) : 5 étapes séquentielles, bifurcation valence, exemples-guides, erreurs typiques, progression libre
- Fin de parcours (FR14-FR17) : sortie douce, [Merci]/[Pas vraiment], message humble, filet de sécurité permanent
- Crédits (FR18-FR19) : page crédits accessible, sources Garneau & Larivey, contact
- Données et contenu (FR20-FR22) : ~80 émotions depuis fichier structuré, modèle riche (type, valence, famille, genre), filtrage MVP sur type "simple"

**Non-Functional Requirements:**
- Performance : transitions < 300ms, FCP < 2s (3G), Lighthouse ≥ 90
- Accessibilité : WCAG AA, zéro erreur AXE, focus management, navigation clavier, contrastes dynamiques sur fonds colorés
- Fiabilité : hors-ligne via Service Worker, aucune perte de parcours
- Confidentialité : zéro donnée personnelle MVP, pas de cookies de tracking

**Scale & Complexity:**
- Primary domain: PWA Angular, client-side uniquement (MVP)
- Complexity level: Medium
- Estimated architectural components: ~8-10 vues Angular, 2-3 services, 1 modèle de données central, 1 manifest PWA + service worker

### Technical Constraints & Dependencies

- **Stack :** Angular 21.2.0 standalone + SCSS + Lora (Google Fonts)
- **CSS : custom properties + SCSS** — Tailwind écarté. Le prototype validé (`ux-design-directions.html`) utilise un système de tokens CSS custom properties (`--color-joie`, `--color-colere-dark`, `--btn-bg`, etc.) avec des classes sémantiques (`.screen-dark`, `.bg-colere`, `.liste-mot`…). Ce système est déjà testé et validé visuellement. Les tokens seront définis dans `src/styles.scss`. Tailwind serait une abstraction superflue pour ce volume de composants.
- **Pas de backend MVP :** Firebase reporté post-MVP. MVP 100% client-side.
- **Contenu Larivey :** ~80 fiches à structurer en TypeScript (droits à vérifier avant publication). Données statiques, bundlées avec l'app.
- **Modèle de données émotion :** `name`, `family`, `valence`, `type`, `gender`, `cycleSteps` (contenu par étape), `hasCycleContent` (flag fallback)
- **Prototype de référence :** `_bmad-output/planning-artifacts/ux-design-directions.html` — 8 écrans navigables, tokens CSS validés, patterns d'interaction confirmés
- **Développeur solo, greenfield** — architecture simple et maintenable primée

### Cross-Cutting Concerns Identified

1. **Accessibilité WCAG AA** — ARIA, focus management aux transitions de route, labels sur les ronds de couleur, tailles tactiles ≥ 44px, navigation clavier complète
2. **Theming dynamique** — famille de couleur sélectionnée propagée via un signal Angular vers tous les écrans intérieurs (classe CSS ou custom property sur `:root` / élément hôte)
3. **Fallback contenu** — texte générique bienveillant quand une étape du cycle manque de contenu Larivey spécifique
4. **PWA / offline** — service worker caching de tout le contenu statique ; aucune dépendance réseau dans le parcours MVP
5. **Performance des animations** — transitions CSS (slide horizontal cycle, fadeIn accueil) < 300ms, progressive enhancement

## Starter Template Evaluation

### Primary Technology Domain

PWA Angular — full client-side. Projet solo greenfield.

### Starter : Angular CLI — déjà initialisé

Le projet est déjà scaffoldé dans `emotions/`. Aucune commande d'initialisation à jouer.

**État du projet au démarrage de l'architecture :**

**Langage & Runtime :**
TypeScript 5.9.2 strict. Angular 21.2.0. Standalone components par défaut — aucun NgModule.

**Styling :**
SCSS (`inlineStyleLanguage: scss`, `src/styles.scss`).
CSS custom properties définies globalement dans `styles.scss` — système de tokens validé par le prototype `ux-design-directions.html`. Pas de Tailwind, pas de bibliothèque de composants.

**Build Tooling :**
`@angular/build` (Vite/esbuild). Build production avec output hashing, budgets de taille (500kB warning / 1MB error initial bundle).

**Testing :**
Vitest via `@angular/build:unit-test`.

**Formatage :**
Prettier 3.8.

**Routing :**
`app.routes.ts` en place. Lazy loading des features à configurer.

**PWA :**
Pas encore ajouté. `ng add @angular/pwa` constitue la première story d'implémentation technique.

**Structure source actuelle :**
```
src/
  main.ts
  index.html
  styles.scss
  app/
    app.ts
    app.html
    app.scss
    app.config.ts
    app.routes.ts
    app.spec.ts
```

## Core Architectural Decisions

### Decision Priority Analysis

**Décisions critiques (bloquantes) :**
- Modèle de données et stratégie de chargement
- Structure de routing
- Stratégie de theming dynamique

**Décisions importantes :**
- Animations CSS
- Service Worker / offline strategy

**Différées (post-MVP) :**
- Hébergement / déploiement
- Analytics, Firebase Hosting

### Data Architecture

**Format :** JSON index + fichiers Markdown par émotion, chargement lazy.

```
public/
  data/
    emotions.json        ← index : metadata de toutes les émotions
  content/
    colere.md            ← contenu Larivey par émotion (copié depuis
    ressentiment.md         documents/redpsy/guide-md/, liens nettoyés)
    ...
```

**`emotions.json`** — tableau d'objets `Emotion` :
```ts
interface Emotion {
  id: string;             // "colere", "ressentiment"
  name: string;           // "La colère", "Le ressentiment"
  family: EmotionFamily;  // 'joie'|'amour'|'desir'|'tristesse'|'colere'|'peur'
  valence: 'positive'|'negative';
  type: 'simple'|'mixte'|'repoussee'|'pseudo';
  gender: 'm'|'f';        // pour accords : "Le/La [émotion] est là"
  contentFile: string;    // "colere.md"
}
```

**Chargement :**
- `EmotionService` — charge `emotions.json` une fois au démarrage (signal)
- `ContentService` — fetch lazy du `.md` à la sélection d'une émotion
- `MarkdownParserService` — extrait les sections (Exemples / Qu'est-ce que c'est ? / À quoi ça sert ?) depuis le markdown brut

**Textes du cycle :** templates Angular paramétrés par `valence` + `gender`. Pas de fichier externe — toute l'intelligence est dans le code.

**Source des fichiers content/ :** scripts de préparation dans `scripts/` pour copier et nettoyer les fichiers depuis `documents/redpsy/guide-md/`.

### Frontend Architecture

**Routing :**
```
/                     → AccueilComponent (lazy)
/famille/:familleId   → ListeComponent (lazy)
/emotion/:emotionId   → FicheComponent (lazy)
/cycle/:emotionId     → CycleComponent (lazy)
/sortie/:emotionId    → SortieComponent (lazy)
/credits              → CreditsComponent (lazy)
```
Toutes les routes lazy-loaded. La session (famille + émotion sélectionnées)
est portée par `EmotionSessionService` (signal) — état léger en mémoire uniquement.

**State management :**
Signaux Angular uniquement. `EmotionSessionService` (providedIn root) :
```ts
selectedFamily = signal<EmotionFamily | null>(null);
selectedEmotion = signal<Emotion | null>(null);
```
Aucun state persisté en MVP (pas de localStorage, pas de cookies).

**Theming dynamique :**
`ThemeService` applique une classe CSS sur `<body>` reflétant la famille sélectionnée
(`bg-colere`, `bg-tristesse`…). Les tokens CSS custom properties (`--color-*-dark`)
font le reste sans JS supplémentaire.

**Animations :**
CSS pur uniquement. Pas de `@angular/animations`.
- Cycle : `transform: translateX` + `transition: 0.3s ease`
- Accueil : `opacity` fadeIn `animation: 2s ease`
Progressive enhancement : le parcours fonctionne sans animation.

**Markdown rendering :**
Librairie `marked` (légère) intégrée dans `MarkdownParserService`.
Pas de `ngx-markdown` — overhead inutile pour un usage aussi ciblé.

### Infrastructure & Deployment

Différé. Décision prise après le MVP.
Options envisagées : Firebase Hosting, Vercel, Netlify.

### PWA / Offline

`ng add @angular/pwa` → `ngsw-config.json` configuré pour mettre en cache :
- `public/data/emotions.json`
- `public/content/*.md`
- Assets statiques (fonts, icons, styles)

Stratégie : **CacheFirst** pour le contenu statique,
**NetworkFirst** pour les éventuelles futures requêtes post-MVP.

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Fichiers Angular (convention Angular 21 courte) :**
```
accueil.ts              ← pas accueil.component.ts
accueil.html
accueil.scss
accueil.spec.ts
emotion.service.ts      ← services : kebab-case + .service.ts
emotion.model.ts        ← interfaces/types : kebab-case + .model.ts
markdown-parser.service.ts
```

**Classes et exports :**
```ts
// Composants
export class AccueilComponent   // PascalCase + "Component"
export class ListeComponent
export class CycleComponent

// Services
export class EmotionService     // PascalCase + "Service"
export class ContentService
export class ThemeService

// Interfaces/types
export interface Emotion        // PascalCase, pas de préfixe "I"
export type EmotionFamily = 'joie' | 'amour' | 'desir' | 'tristesse' | 'colere' | 'peur'
export type Valence = 'positive' | 'negative'
export type EmotionType = 'simple' | 'mixte' | 'repoussee' | 'pseudo'
export type Gender = 'm' | 'f'
```

**Route params :** toujours suffixé `Id` :
```
/famille/:familleId
/emotion/:emotionId
/cycle/:emotionId
/sortie/:emotionId
```

**Signals dans les services :** verbe ou nom décrivant l'état, pas de préfixe `$` :
```ts
// ✓
emotions = signal<Emotion[]>([])
selectedEmotion = signal<Emotion | null>(null)
isLoading = signal(false)

// ✗
emotions$ = ...
_emotions = ...
```

### Structure Patterns

**Organisation des features :**
```
src/app/
  features/
    accueil/
      accueil.ts
      accueil.html
      accueil.scss
      accueil.spec.ts
    liste/
    fiche/
    cycle/
    sortie/
    credits/
  services/
    emotion.service.ts
    content.service.ts
    theme.service.ts
    markdown-parser.service.ts
  models/
    emotion.model.ts        ← interfaces + types
  data/
    cycle-templates.ts      ← textes du cycle par valence/gender
```

**Tests :** co-localisés avec le fichier (`accueil.spec.ts` à côté de `accueil.ts`). Pas de dossier `__tests__/` séparé.

**Assets de données :**
```
public/
  data/
    emotions.json
  content/
    colere.md
    ressentiment.md
    ...
```

### Format Patterns

**`emotion.model.ts` est la source de vérité :** toute interface, type ou enum y est défini. Aucun agent ne redéfinit ces types localement.

**Null vs undefined :** utiliser `null` pour les valeurs optionnelles absentes (cohérence avec les signals Angular initialisés à `null`). Jamais `undefined` pour une valeur "non encore chargée".

**Cycle templates — `data/cycle-templates.ts` :**
```ts
export const CYCLE_TEMPLATES: Record<Valence, CycleStep[]> = { ... }
```
Toujours importer depuis ce fichier. Jamais écrire des textes du cycle directement dans un composant.

### Communication Patterns

**Theming dynamique :**
`ThemeService.applyFamily(family: EmotionFamily)` est le seul point d'entrée pour changer le thème. Les composants n'appliquent jamais de classes de couleur directement.

```ts
// ✓ Dans un composant
this.themeService.applyFamily('colere')

// ✗
document.body.classList.add('bg-colere')
```

**Navigation :** toujours via `Router.navigate()`, jamais de `<a href>` pour les routes internes.

**Loading state — pattern standard dans les services :**
```ts
isLoading = signal(false)
error = signal<string | null>(null)

async load(): Promise<void> {
  this.isLoading.set(true)
  this.error.set(null)
  try { ... }
  catch { this.error.set('message') }
  finally { this.isLoading.set(false) }
}
```

### Process Patterns

**Gestion d'erreur :**
- Émotion introuvable (ID invalide dans l'URL) → rediriger vers `/` via `Router.navigate`
- Fichier `.md` non chargeable → afficher le fallback bienveillant (jamais un écran d'erreur)
- Erreur critique → `console.error` en dev, aucun message technique visible en prod

**CSS / SCSS :**
- Tokens globaux (`--color-*`, `--text`, `--radius`…) définis **uniquement** dans `src/styles.scss`
- Les composants utilisent les tokens via `var(--color-*)` dans leur `.scss`
- Aucun composant ne redéfinit un token CSS custom property

**Templates Angular :**
- Inline template si < ~15 lignes, fichier `.html` séparé sinon
- Toujours `changeDetection: ChangeDetectionStrategy.OnPush`
- Jamais `ngClass` ni `ngStyle` — utiliser `[class.xxx]` et `[style.xxx]`
- Control flow natif : `@if`, `@for`, `@switch`

### Agents MUST

- Toujours importer `Emotion`, `EmotionFamily`, etc. depuis `models/emotion.model.ts`
- Toujours passer par `ThemeService` pour changer la famille de couleur
- Toujours utiliser `EmotionSessionService` pour lire/écrire la sélection en cours
- Toujours utiliser `Router.navigate()` pour la navigation interne
- Ne jamais écrire de textes du cycle dans un composant — utiliser `data/cycle-templates.ts`
- Ne jamais stocker de données utilisateur (localStorage, cookies, Firestore) dans le MVP

## Project Structure & Boundaries

### Complete Project Directory Structure

```
emotions/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── ngsw-config.json                       ← généré par ng add @angular/pwa
├── scripts/
│   └── prepare-content.ts                 ← copie + nettoie les .md depuis documents/redpsy/
├── documents/
│   └── redpsy/
│       └── guide-md/                      ← sources Larivey (non servis, lecture seule)
│           ├── colere.md
│           └── ...
├── public/
│   ├── manifest.webmanifest               ← généré par ng add @angular/pwa
│   ├── icons/                             ← icônes PWA
│   ├── data/
│   │   └── emotions.json                  ← index toutes émotions (métadonnées)
│   └── content/
│       ├── colere.md                      ← contenu Larivey nettoyé, servi statiquement
│       ├── ressentiment.md
│       └── ...                            ← ~80 fichiers
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.scss                        ← tokens CSS custom properties globaux
    └── app/
        ├── app.ts                         ← AppComponent (shell, router-outlet)
        ├── app.html
        ├── app.scss
        ├── app.config.ts                  ← provideRouter, provideHttpClient, SW
        ├── app.routes.ts                  ← routes lazy, définition complète
        ├── app.spec.ts
        ├── models/
        │   └── emotion.model.ts           ← Emotion, EmotionFamily, Valence, Gender, EmotionType
        ├── data/
        │   └── cycle-templates.ts         ← textes des 5 étapes par valence + gender
        ├── services/
        │   ├── emotion.service.ts         ← charge emotions.json (FR20-22)
        │   ├── content.service.ts         ← fetch lazy .md + fallback (FR6-8)
        │   ├── markdown-parser.service.ts ← extrait sections du markdown
        │   ├── theme.service.ts           ← applique classe CSS famille (theming)
        │   └── emotion-session.service.ts ← état session : famille + émotion courante
        └── features/
            ├── accueil/
            │   ├── accueil.ts             ← FR1, FR2, FR3
            │   ├── accueil.html
            │   ├── accueil.scss
            │   └── accueil.spec.ts
            ├── liste/
            │   ├── liste.ts               ← FR4, FR5
            │   ├── liste.html
            │   ├── liste.scss
            │   └── liste.spec.ts
            ├── fiche/
            │   ├── fiche.ts               ← FR6, FR7, FR8
            │   ├── fiche.html
            │   ├── fiche.scss
            │   └── fiche.spec.ts
            ├── cycle/
            │   ├── cycle.ts               ← FR9-FR13
            │   ├── cycle.html
            │   ├── cycle.scss
            │   └── cycle.spec.ts
            ├── sortie/
            │   ├── sortie.ts              ← FR14-FR17
            │   ├── sortie.html
            │   ├── sortie.scss
            │   └── sortie.spec.ts
            └── credits/
                ├── credits.ts             ← FR18, FR19
                ├── credits.html
                ├── credits.scss
                └── credits.spec.ts
```

### Architectural Boundaries

**Boundaries de données :**

| Limite | Description |
|---|---|
| `emotions.json` → `EmotionService` | Seule porte d'entrée pour les métadonnées. Aucun composant ne lit le JSON directement. |
| `public/content/*.md` → `ContentService` | Seule porte d'entrée pour le contenu Larivey. Encapsule le fetch + le fallback. |
| `MarkdownParserService` | Appelé uniquement par `ContentService`. Aucun composant ne parse du markdown. |
| `EmotionSessionService` | Partagé par toutes les features pour lire/écrire la sélection courante. |
| `ThemeService` | Seul responsable des classes CSS famille sur `<body>`. |

**Boundaries de composants :**

| Route | Composant | Lit depuis | Navigue vers |
|---|---|---|---|
| `/` | `AccueilComponent` | — | `/famille/:familleId` |
| `/famille/:familleId` | `ListeComponent` | `EmotionService` | `/emotion/:emotionId` |
| `/emotion/:emotionId` | `FicheComponent` | `EmotionService`, `ContentService` | `/cycle/:emotionId` |
| `/cycle/:emotionId` | `CycleComponent` | `EmotionSessionService`, `cycle-templates` | `/sortie/:emotionId` |
| `/sortie/:emotionId` | `SortieComponent` | `EmotionSessionService` | `/` (recommencer) |
| `/credits` | `CreditsComponent` | — | — |

### Requirements to Structure Mapping

**FR1-FR3 (Accueil)** → `features/accueil/` + `styles.scss` (tokens couleurs)
**FR4-FR5 (Liste)** → `features/liste/` + `services/emotion.service.ts`
**FR6-FR8 (Fiche)** → `features/fiche/` + `services/content.service.ts`
**FR9-FR13 (Cycle)** → `features/cycle/` + `data/cycle-templates.ts`
**FR14-FR17 (Sortie)** → `features/sortie/`
**FR18-FR19 (Crédits)** → `features/credits/`
**FR20-FR22 (Données)** → `models/emotion.model.ts` + `public/data/emotions.json`

**Préoccupations transversales :**
- Accessibilité WCAG AA → dans chaque composant (ARIA, focus, contrastes)
- Theming → `services/theme.service.ts` + `styles.scss`
- Fallback contenu → `services/content.service.ts`
- PWA/Offline → `ngsw-config.json` + `app.config.ts`

### Data Flow

```
URL /emotion/colere
  → FicheComponent
      → EmotionService.getById('colere')       : Emotion (métadonnées)
      → ContentService.loadContent('colere')   : EmotionContent (sections md)
          → fetch('public/content/colere.md')
          → MarkdownParserService.parse()
          → fallback si section manquante
      → ThemeService.applyFamily('colere')     : classe CSS sur <body>
      → EmotionSessionService.select(emotion)
```

## Architecture Validation Results

### Coherence Validation ✅

**Compatibilité des décisions :** Stack cohérente sans conflits.
Angular 21 + SCSS + CSS custom properties + `marked` + Vitest + HttpClient —
toutes les technologies sont compatibles entre elles.
Lazy loading et service worker PWA fonctionnent ensemble nativement.

**Cohérence des patterns :** Les patterns de naming, structure et communication
sont alignés avec les choix technologiques. Signals + OnPush + standalone :
idiomatiques Angular 21.

**Alignement de la structure :** La structure par feature + services partagés
reflète exactement les boundaries de composants et le data flow défini.

### Requirements Coverage Validation ✅

**Couverture fonctionnelle — tous les FR couverts :**

| FRs | Composant / Service |
|---|---|
| FR1-FR3 (Accueil) | `AccueilComponent` |
| FR4-FR5 (Liste) | `ListeComponent` + `EmotionService` |
| FR6-FR8 (Fiche + fallback) | `FicheComponent` + `ContentService` |
| FR9-FR13 (Cycle) | `CycleComponent` + `cycle-templates.ts` |
| FR14-FR17 (Sortie + filet) | `SortieComponent` (filet en sortie uniquement) |
| FR18-FR19 (Crédits) | `CreditsComponent` |
| FR20-FR22 (Données) | `EmotionService` + `emotion.model.ts` + `emotions.json` |

**Couverture non-fonctionnelle :**
- Performance < 300ms ✓ → CSS pur, pas de @angular/animations
- FCP < 2s ✓ → lazy loading, bundle léger (pas de Tailwind, pas de lib UI)
- Lighthouse ≥ 90 ✓ → PWA + build Vite/esbuild optimisé
- WCAG AA ✓ → règles dans Implementation Patterns
- Hors-ligne ✓ → ngsw-config.json, CacheFirst sur tout le contenu statique
- Zéro donnée personnelle ✓ → règle Agents MUST documentée

### Gaps résolus

| Gap | Résolution |
|---|---|
| FR17 filet de sécurité | `SortieComponent` uniquement — cohérent avec le prototype validé |
| Deep linking | Chaque composant charge son émotion via `EmotionService.getById(routeParam)`. `EmotionSessionService` est un cache de confort, pas la source de vérité. |
| `HttpClient` vs fetch natif | `HttpClient` — `provideHttpClient()` dans `app.config.ts` |
| `marked` absent | À ajouter : `npm install marked` — première story d'implémentation |

### Architecture Completeness Checklist

- [x] Contexte projet analysé et validé
- [x] Complexité et périmètre évalués
- [x] Contraintes techniques identifiées
- [x] Préoccupations transversales cartographiées
- [x] Décisions critiques documentées avec versions
- [x] Stack technique complète et cohérente
- [x] Patterns de naming, structure, communication définis
- [x] Gestion d'erreur et loading states spécifiés
- [x] Structure de projet complète, fichier par fichier
- [x] Boundaries de composants et data flow documentés
- [x] Mapping FR → fichiers/services complet
- [x] Tous les gaps identifiés et résolus

### Architecture Readiness Assessment

**Statut général : PRÊT POUR L'IMPLÉMENTATION**

**Points forts :**
- Architecture client-side pure — aucune dépendance serveur à gérer en MVP
- Modèle de données clair, source de vérité unique (`emotion.model.ts`)
- Theming dynamique élégant via CSS custom properties — zéro JS superflu
- Contenu séparé du code (JSON + Markdown) — éditable sans toucher le TypeScript
- PWA offline dès le départ

**Pour plus tard (post-MVP) :**
- Firebase Hosting / déploiement
- Analytics anonymes
- Pouls chromatique animé (Phase 2)
- Émotions mixtes, repoussées, pseudo (Phase 2)

### Implementation Handoff

**Première story :** `ng add @angular/pwa` + `npm install marked`

**Ordre d'implémentation recommandé :**
1. Setup PWA + HttpClient + routing skeleton
2. Modèle de données (`emotion.model.ts`) + `emotions.json` (quelques émotions)
3. `EmotionService` + `ContentService` + `MarkdownParserService`
4. `AccueilComponent` + `ThemeService`
5. `ListeComponent`
6. `FicheComponent`
7. `CycleComponent` + `cycle-templates.ts`
8. `SortieComponent`
9. `CreditsComponent`
10. Compléter `emotions.json` avec les ~80 fiches + `public/content/*.md`
11. `ngsw-config.json` — caching complet
12. Audit Lighthouse + AXE
