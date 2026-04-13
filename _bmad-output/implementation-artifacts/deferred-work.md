# Deferred Work

Issues surfaced during quick-dev reviews but not addressed in the triggering spec (pre-existing or out-of-scope).

## 2026-04-13 — Route mismatch dans `liste.spec.ts`

- **Fichier :** `src/app/features/liste/liste.spec.ts:119`
- **Symptôme :** Le test asserte `expect(routerSpy).toHaveBeenCalledWith(['/emotion', 'colere'])` alors que `liste.ts` navigue vers `['/cycle', emotion.id]` (ligne ~86).
- **Surfacé par :** revue `acceptance` de la spec `spec-emotions-complexes-liste.md`.
- **Pourquoi différé :** bug pré-existant, non causé par la spec actuelle. Le spec interdit explicitement les corrections hors-périmètre.
- **Action recommandée :** aligner le test sur la route réelle (`/cycle`) dans une future story de tests, en même temps que le setup manquant de `provideTablerIcons` qui fait déjà échouer les 6 tests du fichier sur `main`.

## 2026-04-13 — Setup icônes manquant dans les tests composants

- **Fichier :** `src/app/features/liste/liste.spec.ts` (setup TestBed)
- **Symptôme :** Les 6 tests échouent sur `Error: The arrow-left icon is not provided by any of the icon providers.` sur HEAD `bd9bf42` comme après la présente spec.
- **Surfacé par :** exécution de `ng test --include=…/liste.spec.ts` sur baseline puis post-spec.
- **Pourquoi différé :** bug pré-existant, hors scope. Impacte potentiellement d'autres tests composants utilisant `<tabler-icon>`.
- **Action recommandée :** ajouter `provideTablerIcons({ IconArrowLeft, … })` au TestBed dans les specs concernés, ou factoriser un helper de test global. Note : dans `sortie.spec.ts`, le test `openFiche()` contourne le problème en n'appelant pas `fixture.detectChanges()` après `openFiche()` (la modale contient `<tabler-icon icon="x">`).

## 2026-04-13 — A11y de la modale fiche (pattern partagé cycle + sortie)

- **Fichiers :** `src/app/features/cycle/{cycle.html, cycle.ts, cycle.scss}`, `src/app/features/sortie/{sortie.html, sortie.ts, sortie.scss}`, `src/app/features/dictionnaire/*`.
- **Symptômes :** Surfacés par la review adversariale de `spec-sortie-modale-fiche.md` :
  1. **Aucun retour de focus** sur l'élément déclencheur après `closeFiche()` — WCAG 2.4.3 Focus Order. Après fermeture, le focus tombe sur `<body>`.
  2. **Aucun focus-trap** à l'intérieur du panel ; l'utilisateur peut tabuler hors du dialog malgré `aria-modal="true"` (attribut advisoire, non contraignant).
  3. **`aria-labelledby` peut pointer vers un ID absent** si `emotion()` est `null` quand la modale s'ouvre (race theorique ; en pratique `ngOnInit` redirige vers `/` avant, et la *trigger button* n'apparaît que si `emotion()` existe).
  4. **Bouton `.modal-close` de 36×36 px**, sous le minimum WCAG 2.5.8 (44×44).
- **Surfacé par :** review adversariale assumption de la spec `spec-sortie-modale-fiche.md`.
- **Pourquoi différé :** pattern hérité de `cycle.html:94-154` / `cycle.scss:195-304`. La spec actuelle impose une copie conforme (`cycle.scss:195-304` → `sortie.scss`). Fixer ces points dans `sortie` seul créerait une divergence; il faut adresser `cycle` et `dictionnaire` de façon coordonnée.
- **Action recommandée :** story dédiée a11y modales — sauvegarder `document.activeElement` à `openFiche()`, restaurer à `closeFiche()` ; implémenter un `@Directive()` focus-trap ou utiliser `@angular/cdk/a11y`'s `FocusTrap` ; passer `.modal-close` à 44×44 (ou agrandir la hitbox via `::after` comme pour `.cycle__dot`) ; sécuriser `aria-labelledby` via fallback `aria-label`.

## 2026-04-13 — Tests sortie désynchronisés du template (messages)

- **Fichier :** `src/app/features/sortie/sortie.spec.ts:78, 108, 118`
- **Symptôme :** 3 tests assertent des sous-chaînes (`'Prenez soin de vous'` sur état initial, `'Continuez à vous écouter'` sur merci, `"Ce n'est pas grave"` sur pas-vraiment) qui **n'existent plus** dans `sortie.html`. Le template affiche aujourd'hui respectivement `"J'espère que cette parenthèse vous a fait du bien."`, `"Prenez soin de vous. Revenez quand vous voulez."`, `"Ça ne marche pas à tous les coups…"`.
- **Surfacé par :** exécution de `ng test --include=…/sortie.spec.ts` sur baseline bd9bf42 (3 failed / 14) puis post-spec (3 failed / 22).
- **Pourquoi différé :** bug pré-existant, non causé par la spec actuelle (`spec-sortie-modale-fiche.md`). La spec interdit explicitement la correction de bugs hors-périmètre.
- **Action recommandée :** aligner les assertions sur les textes réels du template, ou s'appuyer plutôt sur des ancres DOM stables (classes `.sortie__message--humble`, etc.) dans une future story de tests.
