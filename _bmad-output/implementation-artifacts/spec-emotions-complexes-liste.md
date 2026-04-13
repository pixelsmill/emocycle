---
title: 'Étendre la liste par famille à toutes les émotions (complexes incluses)'
type: 'feature'
created: '2026-04-13'
status: 'done'
baseline_commit: 'bd9bf42'
context:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La liste d'émotions par famille (route `/famille/:familleId`) n'affiche que les émotions de type `simple` (FR22 du PRD, restriction MVP). Le visiteur ne peut donc pas lancer le cycle sur une émotion `mixte`, `repoussee`, `pseudo` ou `inconnu` depuis l'entrée par couleur, alors que ces 63 émotions supplémentaires existent déjà dans `emotions.json` et que le dictionnaire les expose déjà.

**Approach:** Lever le filtre `type === 'simple'` dans `EmotionService.getByFamily()` pour retourner **toutes** les émotions d'une famille, triées alphabétiquement (accent-aware FR). Dans la liste (`liste.html`), ajouter un attribut HTML `title` sur chaque bouton révélant le type de l'émotion au survol, sans autre distinction visuelle. Aucune modification du cycle, des templates, ni du fallback fiche.

## Boundaries & Constraints

**Always:**
- `getByFamily()` filtre uniquement par `family`, jamais par `type`.
- Tri alphabétique FR via `localeCompare(other, 'fr')` — cohérent avec le `dictionnaire`.
- Le `title` contient une valeur lisible (ex: `"Émotion simple"`, `"Émotion mixte"`, `"Émotion repoussée"`, `"Pseudo-émotion"`, `"Type inconnu"`).
- Les tests unitaires concernés (`emotion.service.spec.ts`, `liste.spec.ts`) sont mis à jour pour refléter le nouveau comportement.
- `changeDetection: OnPush`, signals, standalone par défaut — respecter les règles CLAUDE.md.

**Ask First:**
- Toute modification au cycle (`cycle.ts`, `cycle-templates.ts`), à la fiche, au fallback ou à la logique de sélection d'émotion.
- Toute suppression ou refactor au-delà du filtre et du `title`.

**Never:**
- Ne pas modifier `emotion.model.ts` (le type `EmotionType` reste inchangé).
- Ne pas toucher au `dictionnaire` (déjà exhaustif).
- Ne pas ajouter de badge, d'icône, de section séparée, ni d'altération visuelle sur les émotions non-simples.
- Ne pas mettre à jour le PRD / l'architecture / les stories : la présente spec documente l'évolution hors-MVP.
- Ne pas corriger de bugs pré-existants non liés (ex: incohérence éventuelle de route dans `liste.spec.ts`).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Famille avec types mixtes | `getByFamily('amour')` sur dataset complet | Retourne toutes les émotions `family === 'amour'` (simple + mixte + pseudo…), triées alphabétiquement FR | N/A |
| Famille sans émotion simple | Famille où aucune émotion n'est `simple` | Retourne toutes les émotions non-simples de la famille | N/A |
| Famille inexistante | `getByFamily('inconnu' as any)` | Retourne `[]` | N/A |
| Rendu liste | Composant affiche `emotions()` | Chaque `<button.liste__item>` possède `title="Émotion {typeLabel}"` | N/A |
| Type `inconnu` au survol | Émotion avec `type: 'inconnu'` | `title="Type inconnu"` | N/A |
| Chargement en cours | `emotions()` vide car service loading | Affiche `@empty` ("Aucune émotion trouvée.") | Comportement existant inchangé |

</frozen-after-approval>

## Code Map

- `src/app/services/emotion.service.ts` -- Retirer le filtre `e.type === 'simple'` dans `getByFamily()` + ajouter tri alphabétique FR.
- `src/app/services/emotion.service.spec.ts` -- Mettre à jour le test `getByFamily()` : on attend maintenant toutes les émotions de la famille.
- `src/app/features/liste/liste.html` -- Ajouter `[attr.title]="typeLabel(emotion)"` sur chaque bouton `.liste__item`.
- `src/app/features/liste/liste.ts` -- Ajouter la méthode `typeLabel(emotion: Emotion): string` mappant `EmotionType` vers libellé FR.
- `src/app/features/liste/liste.spec.ts` -- Ajouter un test vérifiant la présence de l'attribut `title` avec la bonne valeur.
- `public/data/emotions.json` -- Source de vérité (lecture seule, non modifiée).

