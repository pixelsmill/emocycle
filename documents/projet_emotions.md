# Projet App Émotions — Résumé de conception
*Basé sur les travaux de Michelle Larivey et Jean Garneau*

---

## 📚 Source

**"Les émotions source de vie"** — Jean Garneau & Michelle Larivey (2000, RED Éditions)
- Collection "La lettre du Psy"
- Michelle Larivey : psychologue québécoise, fondatrice de redpsy.com (site HS)
- Archives du dictionnaire des émotions sauvegardées localement

> ⚠️ **Question en suspens** : vérifier le statut des droits d'auteur (Jean Garneau vivant ?) et envisager une demande d'autorisation avant publication.

---

## 🎯 Vision du projet

Une **PWA** intime et contemporaine pour aider à identifier, comprendre et traverser ses émotions.
- Gratuit, public, sans but commercial
- Inspiré du dictionnaire Larivey mais dans un format plus engageant
- L'IA comme miroir bienveillant, pas comme thérapeute

---

## 🏗️ Concept central

### Le cycle de vie d'une émotion *(fil conducteur de l'app)*

```
Déclencheur → Sensation corporelle → Reconnaissance → Expression → Résolution
```

Quand ce cycle est **bloqué** (répression, évitement, rationalisation) :
→ l'émotion reste enkystée et génère des problèmes

Quand on lui laisse faire son chemin :
→ elle se dissout naturellement

---

## 🚪 Deux grandes portes d'entrée

### 1. "Qu'est-ce que je ressens ?"
Aide à **identifier** l'émotion via 3 modalités au choix :

| Modalité | Mode | Pour qui |
|---|---|---|
| 🫁 **Par le corps** | Immédiat | "Je suis dans l'émotion" |
| 📖 **Par la situation** | Narratif | "Qu'est-ce qui s'est passé ?" |
| 🎨 **Par les mots / images** | Intuitif | "Lequel résonne ?" |

### 2. "Qu'est-ce que je fais avec ?"
Aide à comprendre **où on en est dans le cycle** et comment l'accompagner

---

## 🛠️ Stack technique

| Couche | Techno |
|---|---|
| Frontend | Angular (PWA) |
| Backend | Node.js |
| Base de données | Firebase Firestore |
| Auth | Firebase Auth (optionnel) |
| Hosting | Firebase Hosting |
| Functions | Firebase Functions (appels IA) |
| Intégration Angular | AngularFire |

### Architecture Firestore envisagée
```
Firestore
├── emotions/          # Le dictionnaire Larivey
├── cycles/            # Les cycles de vie des émotions
└── users/{uid}/       # Données perso (si compte utilisateur)
    └── sessions/      # Historique des explorations
```

### Considérations RGPD
- Données émotionnelles = données sensibles
- Options : anonymat total / ID local / chiffrement côté client
- Firestore local persistence pour les données perso

---

## 🤖 IA

- Intégration **ciblée** pour limiter les coûts (API Claude)
- Uniquement sur la porte d'entrée "décrire en texte libre"
- Appels centralisés via Firebase Functions (clé API sécurisée)
- Le reste de l'app fonctionne sans IA (arbres de décision)

---

## 📋 Prochaines étapes

- [ ] Vérifier les droits sur le contenu Larivey / contacter Jean Garneau
- [ ] Structurer le contenu des archives en modèle de données
- [ ] Définir les familles d'émotions et leurs relations
- [ ] Démarrer sur **Claude Code** pour la mise en œuvre technique

---

*Conversation initiale : Claude.ai — Avril 2026*
