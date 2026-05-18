# Algoritmix — Laborator Virtual de Algoritmi

**Platformă educațională web pentru elevii de liceu (clasele 9–12)** care vizualizează interactiv algoritmii din programa de informatică pentru Bacalaureat.

---

## Cuprins
1. [Descriere](#descriere)
2. [Funcționalități](#funcționalități)
3. [Instalare și rulare](#instalare-și-rulare)
4. [Arhitectura aplicației](#arhitectura-aplicației)
5. [Tehnologii și justificare](#tehnologii-și-justificare)
6. [Structura proiectului](#structura-proiectului)

---

## Descriere

Algoritmix este un laborator virtual care permite elevilor să **vizualizeze pas cu pas** execuția algoritmilor, să se **autoevalueze** prin quiz interactiv și să urmărească **progresul** de-a lungul sesiunilor de studiu.

Aplicația acoperă algoritmi din programa BAC România pentru clasele 9–12, organizați pe clase:

| Clasă | Algoritmi |
|-------|-----------|
| Cls. a 9-a | Bubble Sort, Selection Sort |
| Cls. a 10-a | Căutare Binară |
| Cls. a 11-a | Quick Sort |
| Cls. a 12-a | BFS (Breadth-First Search), DFS (Depth-First Search) |

---

## Funcționalități

### Simulator
- Vizualizare pas cu pas cu **bar chart animat** (sortare) sau **graf SVG** (BFS/DFS) sau **boxuri interactive** (căutare binară)
- Sincronizare automată între vizualizare, **pseudocod** și **cod C++** — linia activă se evidențiază la fiecare pas
- Control viteză animație (0.5× / 1× / 1.5× / 2×)
- Navigare manuală (pas anterior / următor / reset / play automat)
- Generare vector aleator cu un singur click
- 4 grafuri predefinite pentru BFS/DFS (general, lanț, arbore binar, ciclic)
- Filtrare algoritmi pe clasă (9–12)
- Card „Despre algoritm" cu complexitate timp/spațiu, stabilitate și cazuri de utilizare

### Quiz
- Întrebări **vizuale** (identifică algoritmul dintr-o captură de stare) și **text** (concepte, complexitate, proprietăți)
- 19+ întrebări predefinite + **întrebări personalizate** adăugate din panoul de conținut
- Feedback imediat cu explicație după fiecare răspuns
- Scor, streak și **flacără animată** la răspunsuri consecutive corecte
- **Persistare statistici** între sesiuni (localStorage)

### Statistici
- Strip vizual cronologic al răspunsurilor (verde/roșu)
- Acuratețe globală cu bară de progres
- Ultimele greșeli cu răspunsul corect — secțiune „De reținut"
- Buton de resetare statistici

### Conținut (Gestionare)
- Adaugă **întrebări personalizate** pentru Quiz (text, 2–4 opțiuni, răspuns corect, explicație)
- Adaugă **seturi de exerciții** pentru Simulator (titlu, algoritm, vector/nod start)
- Toate datele salvate în localStorage, persistente între sesiuni
- Întrebările personalizate apar aleator în quiz (40% probabilitate dacă există)

---

## Instalare și rulare

### Cerințe
- **Node.js** 18 sau mai nou
- **npm** 9 sau mai nou

### Frontend (aplicația principală)

```bash
cd frontend
npm install
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:5173`.

### Build pentru producție

```bash
cd frontend
npm run build
```

Fișierele sunt generate în `frontend/dist/` și pot fi servite de orice server web static.

### Backend (opțional)

Backendul Node.js/Express oferă un API REST pentru simulare prin motorul C++. Frontul rulează complet independent fără backend (simularea se face în JavaScript).

```bash
cd backend
npm install
npm run dev   # pornește pe portul 4000
```

---

## Arhitectura aplicației

```
EduNova/
├── frontend/               # Aplicația Vue 3
│   ├── src/
│   │   ├── App.vue         # Componenta principală (UI + logică de stare)
│   │   ├── algorithms.js   # Logica algoritmilor: generare pași, pseudocod, complexitate
│   │   ├── cppSnippets.js  # Snippeturi C++ și mapări linie↔pseudoLine
│   │   └── main.js         # Entry point Vue
│   ├── index.html
│   └── vite.config.js
└── backend/                # Server opțional
    ├── src/server.js       # API Express cu endpoint /api/v1/simulate-cpp
    └── cpp/
        └── algoritmix_engine.cpp  # Motor C++ de simulare
```

### Fluxul de date

```
Utilizator selectează algoritm + parametri
        ↓
algorithms.js::buildSteps()  →  generează array de pași (fiecare cu: array/graph, pseudoLine, mesaj)
        ↓
App.vue::currentStep  →  computed reactiv, actualizează simultan:
    • Bar chart / BFS SVG / Binary search boxes
    • Pseudocode (linia activă via pseudoLine)
    • Cod C++ (liniile active via CPP_LINE_MAP)
```

### Persistența datelor

Aplicația nu necesită bază de date. Toate datele utilizatorului sunt stocate în **localStorage** al browserului:

| Cheie | Conținut |
|-------|----------|
| `algoritmix_stats_v1` | Statistici quiz (scor, streak, istoric, greșeli) |
| `algoritmix_custom_questions_v1` | Întrebări quiz personalizate |
| `algoritmix_custom_sets_v1` | Seturi de exerciții pentru simulator |

---

## Tehnologii și justificare

### Vue 3 + Composition API
**De ce:** Vue 3 cu `<script setup>` permite organizarea logicii pe funcționalitate (nu pe tip: data/methods/computed), ceea ce face codul mai lizibil și mai ușor de extins. Sistemul reactiv (`ref`, `computed`, `watch`) elimină manipularea manuală a DOM-ului — starea dictează UI-ul în mod declarativ.

**Alternativă considerată:** React — mai popular, dar Vue are o curbă de învățare mai mică și SFC-urile (Single File Components) grupează template, logică și stil într-un singur fișier, ideal pentru o aplicație cu o singură componentă principală.

### Vite
**De ce:** Build tool modern cu Hot Module Replacement instant (< 100ms). Comparativ cu webpack, pornirea serverului de dev este de 10–50× mai rapidă datorită ESM nativ în browser. Configurație minimă pentru proiecte Vue.

### CSS Custom Properties (fără framework CSS)
**De ce:** Un singur fișier de variabile CSS (`--bg`, `--accent`, `--text` etc.) controlează întreaga temă dark. Niciun framework extern (Tailwind, Bootstrap) — zero overhead, control total, bundle mai mic.

### JavaScript pur pentru simulare (fără backend în runtime)
**De ce:** Logica de simulare implementată în `algorithms.js` rulează direct în browser. Nu există latență de rețea, nu sunt necesare servere externe, aplicația funcționează **offline**. Codul C++ din backend este o referință suplimentară, nu o dependință.

### localStorage pentru persistență
**De ce:** Aplicația este un instrument de studiu personal, nu necesită autentificare sau sincronizare între dispozitive. localStorage este simplu, rapid și nu necesită infrastructură server — perfect pentru stadiul curent al proiectului.

---

## Structura codului

### `algorithms.js`
Exportă:
- `ALGORITHMS` — metadata algoritmi (nume, clasă, pseudocod, complexitate)
- `GRAPH_PRESETS` — grafuri predefinite pentru BFS/DFS
- `buildSteps(algorithmId, payload)` — dispatcher principal
- `bubbleSortSteps`, `selectionSortSteps`, `quickSortSteps`, `binarySearchSteps`, `bfsSteps`, `dfsSteps` — generatoare de pași, fiecare pas conținând starea completă + `pseudoLine` pentru sincronizare

### `cppSnippets.js`
Exportă:
- `CPP_SNIPPETS` — codul C++ sursă pentru fiecare algoritm (stil BAC România)
- `CPP_LINE_MAP` — mapare `pseudoLine → [linii C++ 0-based]` pentru evidențierea sincronă

### `App.vue`
Componenta unică a aplicației. Organizată în secțiuni clare:
- State: simulator, quiz, statistici, conținut personalizat
- BFS/DFS layout: noduri SVG și muchii per preset
- Bar chart + binary search: stilizare dinamică per pas
- Quiz: generare întrebări, evaluare, persistare, flacără streak
- Conținut: CRUD întrebări personalizate și seturi de exerciții
