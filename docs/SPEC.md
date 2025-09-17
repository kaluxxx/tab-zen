# Spécifications fonctionnelles – TabZen

## 🎯 Objectif
Fournir une extension Chrome qui permet aux utilisateurs de gérer leurs onglets de manière intelligente et rapide, en réduisant la surcharge cognitive liée à l'ouverture massive d'onglets.

---

## 🧑‍🤝‍🧑 Public cible
- **Étudiants** : qui jonglent entre cours, recherches, PDF, réseaux sociaux.
- **Développeurs / freelances** : avec des dizaines d'onglets projet + docs.
- **Power users** : qui gardent 50+ onglets ouverts simultanément.

---

## 📝 User stories

### Gestion basique
- **US1** : En tant qu’utilisateur, je veux voir tous mes onglets ouverts pour les parcourir rapidement.
- **US2** : En tant qu’utilisateur, je veux rechercher un onglet par son titre ou son URL.
- **US3** : En tant qu’utilisateur, je veux fermer un onglet depuis l’extension.
- **US4** : En tant qu’utilisateur, je veux naviguer vers un onglet directement depuis la liste.

### Organisation intelligente
- **US5** : En tant qu’utilisateur, je veux regrouper automatiquement mes onglets par catégorie (ex: "Travail", "Docs", "Réseaux sociaux").
- **US6** : En tant qu’utilisateur, je veux sauvegarder une session d’onglets et la restaurer plus tard.
- **US7** : En tant qu’utilisateur, je veux que l’extension suggère de fermer les onglets inactifs depuis X jours.

### Personnalisation
- **US8** : En tant qu’utilisateur, je veux configurer les catégories automatiques.
- **US9** : En tant qu’utilisateur, je veux activer/désactiver certaines fonctionnalités (ex: suggestions).

---

## 🔄 Workflows

### 1. Recherche et navigation
1. L’utilisateur ouvre la popup.
2. Une liste d’onglets apparaît (titre + favicon + URL tronquée).
3. L’utilisateur tape un mot-clé → filtrage temps réel.
4. En cliquant sur un onglet → focus bascule sur l’onglet.

### 2. Organisation avec IA (MVP simplifié)
1. L’utilisateur clique sur "Organiser avec IA".
2. Les onglets sont regroupés selon des règles de classification (regex, heuristiques simples).
- Ex: `*.github.com` → catégorie "Dev".
- Ex: `*.youtube.com` → catégorie "Media".
3. Les groupes apparaissent avec un header.
4. L’utilisateur peut "réduire/fermer" un groupe.

### 3. Sauvegarde de session (V1+)
1. L’utilisateur clique sur "Sauvegarder la session".
2. Les onglets sont stockés dans `chrome.storage.local`.
3. L’utilisateur peut restaurer la session ultérieurement.

---

## 📋 Cas limites
- Aucun onglet ouvert → affichage “Aucun onglet trouvé”.
- 200+ onglets ouverts → pagination ou virtualisation pour éviter le lag.
- Titres vides → afficher l’URL.
- Plusieurs fenêtres → option pour afficher uniquement la fenêtre active ou toutes.

---

## 🛠️ Contraintes techniques
- Temps de réponse < 100ms pour la recherche (optimisation → préindexation).
- Pas de backend externe : tout tourne en **local**.
- Stockage via `chrome.storage.local`.
- Compatibilité : Chrome 120+, Edge (optionnel plus tard).

---
