---
title: 'Modale fiche accessible depuis les deux états finaux de la sortie'
type: 'feature'
created: '2026-04-13'
status: 'done'
baseline_commit: 'bd9bf42'
context:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Après le cycle, la page `sortie` propose soit *Oui merci* → clôture, soit *Pas vraiment* → réessayer. Dans les deux états post-choix (`merci` et `pas-vraiment`), le visiteur ne peut pas accéder au contenu Larivey (description, utilité, erreurs typiques) alors que ces informations pourraient débloquer la compréhension — surtout pour les émotions complexes (mixte, pseudo, repoussée) nouvellement disponibles.

**Approach:** Sur les états `merci` et `pas-vraiment`, remplacer le bouton unique par deux boutons empilés verticalement : **« En savoir plus sur [nom émotion] »** (ouvre une modale fiche, pattern identique à la modale du cycle) et en dessous **« Retour à l'accueil »** (navigation vers `/`). L'état `initial` reste inchangé. La modale charge le contenu via `ContentService.loadContent()`. Le CSS des classes modales (`.modal-overlay`, `.modal-panel`, `.modal-close`, `.modal-fiche__*`) est **dupliqué dans `sortie.scss`** en copie conforme de `cycle.scss:195-304`, suivant le pattern déjà en place (cycle + dictionnaire). Le refactor global vers `styles.scss` est explicitement différé à une future story.

## Boundaries & Constraints

