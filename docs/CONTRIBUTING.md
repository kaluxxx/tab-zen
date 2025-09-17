# Contributing – TabZen

Merci de contribuer à **TabZen** 🎉  
Ce document décrit les conventions à respecter pour garantir un code **maintenable**, **testé** et **cohérent**.

---

## 🏗️ Architecture feature-based

Chaque fonctionnalité doit vivre dans un dossier `features/[feature-name]` :

- `src/`
    - `features/`
        - `tabManager/`
            - `components/` : UI (stateless) – React + shadcn
            - `hooks/` : logique React réutilisable (state + side-effects)
            - `lib/` : algorithmes d’organisation IA (regex, heuristiques)
            - `services/` : interactions Chrome API (tabs, storage)
            - `types/` : définitions TypeScript (Tab, Group, Session)
            - `utils/` : helpers purs (formatage, filtre, tri)
            - `pages/` : Popup principale, Options


🔑 **Règle d’or** :
- `components/` → jamais de logique métier (UI seulement).
- `services/` → pas d’état React.
- `lib/` et `utils/` → fonctions **pures** testables facilement.

---

## 💻 Conventions de code

- **Langage** : TypeScript strict (`"strict": true`).
- **Imports** : chemins relatifs courts avec alias (`@/features/...`).
- **Pas de `any`** sauf cas exceptionnel documenté.
- **Nom des fichiers** :
    - `kebab-case.tsx` → composants React
    - `kebab-case.ts` → fonctions / hooks
    - `UPPER_CASE.ts` → constantes
- **CSS** : Tailwind uniquement (pas de CSS inline sauf exceptions).

---

## 🧪 Tests (TDD obligatoire)

Stratégie :
1. Écrire un test qui échoue.
2. Implémenter juste assez de code pour le faire passer.
3. Refactoriser si besoin.

### Niveaux de tests
- **Unitaires** → `lib/`, `utils/`, `services/`.
- **Intégration** → `hooks/`, `components/`.
- **E2E (Playwright, V1+)** → parcours utilisateur dans la popup.

### Règles
- Chaque nouvelle fonction doit être testée.
- Couverture minimale : **80%**.
- Les tests vivent **à côté** du code testé :  
  lib/
  ├─ tabClassifier.ts
  └─ tabClassifier.test.ts

---

## 📝 Git & workflow

- **Branches** :
- `feature/<name>` pour une nouvelle fonctionnalité.
- `fix/<name>` pour un correctif.
- **Commits** : respecter [Conventional Commits](https://www.conventionalcommits.org) :
- `feat: ajout de la recherche par onglet`
- `fix: bug affichage favicon`
- `test: ajout de tests unitaires tabClassifier`
- **Pull requests** :
- Toujours avec description + références aux issues.
- CI doit passer (lint + tests).

---

## ✅ Checklist avant merge

- [ ] Code formaté (Prettier).
- [ ] Aucun warning ESLint.
- [ ] Tests ajoutés et verts.
- [ ] Documentation (JSDoc / commentaires si logique complexe).
- [ ] Respect de la structure feature-based.

---

🚀 Avec ces règles, TabZen restera **maintenable**, **testé**, et prêt à scaler.
