---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
inputDocuments:
  - 'documents/projet_emotions.md'
  - '_bmad-output/brainstorming/brainstorming-session-2026-04-04-1500.md'
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 1
classification:
  projectType: 'web_app_pwa'
  domain: 'bien-être / développement personnel'
  complexity: 'medium'
  projectContext: 'greenfield'
---

# Product Requirements Document — Emotions

**Date :** 2026-04-04

## Résumé exécutif

**Emotions** est une PWA intime et mobile-first qui accompagne l'utilisateur dans l'écoute de ses émotions. Fondée sur les travaux de Jean Garneau et Michelle Larivey (*Les émotions source de vie*, 2000), l'app repose sur une idée simple : une émotion est un message qui renseigne sur un besoin. Quand on laisse le cycle émotionnel se dérouler — émergence, sensation, reconnaissance, expression, action — le message est reçu et l'émotion se dissout naturellement. Quand on l'interrompt, elle persiste.

L'app cible toute personne qui ressent une émotion et souhaite l'écouter plutôt que la réprimer ou la rationaliser. Elle ne demande ni inscription, ni effort préalable. L'utilisateur entre par une expérience sensorielle (une palette de couleurs), choisit un mot, et se laisse guider à travers les étapes du cycle. Le contenu est issu directement du guide des émotions de Larivey (~80 fiches), structuré pour nourrir chaque étape.

Ce projet est aussi un hommage personnel : ce livre m'a aidé à un moment difficile de ma vie.

### Ce qui rend ce produit spécial

- **Pas un mood tracker.** Pas de journal quotidien, pas de graphiques d'humeur. Un moment présent, une émotion à la fois — le Cycle-Présent.
- **L'intelligence est dans la structure, pas dans l'IA.** Le cycle de vie émotionnel, la classification positif/négatif, les 4 types d'expériences (simple, mixte, repoussée, pseudo-émotion) — tout vient du contenu Larivey/Garneau, pas d'un algorithme.
- **L'entrée par la couleur.** Une palette de 6 familles émotionnelles, puis les mots associés. L'identification passe par le ressenti, pas par la cognition.
- **Le ton.** L'app ne moralise pas, ne promet pas de guérison. Elle crée un espace. "Ce n'est pas grave. Vous avez eu le courage d'essayer."

## Classification du projet

| Attribut | Valeur |
|---|---|
| Type | Web App — PWA Angular, mobile-first |
| Domaine | Bien-être / développement personnel |
| Complexité | Moyenne — contenu riche à structurer, données sensibles (RGPD), accessibilité WCAG AA |
| Contexte | Greenfield — aucun code existant |
| Stack | Angular, Firebase (Firestore, Auth, Hosting, Functions) |

## Critères de succès

### Succès utilisateur

- **Taux d'appréciation ≥ 25%** — Mesuré via le bouton [Merci] en fin de parcours (vs [Pas vraiment])
- **Fréquentation non nulle et récurrente** — Des visiteurs reviennent
- **Bouche-à-oreille** — L'app est partagée sur les réseaux sociaux, mentionnée par des professionnels (psychologues, coaches, enseignants) ou relayée par des médias

### Succès projet

- **Reconnaissance d'une compétence** — Faire reconnaître un savoir-faire d'adaptation interactive de contenus sérieux. À la croisée du serious game et du webdoc, sans être ni l'un ni l'autre : un format qui rend un contenu psychologique dense accessible et vivant par l'interaction.
- **Pièce de portfolio** — Démontrer la capacité à transformer un corpus textuel existant en expérience utilisateur engageante

### Succès technique

- **PWA installable** — Score Lighthouse PWA ≥ 90, fonctionne hors-ligne pour le contenu statique
- **Accessibilité WCAG AA** — Zéro erreur AXE, focus management, contrastes validés
- **Performance mobile** — First Contentful Paint < 2s, interaction fluide sur appareils milieu de gamme
- **Données sensibles** — Aucune donnée émotionnelle personnelle stockée côté serveur sans consentement explicite (RGPD)

## Parcours utilisateur

### Parcours 1 : Léa — Le cycle qui se déroule

**Qui :** Léa, 32 ans, en conflit silencieux avec sa collègue depuis une semaine. Elle sent quelque chose mais ne sait pas quoi.

**Scène d'ouverture :** Tard le soir, sur son téléphone. Elle tombe sur le site. Écran presque vide, une palette de couleurs. La phrase : "Chaque émotion a un message pour vous. Touchez la couleur qui vous parle."

