# 🧪 Test Plan - Tab Manager AI

## 1. 🎯 Objectifs du plan de test
- Garantir la stabilité et la maintenabilité de l’extension.
- Vérifier la cohérence fonctionnelle sur chaque release.
- Mettre en place une approche **TDD (Test-Driven Development)** pour favoriser la qualité du code.
- Cibler à la fois les **tests unitaires**, **tests d’intégration** et **tests end-to-end (E2E)**.

---

## 2. 📂 Types de tests

### 2.1 Tests unitaires
- **Portée** : fonctions pures, hooks, utils, services.
- **Outils** : Vitest + React Testing Library.
- **Exemples** :
    - `tabUtils.groupByDomain()` → vérifie que les onglets sont bien regroupés par domaine.
    - `useTabSearch()` → retourne les résultats filtrés avec debounce.
    - `aiService.suggestGrouping(tabs)` → mock de l’API, vérifie la structure du retour.

### 2.2 Tests d’intégration
- **Portée** : composants et interactions entre plusieurs parties.
- **Exemples** :
    - `Popup` + `TabList` → afficher correctement les onglets et réagir à une recherche.
    - `Sidebar` + `GroupingPanel` → vérifier que les suggestions IA modifient bien l’état global.
    - Persistance via `chrome.storage` → mocker l’API Chrome.

### 2.3 Tests End-to-End (E2E)
- **Portée** : scénarios utilisateur complets dans Chrome.
- **Outils** : Playwright (ou Puppeteer).
- **Exemples** :
    - Ouvrir plusieurs onglets → vérifier qu’ils apparaissent dans le popup.
    - Cliquer sur “Regrouper par IA” → les onglets sont classés correctement.
    - Fermer un groupe → vérifier que les onglets correspondants disparaissent.

### 2.4 Tests de performance
- Vérifier que la suggestion IA ne dépasse pas un certain temps (ex. < 1,5s).
- Vérifier que le rendu du popup reste fluide avec **200 onglets ouverts**.

### 2.5 Tests de sécurité
- Vérifier que les données sensibles ne sont **jamais envoyées en clair**.
- Vérifier la robustesse face aux inputs malicieux (ex. nom d’onglet contenant du code HTML → éviter XSS dans l’UI).

---

## 3. 🧭 Stratégie de TDD
1. **Écrire le test d’abord** pour chaque hook/lib/service.
2. **Vérifier qu’il échoue** (red phase).
3. **Implémenter la logique minimale** pour le faire passer (green phase).
4. **Refactoriser le code** tout en gardant le test vert.
5. **Commit** avec un message clair (`test: add unit test for tab grouping`).

---

## 4. 📌 Scénarios de test

### 4.1 Gestion des onglets
- Ajouter un onglet → apparaît dans la liste.
- Fermer un onglet → disparaît de la liste.
- Basculer entre onglets → met à jour l’état actif.

### 4.2 Recherche & filtrage
- Saisie partielle → onglets correspondants affichés.
- Recherche vide → tous les onglets affichés.
- Test du **debounce** → la requête IA n’est pas envoyée à chaque frappe.

### 4.3 Regroupement IA
- IA propose des groupes pertinents (mock API).
- Utilisateur accepte → les groupes sont créés.
- Utilisateur annule → aucun changement appliqué.

### 4.4 Persistance
- Fermer/reouvrir Chrome → retrouver les groupes sauvegardés.
- Vérifier que `chrome.storage` contient les données attendues.

### 4.5 UI/UX
- Responsive popup (petit écran vs grand écran).
- Accessibilité (naviguer au clavier, aria-labels présents).
- Dark mode / Light mode (tests snapshot).

---

## 5. 🔧 Outils & Setup
- **Unitaires / Intégration** : Vitest + React Testing Library.
- **Mocks Chrome API** : `Vitest-chrome`.
- **E2E** : Playwright (avec mode “persistent context” pour Chrome).
- **Coverage** : `Vitest --coverage` (objectif : >90%).

---

## 6. ✅ Critères d’acceptation
- Aucun test rouge avant une PR merge.
- Couverture minimale :
    - 95% sur `utils/` et `services/`.
    - 90% sur `hooks/`.
    - 85% sur `components/`.
- Tous les scénarios E2E critiques doivent passer sur **2 environnements Chrome** (stable + beta).  
