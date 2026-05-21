# Algoritmix — Laborator Virtual de Algoritmi

**Platformă educațională web pentru elevii de liceu (clasele 9–12)** care vizualizează interactiv algoritmii din programa de informatică pentru Bacalaureat România.

---

## Cuprins
1. [Descriere](#descriere)
2. [Algoritmi incluși](#algoritmi-incluși)
3. [Funcționalități](#funcționalități)
4. [Cum se folosește](#cum-se-folosește)
5. [Instalare și rulare](#instalare-și-rulare)
6. [Arhitectura aplicației](#arhitectura-aplicației)
7. [Tehnologii și justificare](#tehnologii-și-justificare)
8. [Structura proiectului](#structura-proiectului)

---

## Descriere

Algoritmix este un laborator virtual care permite elevilor să **vizualizeze pas cu pas** execuția algoritmilor, să se **autoevalueze** prin quiz interactiv și să urmărească **progresul** de-a lungul sesiunilor de studiu.

Aplicația este **100% statică** — rulează complet în browser, fără backend, fără cont, fără date trimise în rețea. Poate fi accesată offline după primul încărcare.

---

## Algoritmi incluși

### Sortare

| Algoritm | Clasă | Complexitate medie | Stabil |
|---|---|---|---|
| Bubble Sort | 9 | O(n²) | Da |
| Selection Sort | 9 | O(n²) | Nu |
| Insertion Sort | 9 | O(n²) | Da |
| Merge Sort | 11 | O(n log n) | Da |
| Quick Sort | 11 | O(n log n) | Nu |
| Heap Sort | 11 | O(n log n) | Nu |
| Counting Sort | 11 | O(n + k) | Da |

### Căutare

| Algoritm | Clasă | Complexitate |
|---|---|---|
| Căutare Liniară | 9 | O(n) |
| Căutare Binară | 10 | O(log n) |

### Matematică

| Algoritm | Clasă | Complexitate |
|---|---|---|
| Algoritmul lui Euclid (CMMDC) | 9 | O(log n) |
| Verificare număr prim | 9 | O(√n) |
| Ciurul lui Eratostene | 10 | O(n log log n) |

### Grafuri

| Algoritm | Clasă | Complexitate |
|---|---|---|
| BFS (Breadth-First Search) | 12 | O(V + E) |
| DFS (Depth-First Search) | 12 | O(V + E) |

**Total: 14 algoritmi**

---

## Funcționalități

### Tab Simulator

- **Vizualizare pas cu pas** cu:
  - Bar chart animat pentru algoritmi de sortare (bare colorate diferit: pivot, comparați, minim, cheie, interval interclasare, sortat)
  - Boxuri interactive cu markeri pentru Căutare Binară și Căutare Liniară
  - Graf SVG animat pentru BFS și DFS
  - Afișaj numeric mare pentru Algoritmul lui Euclid și Verificare număr prim
  - Grilă colorată pentru Ciurul lui Eratostene (prim / prim curent / marcat compus / compus)
- **Arbore de recursivitate** SVG animat pentru Quick Sort (partiție Lomuto) și Merge Sort — noduri colorate per fază (activ, interclasare, finalizat, în așteptare)
- **Sincronizare pseudocod ↔ cod C++** — linia activă se evidențiază la fiecare pas în ambele vizualizări
- Pseudocod în română cu indexare 1-based (stil BAC), cod C++ în stilul standard de examen
- **Mod Predicție** — toggle care dezactivează butoanele de navigare și face elementele vizualizării clickabile; utilizatorul ghicește care element va fi activ în pasul următor, cu feedback vizual instant (verde/roșu) și avansare automată
- Control viteză animație: 0.5× / 1× / 1.5× / 2×
- Navigare manuală: pas anterior / următor / reset / play automat
- Generare aleatorie a datelor de intrare cu un singur click
- Filtrare algoritmi pe clasă (9 / 10 / 11 / 12 / Toți)
- 4 grafuri predefinite pentru BFS/DFS: general (6 noduri), lanț, arbore binar (7 noduri), ciclic
- **Card „Despre algoritm"** colapsabil cu:
  - Descriere detaliată
  - Tabel complexitate (cel mai bun / mediu / cel mai rău / memorie / stabilitate)
  - **Grafic de complexitate** SVG cu 6 curbe (O(1), O(log n), O(n), O(n log n), O(n²)) — curba algoritmului curent este evidențiată, celelalte estompate
  - Când se folosește
  - **Avantaje** (bullets verzi) și **Dezavantaje** (bullets roșii) pe două coloane
  - **Fapt interesant** — context istoric sau comparație notabilă (ex: Euclid ~300 î.Hr., Quick Sort 1959, Binary Search: 4 miliarde elemente = 32 pași)

### Tab Quiz

Două moduri accesibile prin toggle în interiorul tab-ului:

#### Quiz Visual / Text
- Întrebări **vizuale** — identifică algoritmul dintr-o captură de stare intermediară (funcționează pentru: Bubble, Selection, Insertion, Quick, Merge Sort, Căutare Liniară, Căutare Binară, BFS)
- Întrebări **text** — complexitate, proprietăți, comparații, structuri de date
- **50+ întrebări predefinite** acoperind toți cei 14 algoritmi
- Feedback imediat cu explicație detaliată după fiecare răspuns
- Scor sesiune, streak și **flacără animată** (🔥) la răspunsuri consecutive corecte
- Întrebări **personalizate** adăugate din panoul Conținut (apar cu 40% probabilitate)

#### Quiz Pseudocod
- **Completare de linie lipsă** — pseudocodul algoritmului apare cu o linie înlocuită de `???`
- **17 algoritmi** cu câte 2–3 întrebări fiecare (Bubble, Selection, Insertion, Binary Search, Quick Sort, BFS, DFS, Heap Sort, Counting Sort, Euclid, Verificare prim, Ciurul lui Eratostene)
- **32 întrebări** total, cu explicații pedagogice pentru fiecare răspuns greșit/corect
- Scor local pe sesiunea curentă
- Răspunsurile se înregistrează în statistici globale (vizibile în tab-ul Statistici)

### Tab Statistici

- **Strip cronologic** — pătrate verzi/roșii pentru fiecare răspuns din sesiunea curentă (tooltip cu textul întrebării)
- **Grafic de progres** — curbă bezier cu gradient fill, markeri diamant (verde = corect, roșu = greșit), medie rulantă pe 5 întrebări; linie de referință la 50%
- Bară de acuratețe globală cu procentaj colorat (verde ≥ 70%, galben ≥ 40%, roșu < 40%)
- **Distribuție pe tip de întrebare** — bare pentru Visual, Text, Pseudocod (afișate doar pentru tipurile cu date)
- **Distribuție pe algoritm** — bare de acuratețe per algoritm
- **Răspunsuri recente** — lista ultimelor 15 răspunsuri cu textul întrebării; badge `P` pentru răspunsurile din Quiz Pseudocod
- Secțiunea **„De reținut"** — ultimele 8 greșeli cu răspunsul corect
- Buton **Export JSON** — descarcă statisticile complete
- Buton **Resetează** — șterge toate statisticile

### Tab Conținut

- Adaugă **întrebări personalizate** pentru Quiz: text, 2–4 opțiuni, răspuns corect, explicație opțională
- Adaugă **seturi de exerciții** pentru Simulator: titlu, algoritm, vector/nod start
- Seturi salvate pot fi încărcate direct în Simulator cu un click
- Toate datele persistate în localStorage, disponibile la repornirea browser-ului

### Altele

- **Mod întunecat / luminos** — toggle în header, preferința salvată în localStorage
- **Română / Engleză** — toggle i18n complet: toate textele (interfață, legende, mesaje de pas, etichete) sunt traduse
- **Complet static** — fără backend, fără bază de date, funcționează offline

---

## Cum se folosește

### Tab Simulator
1. Selectează **clasa** (9–12) cu butoanele de filtru
2. Alege **algoritmul** din dropdown
3. Introdu datele:
   - **Sortare / Căutare**: vector de numere, ex: `8, 2, 6, 1, 4`
   - **Euclid**: două numere, ex: `48, 18`
   - **Verificare prim / Ciur**: un număr, ex: `97` sau `50`
   - **BFS / DFS**: selectează graful predefinit și nodul start
4. Click **„Generează pașii"** (sau **↺ Random** pentru date aleatorii)
5. Navighează cu **← Pas anterior** / **Pas următor →** sau pornește cu **▶ Play**
6. Activează **„Predicție"** pentru modul interactiv — click pe elementul pe care crezi că va fi activ la pasul următor
7. Apasă pe **„Despre algoritm ▼"** pentru informații complete (complexitate, avantaje, dezavantaje, fapt interesant)

### Tab Quiz
1. Selectează modul: **Quiz** (visual/text) sau **Quiz Pseudocod**
2. Citește întrebarea și alege răspunsul
3. Citește explicația afișată după răspuns
4. Continuă cu **„Întrebare nouă →"**

### Tab Statistici
- Vizualizează progresul prin graficul de tendință și strip-ul cronologic
- Consultă **„De reținut"** pentru întrebările la care ai greșit
- Exportă datele sau resetează pentru a lua de la capăt

### Tab Conținut
1. Adaugă întrebări Quiz personalizate cu textul, opțiunile și răspunsul corect
2. Adaugă seturi de exerciții pentru Simulator (vector + algoritm)
3. Încarcă un set salvat direct în Simulator cu **„Încarcă"**

---

## Instalare și rulare

### Cerințe
- **Node.js** 18+
- **npm** 9+

### Dezvoltare locală

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

Fișierele sunt generate în `frontend/dist/` — pot fi servite de orice server web static (Netlify, GitHub Pages, nginx etc.).

### Rulare teste

```bash
cd frontend
npm run test
```

Suite de teste Vitest pentru toți generatorii de pași din `algorithms.js`.

---

## Arhitectura aplicației

### Structura fișierelor

```
EduNova/
├── frontend/
│   ├── src/
│   │   ├── App.vue                    # Shell principal: navigare, teme, i18n
│   │   ├── algorithms.js              # 14 algoritmi: metadata + generatoare de pași
│   │   ├── cppSnippets.js             # Cod C++ BAC + mapări pseudoLine→linie C++
│   │   ├── components/
│   │   │   ├── SimulatorTab.vue       # Vizualizare + controale simulator
│   │   │   ├── QuizTab.vue            # Quiz visual/text + toggle mod
│   │   │   ├── ChallengeTab.vue       # Quiz Pseudocod (completare linie lipsă)
│   │   │   ├── StatsTab.vue           # Statistici + grafic progres
│   │   │   ├── AdminTab.vue           # Conținut personalizat
│   │   │   ├── RecursionTree.vue      # Arbore recursivitate SVG (Quick/Merge Sort)
│   │   │   └── ComplexityChart.vue    # Grafic curbe complexitate SVG
│   │   ├── composables/
│   │   │   ├── useStats.js            # Statistici globale (reactive, localStorage)
│   │   │   ├── useSimulatorState.js   # Stare simulator partajată între componente
│   │   │   ├── useCustomContent.js    # Întrebări/seturi personalizate
│   │   │   └── useTheme.js            # Temă dark/light
│   │   └── i18n/
│   │       ├── index.js               # Composable useI18n() + funcție t()
│   │       ├── ro.js                  # Traduceri română (limba implicită)
│   │       └── en.js                  # Traduceri engleză
│   ├── algorithms.test.js             # Teste Vitest pentru algoritmi
│   └── vite.config.js
└── backend/                           # Server opțional (neutilizat în producție)
    ├── src/server.js
    └── cpp/algoritmix_engine.cpp
```

### Fluxul de date

```
Utilizator selectează algoritm + parametri
        ↓
algorithms.js::buildSteps()
        → generează array de pași, fiecare cu:
          { array/graph/euclidA/primes/..., pseudoLine, message, active[], ... }
        ↓
SimulatorTab::currentStep (computed reactiv)
        → actualizează simultan:
          • Vizualizare (bare / boxuri / graf SVG / grilă ciur / afișaj numeric)
          • Arbore recursivitate (Quick Sort, Merge Sort)
          • Pseudocod — evidențiază linia pseudoLine
          • Cod C++ — evidențiază liniile din CPP_LINE_MAP[algo][pseudoLine]
```

### Stare globală (composables module-level)

| Composable | Stare gestionată |
|---|---|
| `useStats` | Scor quiz, streak, istoric, erori, statistici per tip/algoritm |
| `useSimulatorState` | Algoritm selectat, vectorul curent, preset graf |
| `useCustomContent` | Întrebări și seturi de exerciții personalizate |
| `useTheme` | Tema dark/light, sincronizată cu `data-theme` pe `<html>` |

### Persistența datelor (localStorage)

| Cheie | Conținut |
|---|---|
| `algoritmix_stats_v1` | Statistici complete quiz (scor, streak, istoric, greșeli, per tip, per algoritm) |
| `algoritmix_custom_questions_v1` | Întrebări quiz personalizate |
| `algoritmix_custom_sets_v1` | Seturi de exerciții pentru simulator |
| `algoritmix_theme` | Preferința temă (dark/light) |

---

## Tehnologii și justificare

### Vue 3 + Composition API (`<script setup>`)
Vue 3 cu `<script setup>` permite organizarea logicii pe funcționalitate (nu pe tip: data/methods/computed), codul devenind mai lizibil și mai ușor de extins. Sistemul reactiv (`ref`, `reactive`, `computed`, `watch`) elimină manipularea manuală a DOM-ului.

Composables la nivel de modul înlocuiesc un store Pinia/Vuex fără dependință externă: `useStats()`, `useTheme()` etc. exportă stare reactivă partajată între toate componentele care le importă.

**Alternativă considerată:** React — mai popular, dar Vue are o curbă de învățare mai mică și SFC-urile (`.vue`) grupează template, logică și stil, ideal pentru componente cu vizualizări complexe.

### Vite
Build tool modern cu Hot Module Replacement instant (< 100ms) și bundling optimizat cu tree-shaking. Configurație zero pentru proiecte Vue.

### SVG inline pentru vizualizări
Toate graficele (bare sortare, graf BFS/DFS, arbore recursivitate, grafic complexitate, sparkline statistici) sunt SVG-uri inline generate reactiv din datele de stare. Nu există dependință de biblioteci de charting — control total asupra animațiilor și culorilor per temă.

### CSS Custom Properties (fără framework CSS)
Un singur set de variabile CSS (`--bg`, `--bg-card`, `--accent`, `--text` etc.) controlează întreaga temă. Schimbarea atributului `data-theme` pe `<html>` comută instant toate culorile. Zero overhead față de un framework CSS extern.

### JavaScript pur pentru simulare
Logica din `algorithms.js` rulează direct în browser. Fiecare apel `buildSteps()` generează sincron întregul array de pași — fără latență, fără server, funcționează offline. Codul C++ din `cppSnippets.js` este afișat ca referință de studiu, nu executat.

### localStorage pentru persistență
Instrument de studiu personal, fără nevoia de autentificare sau sincronizare între dispozitive. Datele supraviețuiesc repornirii browser-ului, dar sunt locale — privacy by design.
