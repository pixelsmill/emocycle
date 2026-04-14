# Nettoyage des fichiers markdown (`public/content/*.md`)

## 1. Mots collés (espaces manquants)

Les fichiers proviennent d'un copier-coller qui a supprimé les retours à la ligne sans remettre d'espace entre les mots. Exemples : `estnon`, `d'unproblème`, `émotionqui`.

Concerne ~50+ fichiers. Remplacement prudent nécessaire.

## 2. `**sous-titres**` → `### sous-titres`

Les textes en gras sur leur propre ligne servent de sous-titres. Les convertir en `###`.

Cas à traiter :
- Espaces/tabs avant ou après : `      **Une connaissance partielle**`
- Mal fermés (espace avant `**`) : `**La peur est subjective **`
- Tabs à l'intérieur : `**\tViolence et intensité**`

Ne PAS toucher :
- `**Type :** ...` (ligne 3 de chaque fichier, ce n'est pas un sous-titre)
- `**N.B.**` (note inline)
- `**Exemple #N**` (labels d'exemples, pas des sous-titres)

## 3. Espaces multiples au milieu du texte

Du padding d'alignement hérité du document source : des paquets d'espaces entre deux morceaux de phrase.

Exemples :
- `agitée.         Impossible de la calmer.`
- `débloquer    ce programme en vain!`
- `la plupart    du temps de mauvaise humeur.`

Action : réduire à un seul espace.

## 4. Tirets de liste incohérents

Certains items commencent par `-  ` (double espace) ou ont un espace avant le tiret.

Exemples :
- `frustration.md:13` : `-  Je me sens profondément frustrée.`
- `colere.md:64` : `-  Erreur #2:`
- `colere.md:71` : `-  Erreur #3:`

Action : normaliser en `- ` (tiret + un seul espace).

## 5. Phrases fusionnées (saut de paragraphe manquant)

Cas plus grave que les mots collés : deux phrases sans rapport fusionnées sans ponctuation logique.

Exemple dans `frustration.md:25` :
> `...je considèreImaginons les réflexions des personnages...`

Probablement rare. À traiter au cas par cas.

## 6. Espaces trailing (double espace = `<br>`)

En markdown, 2+ espaces en fin de ligne produisent un `<br>`. C'est utile pour aérer un long paragraphe entre deux phrases, mais indésirable au milieu d'une phrase.

Action : supprimer les doubles espaces trailing uniquement quand ils coupent une phrase en cours (pas de majuscule/ponctuation forte avant la coupure). Conserver ceux qui tombent en fin de phrase.

## 7. Lignes vides multiples

Réduire les séquences de lignes vides consécutives à maximum 1 ligne vide.

Concerne surtout : fin de fichier (avant `---`), entre items de listes.

## 8. Liens et références morts

Des mentions textuelles d'articles/pages qui n'existent plus :
- `Voyez l'article : "La phobie démystifiée"`
- `voir "Conquérir la liberté d'être soi-même"`
- `(Pour en savoir plus... La vie d'une émotion)`
- Un lien markdown : `[culpabilité saine](#saine)` dans `culpabilite.md`

Action : supprimer les liens uniquement, garder le texte autour tel quel.

## 9. Crédits en bas de fichier

Supprimer le bloc de crédits en bas de chaque fichier :
```
---
_Source : Guide des émotions, Michelle Larivey, Ressources en Développement_
```

Avant suppression, sauvegarder un exemple dans `public/content/credits.md`. Une seule variante suffit.

Les crédits seront centralisés dans la page crédits de l'app uniquement.