**Action montante :** Elle tape sur le rouge orangé. Une liste apparaît sur un fond dégradé de cette même couleur : colère, rage, impatience, frustration, ressentiment... Les mots grossissent et diminuent au scroll. "Ressentiment" — oui, c'est ça. Elle tape.

La fiche apparaît, baignée dans la teinte choisie : définition, exemples. Elle se reconnaît. Puis : "Votre ressentiment a quelque chose à vous dire."

**Climax :** Étape par étape, elle traverse le cycle. Émergence : "Cette émotion est là. Laissez-la prendre sa place." Sensation : elle sent la tension dans sa mâchoire. Reconnaissance : "Un de vos besoins demande votre attention" — elle réalise que c'est un besoin de respect. Expression, action : elle imagine ce qu'elle pourrait dire à sa collègue.

**Résolution :** Écran de sortie. "Prenez soin de vous. Revenez quand vous voulez." Elle appuie sur [Merci]. Le ressentiment ne s'est pas évaporé, mais elle sait de quoi il parle maintenant.

### Parcours 2 : Marc — L'émotion introuvable (post-MVP)

**Qui :** Marc, 45 ans. Il se sent "bizarre" mais ne saurait pas dire quoi.

**Scène d'ouverture :** Même écran. Les couleurs sont là. Rien ne résonne vraiment. Il hésite, tape sur un bleu-violet par défaut.

**Action montante :** La liste apparaît : peur, inquiétude, anxiété, angoisse... Aucun mot ne colle. Il scrolle, rien ne s'impose.

**Climax :** Il tape "Non, je ressens autre chose". Le dictionnaire complet des ~80 émotions s'affiche. Il parcourt, s'arrête sur "vide". Oui. C'est ça.

**Résolution :** La fiche est courte (1 section seulement). Le fallback bienveillant prend le relais pour les étapes du cycle manquantes. L'expérience est moins riche mais reste complète. Marc appuie sur [Pas vraiment]. Le message : "Ce n'est pas grave. Vous avez eu le courage d'essayer, et c'est déjà beaucoup."

### Parcours 3 : L'administrateur — Le tableau de bord (post-MVP)

**Qui :** Le créateur du site, qui veut comprendre si l'app touche les gens.

**Scène d'ouverture :** Connexion à un espace admin protégé.

**Action montante :** Tableau de bord simple : nombre de parcours démarrés, taux de complétion, ratio [Merci]/[Pas vraiment], émotions les plus choisies, couleurs les plus tapées.

**Climax :** Le taux [Merci] dépasse 25%. Une émotion inattendue domine les choix — l'ennui. Ça donne une idée pour enrichir cette fiche.

**Résolution :** Les stats confirment que l'expérience fonctionne et orientent les améliorations de contenu.

### Parcours 4 : Sophie — La curiosité professionnelle

**Qui :** Sophie, psychologue. Elle a vu le lien partagé par un collègue. Elle veut comprendre l'approche et savoir qui est derrière.

**Scène d'ouverture :** Elle fait le parcours une première fois, intriguée par le format. Puis elle cherche un "à propos".

**Action montante :** Page de crédits accessible depuis un lien discret (footer ou menu). Elle y trouve : la source (Garneau & Larivey, le livre, le guide des émotions), l'intention du projet, et un moyen de contacter le créateur.

**Climax :** Elle reconnaît le travail de Larivey, apprécie la démarche de mise en forme interactive. Elle envoie un message.

**Résolution :** Un échange s'amorce. Le projet gagne en visibilité auprès d'un public professionnel — exactement le type de reconnaissance visée.

### Synthèse des capacités révélées

| Parcours | Capacités requises |
|---|---|
| Léa (succès) | Palette de couleurs, liste par couleur, couleur de fond persistante, fiche Larivey, cycle 5 étapes, bifurcation +/-, exemples-guides, sortie douce |
| Marc (alternatif) | Sortie "Autre chose", dictionnaire complet, fallback bienveillant, message humble |
| Admin | Espace protégé, tableau de bord stats, données anonymes agrégées |
| Sophie (crédits) | Page crédits/à propos, sources, intention, contact créateur |

## Exigences spécifiques au domaine

### Données personnelles et RGPD

- Le MVP ne stocke aucune donnée personnelle côté serveur — pas de compte utilisateur, pas de session persistante
- Les analytics anonymes (post-MVP) ne constituent pas des données personnelles tant qu'elles ne sont pas rattachées à un identifiant
- Si un stockage côté serveur est ajouté (comptes, historique), les émotions étant des données sensibles au sens de l'article 9 du RGPD, un consentement explicite et des mesures de protection renforcées seront requis

### Propriété intellectuelle

