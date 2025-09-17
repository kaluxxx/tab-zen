# 🏗️ Architecture – TabZen

## 1. 📂 Organisation générale

- `features/`
  - `tabManager/`
    - `components/` : UI (stateless) – React + shadcn
    - `hooks/` : logique React réutilisable (state + side-effects)
    - `lib/` : algorithmes (IA, regex, heuristiques)
    - `services/` : interactions Chrome API (tabs, storage)
    - `types/` : définitions TypeScript (Tab, Group, Session)
    - `utils/` : helpers purs (formatage, tri, debounce)
    - `pages/` : Popup principale, Options UI
- `extension/`
    - `background/`
        - `index.ts` : écoute onglets, synchro storage
    - `popup/`
        - `index.html`
    - `options/`
        - `index.html`
    - `content/`
        - `index.ts`
    - `assets/` : icônes, images
- `components/`
    - `ui/` : shadcn/ui composants
- `tests/`
    - `unit/` : tests Vitest unitaires
    - `integration/` : tests Vitest + RTL
    - `e2e/` : tests Playwright extension
- `manifest.json` : Déclaration extension Chrome
- `styles/` : global Tailwind config
- `index.tsx` : bootstrap React
- `eslint.config.ts` : linting
- `vite.config.ts` : bundler config


---

## 2. 📚 Stack technique

- **React + TypeScript** → UI typée et maintenable.
- **shadcn/ui + Tailwind** → composants modernes et consistants.
- **Vite** → bundler rapide compatible extensions.
- **Chrome APIs** →
    - `chrome.tabs` → gestion onglets
    - `chrome.storage.sync` → persistance des groupes/sessions
    - `chrome.runtime` → communication background ↔ popup
- **Tests** :
    - `Vitest + React Testing Library` → unitaires & intégration
    - `Playwright` → E2E avec contexte Chrome extension

---

## 3. 🔗 Flux de données

1. **Background script (`background/index.ts`)**
    - Écoute création/fermeture d’onglets.
    - Met à jour `chrome.storage`.
    - Notifie le popup via `runtime.sendMessage`.

2. **Service (ex: `services/tabService.ts`)**
    - Wrap des appels Chrome API (`chrome.tabs.query`).
    - Fournit des méthodes propres (`getAllTabs`, `closeTab`, `saveGroups`).

3. **Hook (ex: `hooks/useTabs.ts`)**
    - Utilise `tabService`.
    - Gère état local (`loading`, `tabs`, `search`).

4. **Lib (ex: `lib/tabClassifier.ts`)**
    - Reçoit liste des onglets.
    - Retourne groupes logiques (par domaine, IA, heuristiques).

5. **Component (ex: `components/TabList.tsx`)**
    - Affiche liste ou groupes.
    - **Stateless** (données passées en props).

6. **Page (ex: `pages/Popup.tsx`)**
    - Assemble hooks + services + UI.
    - Fournit les interactions utilisateur (search, regroupement, actions).

---

## 4. 🔌 Points spécifiques à Chrome

- **`manifest.json`**
    - Déclare permissions (`tabs`, `storage`).
    - Définit le `background.service_worker`.
    - Déclare les pages (`popup.html`, `options.html`).

- **Background (service worker)**
    - Centralise la logique persistante.
    - Exemples :
        - Mettre à jour la liste globale d’onglets.
        - Sauvegarder l’état des groupes.

- **Popup (UI)**
    - Point d’entrée principal utilisateur.
    - React + Tailwind + shadcn.

- **Options page**
    - Paramètres utilisateur (ex : choix mode regroupement par défaut).

- **Content scripts (optionnel)**
    - Injectables si on veut des intégrations plus poussées (ex. récupérer contexte de page).
    - Pas prioritaire pour la v1.

---

## 5. 🔧 Communication interne

- **Popup ↔ Background**
    - Via `chrome.runtime.sendMessage`.
    - Exemple : Popup demande `getAllTabs` → Background renvoie liste.

- **Background ↔ Storage**
    - Persistance via `chrome.storage.sync`.

- **Librairies internes**
    - `utils/` et `lib/` → totalement indépendants des APIs Chrome → facilement testables en TDD.

---

## 6. ✅ Principes clés

- **Séparation stricte des responsabilités** (UI, services, hooks, background).
- **Feature-based** : chaque domaine vit dans son feature folder.
- **Testabilité** :
    - `lib/` et `utils/` purs → tests unitaires simples.
    - `services/` → mock Chrome API.
    - `hooks/` → tests intégration avec React Testing Library.
    - E2E → Playwright.
- **Scalabilité** : nouvelle feature = nouveau dossier dans `features/`.  