## Tasks & Acceptance

**Execution:**
- [x] `src/app/services/emotion.service.ts` -- Dans `getByFamily`, remplacer le filtre par `(e) => e.family === family` et trier par `name.localeCompare(b.name, 'fr')`. -- Rationale : retirer la restriction MVP simple-only, harmoniser l'ordre avec le dictionnaire.
- [x] `src/app/services/emotion.service.spec.ts` -- Réécrire le test `getByFamily() should return ...` : la famille `colere` du mock contient `colere` (simple) + `frustration` (pseudo), on attend `length === 2` triés par nom. -- Rationale : aligner les attentes sur le nouveau contrat.
- [x] `src/app/features/liste/liste.ts` -- Ajouter `readonly TYPE_LABELS: Record<EmotionType, string>` et une méthode `typeLabel(e: Emotion): string`. Importer `EmotionType`. -- Rationale : libellé humain réutilisé via `title`.
- [x] `src/app/features/liste/liste.html` -- Ajouter `[attr.title]="typeLabel(emotion)"` sur le `<button class="liste__item">`. -- Rationale : exposer le type au survol sans modification visuelle.
- [x] `src/app/features/liste/liste.spec.ts` -- Ajouter une émotion pseudo au mock (`frustration`), vérifier que la liste en contient 4, et asserter que le bouton de `frustration` porte `title="Pseudo-émotion"`. -- Rationale : couvrir le nouvel attribut et le comportement élargi.

**Acceptance Criteria:**
- Given un utilisateur sur `/famille/colere`, when la page charge, then il voit toutes les émotions de la famille `colere` (simple + mixte + pseudo + …), triées alphabétiquement.
- Given un utilisateur qui survole un bouton d'émotion, when le curseur reste sur le bouton, then le tooltip natif du navigateur affiche `"Émotion {type en FR}"`.
- Given les tests unitaires, when on lance `npm test`, then `emotion.service.spec.ts` et `liste.spec.ts` passent intégralement.
- Given un utilisateur clique sur une émotion complexe (ex: `frustration`), when le cycle démarre, then il se déroule sans erreur avec les templates existants (aucune régression).

## Spec Change Log

## Verification

**Commands:**
- `npx ng build` -- expected: build success, aucune erreur TS.
- `npx vitest run src/app/services/emotion.service.spec.ts src/app/features/liste/liste.spec.ts` -- expected: tous les tests passent.
- `npx ng test --watch=false` -- expected: la suite complète reste verte.

**Manual checks (if no CLI):**
- Ouvrir `/famille/amour` dans le dev server : vérifier la présence de `L'amour` (mixte), `La compassion` (pseudo), `L'attendrissement` (simple), etc., ordre alphabétique FR.
- Survoler les boutons : tooltip natif conforme au type.
- Cliquer une émotion non-simple → le cycle se lance jusqu'à la sortie sans erreur console.

## Suggested Review Order

**Cœur du changement : filtrage → exhaustif + tri FR**

- Le filtre `type === 'simple'` disparaît ; tri alphabétique FR pour un ordre stable.
  [`emotion.service.ts:36`](../../src/app/services/emotion.service.ts#L36)

**Tooltip de type sur chaque émotion**

- Table exhaustive `Record<EmotionType,string>` → libellé humain FR, compile-time safe.
  [`liste.ts:30`](../../src/app/features/liste/liste.ts#L30)

- Méthode one-liner exposée au template pour le binding.
  [`liste.ts:78`](../../src/app/features/liste/liste.ts#L78)

- Attribut `title` natif ajouté à côté de l'`aria-label` existant.
  [`liste.html:14`](../../src/app/features/liste/liste.html#L14)

**Tests (couverture du nouveau contrat)**

- Assertion du service : 2 émotions (simple + pseudo) triées par nom.
  [`emotion.service.spec.ts:73`](../../src/app/services/emotion.service.spec.ts#L73)

- Mock enrichi d'une émotion pseudo pour couvrir le cas non-simple.
  [`liste.spec.ts:13`](../../src/app/features/liste/liste.spec.ts#L13)

- Test dédié au rendu du `title` pour deux types distincts.
  [`liste.spec.ts:80`](../../src/app/features/liste/liste.spec.ts#L80)