- Le contenu des fiches provient du guide des émotions de Michelle Larivey et Jean Garneau (redpsy.com, ~1998-2005)
- **Action requise avant publication :** vérifier le statut des droits d'auteur et obtenir une autorisation si nécessaire
- La page de crédits doit attribuer clairement la source du contenu

### Responsabilité éthique

- L'app n'est pas un dispositif médical et ne doit jamais promettre un résultat thérapeutique
- Le filet de sécurité (numéros d'écoute) doit être accessible à tout moment du parcours, pas seulement en fin de cycle
- Le ton reste humble : accompagner, pas diagnostiquer

## Innovation et approches originales

### Axes d'innovation

- **Un format hybride inédit** — À la croisée du serious game et du webdoc, sans être ni l'un ni l'autre. Un corpus psychologique dense (guide des émotions, ~1998) transformé en expérience interactive minimaliste et sensorielle.
- **L'entrée par la couleur** — Le choix de l'émotion passe par le corps (tap sur une couleur, scroll physique) plutôt que par la cognition (formulaire, recherche textuelle).
- **L'absence volontaire d'IA** — L'intelligence est dans la structure du contenu (cycle émotionnel, classification, bifurcation) et la qualité de l'interaction. Choix assumé.
- **Le pari du minimalisme** — Zéro inscription, zéro effort demandé, interface quasi vide. La valeur est dans le moment, pas dans l'accumulation de données.

### Contexte et positionnement

Les apps de bien-être émotionnel existantes (mood trackers, journaux, chatbots) reposent sur l'enregistrement et l'analyse. Emotions ne demande rien à retenir — elle crée un moment présent. Le modèle le plus proche serait une installation artistique interactive, accessible depuis un smartphone.

### Risques et mitigation

| Risque | Mitigation |
|---|---|
| Le format déroute — l'utilisateur ne comprend pas quoi faire | La promesse d'accueil guide sans instruire. Tests utilisateur précoces. |
| Le contenu Larivey est daté (1998-2005) | Le fond reste pertinent (psychologie des émotions). La forme le modernise. |
| L'absence d'IA est perçue comme un manque | Choix éditorial explicité dans la page de crédits. |
| Fiches inégales en contenu | Le fallback bienveillant couvre les étapes du cycle quand le contenu spécifique manque. |
| Accessibilité des couleurs | Chaque couleur accompagnée d'un label textuel pour les lecteurs d'écran. |

## Exigences Web App (PWA)

### Architecture

- **SPA** (Single Page Application) avec routing Angular — parcours fluide sans rechargement
- **PWA installable** — Service Worker, manifest, fonctionnement hors-ligne pour le contenu statique

### Design responsive

- **Mobile-first** — L'expérience est conçue pour le tactile (tap, scroll)
- Desktop supporté mais secondaire
- Breakpoints : mobile (< 768px) prioritaire, tablet et desktop adaptés

### Navigateurs cibles

| Plateforme | Navigateurs |
|---|---|
| Mobile (prioritaire) | Chrome, Safari, Firefox (2 dernières versions) |
| Desktop (secondaire) | Chrome, Safari, Firefox, Edge (2 dernières versions) |

## Scoping et développement progressif

### Stratégie MVP — MVP d'expérience

**Philosophie :** Le minimum viable n'est pas un ensemble de features, c'est un parcours émotionnel complet de bout en bout. Si le cycle fonctionne pour une seule émotion, il fonctionne pour toutes.

**Ressources :** Développeur solo, pas de deadline. Le rythme est dicté par la qualité, pas par l'urgence.

### MVP (Phase 1) — Le cycle qui marche

**Parcours supporté :** Léa (parcours 1 — succès)

**Capacités :**
1. Écran d'accueil — promesse + espace épuré
2. Choix de couleur — palette de couleurs cliquables (6 familles émotionnelles)
3. Liste d'émotions simples — associées à la couleur choisie, scroll/tap
4. Couleur de fond — la couleur choisie accompagne visuellement la fiche et le cycle
5. Fiche Larivey — définition, exemples, utilité
6. Cycle émotionnel (5 étapes) — bifurcation positif/négatif, exemples-guides
7. Erreurs typiques — affichées si présentes dans la fiche, sinon disponibles dans la page d'explication
8. Fallback bienveillant — textes génériques quand la fiche manque de contenu pour une étape
9. Sortie douce — [Merci] / [Pas vraiment] + filet de sécurité (numéros d'écoute)
10. Page de crédits — sources, intention, contact

**Hors MVP :**
- Pas de pouls chromatique animé (palette statique cliquable à la place)
- Pas d'analytics ni compteurs
- Pas de stats admin
- Pas de comptes utilisateurs

### Phase 2 — L'expérience enrichie

- Pouls chromatique animé (rotation HSL 0-360°)
- Mots vivants au scroll (grossissement/rétrécissement)
- Sortie de secours "Autre chose" → dictionnaire complet
- Les 4 types d'émotions (mixte, repoussée, pseudo) → redirection vers cycle simple
- Émotions-masques — suggestion qu'une émotion peut en cacher une autre
- Page "Comprendre le cycle" — le cycle, la tentation de l'interrompre, chaque étape décrite
- Caresse-miroir — interaction curseur sur desktop
- Analytics anonymes ([Merci]/[Pas vraiment], émotions choisies)

### Phase 3 — Vision

- Stats admin (tableau de bord)
- Sous-types et alias (confus-creatrice, culpa-saine...)
- Contenu enrichi (sensations physiques, confusions entre émotions)
- Partage anonyme ("cette émotion a été traversée X fois aujourd'hui")

## Exigences fonctionnelles

### Accueil et entrée dans l'expérience

- FR1 : Le visiteur voit un écran d'accueil épuré avec une promesse d'introduction
- FR2 : Le visiteur peut choisir une couleur parmi une palette de 6 familles émotionnelles
- FR3 : Chaque couleur est accompagnée d'un label textuel accessible aux lecteurs d'écran

### Identification de l'émotion

- FR4 : Le visiteur voit une liste d'émotions simples associées à la couleur choisie
- FR5 : Le visiteur peut parcourir la liste par scroll et sélectionner une émotion par tap/clic

### Contenu Larivey

- FR6 : Le visiteur voit la fiche de l'émotion sélectionnée (définition, exemples, utilité)
- FR7 : La couleur choisie par le visiteur est utilisée comme couleur de fond pour la fiche et les étapes du cycle
- FR8 : Le système affiche un texte de fallback bienveillant dans l'étape du cycle quand le contenu spécifique à l'émotion est absent

### Cycle émotionnel

- FR9 : Le visiteur est guidé à travers les 5 étapes du cycle (émergence, sensation, reconnaissance, expression, action)
- FR10 : Le système adapte le langage du cycle selon la valence de l'émotion (positif/négatif)
- FR11 : Chaque étape du cycle affiche des exemples-guides pour aider le visiteur
- FR12 : Les erreurs typiques liées à l'émotion sont affichées si présentes dans la fiche
- FR13 : Le visiteur peut progresser d'une étape à la suivante à son rythme

### Fin de parcours

- FR14 : Le visiteur voit un message de sortie douce à la fin du cycle
- FR15 : Le visiteur peut indiquer son ressenti via [Merci] ou [Pas vraiment]
- FR16 : Le message affiché après [Pas vraiment] est humble et non culpabilisant
- FR17 : Le visiteur peut accéder à des numéros d'écoute (filet de sécurité) à tout moment du parcours

### Crédits et information

- FR18 : Le visiteur peut accéder à une page de crédits depuis un lien discret
- FR19 : La page de crédits présente les sources (Garneau & Larivey), l'intention du projet et un moyen de contact

### Données et contenu

- FR20 : Le système charge les données des ~80 émotions depuis un fichier de données structuré
- FR21 : Chaque émotion possède un type (simple, mixte, repoussée, pseudo-émotion), une valence et une famille de couleur
- FR22 : Le MVP affiche uniquement les émotions de type simple dans la liste par couleur

## Exigences non fonctionnelles

### Performance

- Les transitions entre étapes du cycle sont fluides (< 300ms)
- Le contenu statique (fiches, textes du cycle) est chargé au démarrage ou en lazy loading transparent
- First Contentful Paint < 2s sur connexion 3G
- Lighthouse Performance ≥ 90

### Accessibilité

- WCAG AA sur l'ensemble du parcours — zéro erreur AXE
- Chaque couleur de la palette accompagnée d'un label textuel
- Focus management séquentiel entre les étapes du cycle
- Contrastes validés sur tous les fonds colorés (les couleurs de palette sont décoratives, le texte reste lisible)
- Navigation clavier complète du parcours

### Fiabilité

- L'app fonctionne hors-ligne pour le contenu statique (Service Worker)
- Aucune perte de parcours si la connexion est interrompue en cours de cycle
- Pas de dépendance serveur pour le MVP — tout le contenu est embarqué

### Confidentialité

- Aucune donnée personnelle collectée dans le MVP
- Pas de cookies de tracking, pas de fingerprinting
- Si des analytics sont ajoutés post-MVP, elles seront strictement anonymes et conformes RGPD
