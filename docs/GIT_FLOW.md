# 🌳 Git Flow – TabZen

Ce document définit le workflow Git adopté pour le projet **TabZen** afin de garantir une gestion claire des branches, une intégration continue fluide et une qualité de code élevée.

---

## 1. 🌱 Branches principales

- **`main`**
    - Branche stable et déployable à tout moment.
    - Contient uniquement du code **testé et validé**.
    - Chaque commit sur `main` doit être lié à une release.

- **`develop`**
    - Branche d’intégration.
    - Contient les features validées mais pas encore taguées en release.
    - Sert de base pour créer des branches de fonctionnalités.

---

## 2. 🌿 Branches secondaires

- **Feature branches** (`feature/[feature-name]`)
    - Créées à partir de `develop`.
    - Exemple : `feature/tab-search`, `feature/ai-grouping`.
    - Fusionnées dans `develop` via **Pull Request** (PR).
    - Règles :
        - Tests unitaires obligatoires.
        - Code review obligatoire.

- **Hotfix branches** (`hotfix/[issue-name]`)
    - Créées à partir de `main`.
    - Corrigent rapidement un bug critique en production.
    - Fusionnées dans `main` **et** `develop`.

- **Release branches** (`release/x.y.z`)
    - Créées depuis `develop`.
    - Permettent stabilisation avant mise en production.
    - Incluent corrections mineures, mise à jour `CHANGELOG.md`, version bump.
    - Fusionnées dans `main` et `develop`.

---

## 3. 🔄 Cycle de développement

1. Créer une **feature branch** depuis `develop`.
2. Implémenter la fonctionnalité avec **TDD**.
3. Committer régulièrement avec des messages clairs (`feat:`, `fix:`, `test:`, etc.).
4. Ouvrir une **Pull Request vers `develop`**.
5. Passer la CI/CD :
    - ✅ Tests unitaires & intégration (Jest, RTL).
    - ✅ Linter & formatage (ESLint, Prettier).
6. Code review → squash & merge.
7. Quand `develop` est stable → créer `release/x.y.z`.
8. Tests finaux → merge dans `main`.
9. Tag de release + build Chrome extension.

---

## 4. 🧪 Politique de commits

- Utiliser **Conventional Commits** :
    - `feat: ajout regroupement IA des onglets`
    - `fix: correction bug recherche avec accents`
    - `test: ajout test unitaire pour popup`
    - `docs: mise à jour CONTRIBUTING.md`

- Chaque commit doit être **atomique** (une seule logique par commit).

---

## 5. 🚀 Versioning & Releases

- Suivre **Semantic Versioning (SemVer)** :
    - `MAJOR.MINOR.PATCH`
    - Exemple : `1.2.3`
    - `MAJOR` → changement incompatible.
    - `MINOR` → nouvelle feature rétro-compatible.
    - `PATCH` → bugfix.

- Chaque release est :
    - Taguée (`git tag v1.2.3`).
    - Documentée dans `CHANGELOG.md`.
    - Buildée pour Chrome Web Store.

---

## 6. ✅ Règles de merge

- Interdiction de **push direct** sur `main` ou `develop`.
- Merge uniquement via **Pull Request**.
- PR doit contenir :
    - Description claire du changement.
    - Liens vers issues Jira/GitHub.
    - Screenshots si UI modifiée.

---

## 7. 📌 Exemple de cycle complet

1. Créer `feature/tab-search` depuis `develop`.
2. Développer avec TDD + commits conventionnels.
3. PR → review + merge dans `develop`.
4. Quand plusieurs features sont stables → `release/1.1.0`.
5. Vérif QA → merge dans `main` + tag `v1.1.0`.
6. Build & déploiement sur Chrome Web Store.

---