**Always:**
- Les deux nouveaux boutons sont présents sur `state === 'merci'` **et** `state === 'pas-vraiment'`, dans l'ordre : fiche d'abord, retour accueil en dessous.
- Le libellé du bouton fiche interpole le nom émotion en **minuscule initiale** (ex: *« En savoir plus sur la colère »*, *« En savoir plus sur l'amour »*, *« En savoir plus sur le désir »*) — l'article reste, seule la première lettre passe en minuscule.
- La modale respecte le même pattern que `cycle.html:94-154` : `role="dialog"`, `aria-modal="true"`, overlay cliquable pour fermer, Escape pour fermer, bouton × en haut à droite, sections conditionnelles (`examples`, `description`, `utility`, `typicalErrors`) via `fiche_md`.
- Accessibilité : focus-trap déclenché par `autofocus` sur le bouton close (pattern cycle), `aria-labelledby` pointant vers le `<h2>` titré avec le nom émotion.
- `ChangeDetectionStrategy.OnPush`, signals pour l'état modale, standalone, pas de `standalone: true` dans le décorateur, `host` object.
- Le bouton « Retour à l'accueil » appelle `recommencer()` (existant) dans les deux états, indifféremment.
- **CSS modale dans `sortie.scss`** : dupliquer les classes `.modal-overlay`, `.modal-panel`, `.modal-close`, `.modal-fiche__*` en copie conforme de `cycle.scss:195-304`. Le refactor global (extraction vers `styles.scss`) est différé à une future story.

**Ask First:**
- Toute modification du texte du message (*« Prenez soin de vous… »*, *« Ça ne marche pas à tous les coups… »*).
- Toute modification de l'état `initial` (boutons *Oui merci* / *Pas vraiment*).
- Toute modification du filet de sécurité (3114 / SOS Amitié).

**Never:**
- Ne pas ajouter de bouton fiche sur l'état `initial`.
- Ne pas créer de nouvelle route ni toucher à `app.routes.ts`.
- Ne pas modifier `cycle.ts`, `cycle.html`, `fiche.ts`, `fiche.html`, ni le `ContentService`.
- Ne pas modifier `cycle.scss`, `dictionnaire.scss`, ni `styles.scss` (le refactor global est hors-scope).
- Ne pas modifier les valeurs CSS des classes modales lors de la duplication (copie conforme de `cycle.scss:195-304`).
- Ne pas corriger de bugs pré-existants non liés.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| État initial | `state === 'initial'` | Affiche *Oui merci* / *Pas vraiment* (inchangé) | N/A |
| Après « Oui merci » | `state === 'merci'` | Message de clôture + 2 boutons empilés : *En savoir plus sur …* / *Retour à l'accueil* | N/A |
| Après « Pas vraiment » | `state === 'pas-vraiment'` | Message humble + 2 boutons empilés : *En savoir plus sur …* / *Retour à l'accueil* | N/A |
| Clic « En savoir plus » | Modale fermée | Modale s'ouvre, charge et affiche les 4 sections du fichier markdown | Si fetch échoue, fallback du `ContentService` existant s'applique |
| Clic overlay / touche Escape | Modale ouverte | Modale se ferme, on reste dans le même state post-choix | N/A |
| Clic « Retour à l'accueil » | Un des deux states post-choix | Navigation vers `/`, thème réinitialisé | N/A |
| Nom avec apostrophe | Émotion `L'amour` | Bouton = *« En savoir plus sur l'amour »* | N/A |
| Nom avec article *Le* | Émotion `Le désir` | Bouton = *« En savoir plus sur le désir »* | N/A |
| Émotion introuvable | `emotion() === null` | Les boutons et le header n'apparaissent pas (comportement existant `@if (emotion()…)`) | Redirection `/` déjà gérée dans `ngOnInit` |

</frozen-after-approval>

## Code Map

- `src/app/features/sortie/sortie.ts` -- Ajouter l'état modale (signals), l'injection `ContentService`, les méthodes `openFiche / closeFiche / onFicheKeydown`, et le helper `emotionNameLc()`.
- `src/app/features/sortie/sortie.html` -- Restructurer les blocs `merci` et `pas-vraiment` avec les 2 nouveaux boutons ; ajouter la markup modale en bas du template.
- `src/app/features/sortie/sortie.scss` -- Ajouter `.sortie__actions--stack` pour empilement vertical, et dupliquer les classes modales (`.modal-overlay`, `.modal-panel`, `.modal-close`, `.modal-fiche__*`) en copie conforme de `cycle.scss:195-304`.
- `src/app/features/sortie/sortie.spec.ts` -- Tests : 2 boutons dans chaque post-state, ouverture modale, navigation home, helper `emotionNameLc()`.
- `src/app/features/cycle/cycle.html` -- Référence (lecture seule, pattern modale à copier dans sortie.html).
- `src/app/features/cycle/cycle.scss` -- Référence (lecture seule, CSS modale à copier dans sortie.scss).

## Tasks & Acceptance

**Execution:**
- [x] `src/app/features/sortie/sortie.ts` -- Injecter `ContentService` ; importer `EmotionContent`, `MarkdownPipe`, `TablerIconComponent` ; ajouter `ficheModalOpen`, `ficheContent`, `ficheLoading` signals ; ajouter `openFiche()`, `closeFiche()`, `onFicheKeydown(event)`, `emotionNameLc(): string` (retourne nom avec 1re lettre en minuscule, chaîne vide si pas d'émotion). -- Rationale : état modale + helper de libellé.
- [x] `src/app/features/sortie/sortie.html` -- Dans `state === 'merci'` et `state === 'pas-vraiment'`, remplacer le bouton unique par un conteneur `.sortie__actions--stack` contenant deux `<button>` : « En savoir plus sur {{ emotionNameLc() }} » (aria-label similaire, appelle `openFiche()`) et « Retour à l'accueil » (appelle `recommencer()`) ; ajouter en bas la markup modale calquée sur `cycle.html:94-154` (4 sections conditionnelles via `fiche_md`, close auto-focus, aria-labelledby). -- Rationale : UX demandée, pattern consistant.
- [x] `src/app/features/sortie/sortie.scss` -- Ajouter `.sortie__actions--stack { flex-direction: column; align-items: center; }` ou équivalent, largeur bouton cohérente avec le reste ; éventuel max-width pour éviter des boutons trop larges. Les règles `.sortie__btn` existantes s'appliquent déjà. Dupliquer aussi les classes modales (`.modal-overlay`, `.modal-panel`, `.modal-close`, `.modal-fiche__nom`, `.modal-fiche__scroll`, `.modal-fiche__loading`, `.modal-fiche__section`, `.modal-fiche__section-label`, `.modal-fiche__section-body`) en copie conforme depuis `cycle.scss:195-304`. -- Rationale : empilement vertical + pattern CSS cohérent avec cycle/dictionnaire (refactor global différé).
- [x] `src/app/features/sortie/sortie.spec.ts` -- Couvrir : (a) état `merci` affiche 2 boutons avec les bons libellés pour une émotion `La colère`, (b) état `pas-vraiment` idem, (c) clic sur « En savoir plus » met `ficheModalOpen` à `true` et déclenche `ContentService.loadContent`, (d) clic sur « Retour à l'accueil » déclenche `recommencer()` → `router.navigate(['/'])`, (e) `emotionNameLc()` sur `L'amour` → `l'amour`. -- Rationale : couverture du nouveau contrat.

**Acceptance Criteria:**
- Given un visiteur sur `/sortie/colere` après avoir cliqué *Oui merci*, when il voit l'écran, then il voit exactement 2 boutons empilés : *En savoir plus sur la colère* puis *Retour à l'accueil*.
- Given le même visiteur, when il clique *En savoir plus sur la colère*, then une modale s'ouvre contenant les sections Exemples / Définition / À quoi ça sert / Erreurs typiques issues de `colere.md`.
- Given la modale ouverte, when il appuie sur Escape ou clique en dehors du panneau, then la modale se ferme et l'état `merci` reste actif.
- Given le même scénario mais avec *Pas vraiment* au lieu de *Oui merci*, when l'utilisateur voit l'écran, then les mêmes 2 boutons apparaissent (même libellés).
- Given l'état `initial`, when la page s'affiche, then aucun bouton fiche n'apparaît (inchangé).
- Given un clic sur *Retour à l'accueil*, when la navigation s'exécute, then `ThemeService.resetFamily()` est appelé avant `router.navigate(['/'])`.

## Spec Change Log

## Design Notes

**Abaissement de casse du nom :**
```ts
emotionNameLc(): string {
  const n = this.emotion()?.name ?? '';
  return n ? n.charAt(0).toLocaleLowerCase('fr') + n.slice(1) : '';
}
```
Couvre *La colère → la colère*, *L'amour → l'amour*, *Le désir → le désir* sans toucher à l'article. Pas besoin de stripper l'article — la construction *« En savoir plus sur [article + nom] »* est grammaticalement correcte.

**Pattern modale à copier depuis `cycle.html:94-154` :** overlay + panel + close button + 4 sections conditionnelles. Ne PAS dupliquer les CSS (classes globales). Les signals/handlers reproduisent la logique de `cycle.ts:70-75,122-139`.

## Verification

**Commands:**
- `npx ng build` -- expected: build success, aucune erreur TS.
- `npx ng test --watch=false --include="src/app/features/sortie/sortie.spec.ts"` -- expected: tous les tests de sortie passent.

**Manual checks:**
- Lancer `ng serve`, choisir une émotion → finir le cycle → cliquer *Oui merci* → vérifier les 2 boutons → ouvrir la modale → parcourir les 4 sections → Escape.
- Recommencer avec *Pas vraiment* → vérifier les mêmes boutons.
- Tester avec une émotion complexe nouvellement accessible (ex: *La frustration* — pseudo) pour s'assurer que le contenu fiche se charge.
- Tester navigation accueil depuis chacun des 2 states.

## Suggested Review Order

**Cœur du changement — état + méthodes modale**

- Injection `ContentService`, signals modale (`ficheModalOpen`, `ficheContent`, `ficheLoading`) et handlers calqués sur cycle.
  [`sortie.ts:34`](../../src/app/features/sortie/sortie.ts#L34)

- Helper `emotionNameLc` en `computed()` (dérivé du signal `emotion`), minuscule initiale FR — couvre *La colère → la colère*, *L'amour → l'amour*.
  [`sortie.ts:105`](../../src/app/features/sortie/sortie.ts#L105)

**Template — 2 boutons empilés + markup modale**

- `state === 'merci'` et `state === 'pas-vraiment'` reçoivent le conteneur `.sortie__actions--stack` avec *En savoir plus sur {{ emotionNameLc() }}* puis *Retour à l'accueil*. État `initial` inchangé.
  [`sortie.html:38`](../../src/app/features/sortie/sortie.html#L38)

- Markup modale fin de template — copie conforme de `cycle.html:94-154` (overlay click/Escape, autofocus close, 4 sections `@if` via `fiche_md`). ID `sortie-fiche-modal-titre` pour éviter toute collision avec `cycle`.
  [`sortie.html:100`](../../src/app/features/sortie/sortie.html#L100)

**Styles — empilement + duplication conforme modale**

- `.sortie__actions--stack` : colonne, `max-width: 340px` pour garder des boutons lisibles.
  [`sortie.scss:56`](../../src/app/features/sortie/sortie.scss#L56)

- Duplication 1:1 des classes `.modal-overlay`, `.modal-panel`, `.modal-close`, `.modal-fiche__*` depuis `cycle.scss:195-304`. Refactor global différé (cf `deferred-work.md`).
  [`sortie.scss:127`](../../src/app/features/sortie/sortie.scss#L127)

**Tests — couverture du nouveau contrat**

- 8 tests ajoutés : 2 boutons dans chaque post-state, libellés corrects, absence en `initial`, `openFiche` → `ficheModalOpen=true` + spy `ContentService.loadContent`, `closeFiche`, Escape, `emotionNameLc` pour `La colère` et `L'amour`.
  [`sortie.spec.ts:162`](../../src/app/features/sortie/sortie.spec.ts#L162)

**Notes hors-scope (dans `deferred-work.md`)**

- A11y modale (focus-return, focus-trap, hit-area close 44×44, `aria-labelledby` défensif) — pattern hérité de `cycle`, à fixer dans une story dédiée qui traite cycle + sortie + dictionnaire de front.
- 3 tests `sortie.spec.ts` pré-existants désynchronisés du template (messages `'Prenez soin de vous'` / `'Continuez à vous écouter'` / `"Ce n'est pas grave"` absents du HTML) — déjà rouges sur `bd9bf42`.
