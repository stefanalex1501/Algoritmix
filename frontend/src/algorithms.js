export const ALGORITHMS = {
  bubbleSort: {
    id: "bubbleSort",
    name: "Bubble Sort",
    category: "Sortare",
    grade: 9,
    complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    stable: true,
    info: "Compară și interschimbă perechi de elemente adiacente, repetând până când nu mai există nicio interschimbare necesară.",
    when: "Vectori mici sau aproape sortați. Simplu de implementat și de demonstrat didactic.",
    pseudocode: [
      "pentru i = 1 → n-1:",
      "  pentru j = 1 → n-i:",
      "    dacă v[j] > v[j+1]:",
      "      interschimbă v[j] și v[j+1]"
    ],
    pros: ["Simplu de implementat și de înțeles didactic", "Stabil — păstrează ordinea elementelor egale", "Varianta optimizată detectează vectorii deja sortați în O(n)"],
    cons: ["O(n²) în cazul mediu și cel mai rău — ineficient pe date mari", "Multe interschimbări inutile față de Selection Sort"],
    note: "Numele vine de la modul în care elementele mari «urcă» ca bulele de aer spre finalul vectorului la fiecare iterație."
  },
  selectionSort: {
    id: "selectionSort",
    name: "Selection Sort",
    category: "Sortare",
    grade: 9,
    complexity: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    stable: false,
    info: "La fiecare pas găsește minimul din subvectorul nesortat și îl plasează pe poziția corectă printr-o singură interschimbare.",
    when: "Când numărul de scrieri (swap) trebuie minimizat. Nu este eficient pentru date mari.",
    pseudocode: [
      "pentru i = 1 → n-1:",
      "  min_idx = i",
      "  pentru j = i+1 → n:",
      "    dacă v[j] < v[min_idx]: min_idx = j",
      "  interschimbă v[i] și v[min_idx]"
    ],
    pros: ["Minimizează numărul de interschimbări — maxim n−1 swap-uri", "Simplu de implementat", "Performanță predictibilă indiferent de date"],
    cons: ["Nu este stabil în implementarea standard", "Nu beneficiază de vectori parțial sortați", "O(n²) în orice caz — nu există caz bun"],
    note: "Selection Sort face mereu exact n·(n−1)/2 comparații, indiferent de ordinea inițială. Este algoritmul cu cele mai puține scrieri în memorie."
  },
  mergeSort: {
    id: "mergeSort",
    name: "Merge Sort",
    category: "Sortare",
    grade: 11,
    complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
    stable: true,
    info: "Împarte recursiv vectorul în două jumătăți, le sortează independent, apoi le interclasează. Garantează O(n log n) indiferent de date.",
    when: "Când complexitatea garantată O(n log n) este critică. Preferabil față de Quick Sort pe date aproape sortate sau când stabilitatea contează.",
    pseudocode: [
      "dacă stânga < dreapta:",
      "  mijloc = (stânga + dreapta) / 2",
      "  mergesort(stânga, mijloc)",
      "  mergesort(mijloc+1, dreapta)",
      "  interclasează(stânga, mijloc, dreapta)"
    ],
    pros: ["O(n log n) garantat în orice caz", "Stabil — ideal când ordinea elementelor egale contează", "Ușor de paralelizat pe sisteme multi-core"],
    cons: ["Necesită O(n) memorie auxiliară pentru interclasare", "Overhead mai mare decât Quick Sort în practică pe date aleatorii"],
    note: "Merge Sort a fost inventat de John von Neumann în 1945, unul dintre primii algoritmi eficienți proiectați special pentru calculatoare."
  },
  quickSort: {
    id: "quickSort",
    name: "Quick Sort",
    category: "Sortare",
    grade: 11,
    complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
    stable: false,
    info: "Alege un element pivot, partiționează vectorul față de acesta, apoi sortează recursiv cele două subvectoare rezultate.",
    when: "Cel mai rapid în practică pentru date mari. Cazul cel mai rău apare pe vectori sortați cu pivot = ultimul element.",
    pseudocode: [
      "alege pivot = v[dreapta]",
      "pentru j = stânga → dreapta-1:",
      "  dacă v[j] ≤ pivot → mută la stânga",
      "plasează pivot pe poziția finală",
      "apelează recursiv pe subvectori"
    ],
    pros: ["Cel mai rapid în practică pe date aleatorii", "O(log n) memorie (recursie in-place)", "Cache-friendly — accesează memoria secvențial în partiționare"],
    cons: ["O(n²) în cazul cel mai rău (pivot ales prost pe date sortate)", "Nu este stabil"],
    note: "Quick Sort a fost publicat de C.A.R. Hoare în 1959. În ciuda cazului cel mai rău O(n²), în practică bate Merge Sort datorită constantelor mai mici și accesului cache mai eficient."
  },
  linearSearch: {
    id: "linearSearch",
    name: "Căutare Liniară",
    category: "Căutare",
    grade: 9,
    complexity: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
    stable: null,
    info: "Parcurge vectorul element cu element de la stânga la dreapta, comparând fiecare valoare cu ținta căutată.",
    when: "Vectori nesortați sau mici. Simplu de implementat, dar ineficient pentru date mari.",
    pseudocode: [
      "pentru i = 1 → n:",
      "  dacă v[i] == țintă:",
      "    returnează i (găsit)",
      "returnează -1 (negăsit)"
    ],
    pros: ["Funcționează pe orice vector, sortat sau nu", "O(1) memorie", "Simplu de implementat și de înțeles"],
    cons: ["O(n) în cazul cel mai rău — lent pe vectori mari", "Nu exploatează nicio structură a datelor"],
    note: "Pe liste înlănțuite, Căutarea Liniară este singurul algoritm posibil — accesul aleatoriu necesar pentru Căutarea Binară nu este disponibil."
  },
  insertionSort: {
    id: "insertionSort",
    name: "Insertion Sort",
    category: "Sortare",
    grade: 9,
    complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    stable: true,
    info: "La fiecare pas, ia elementul curent (cheia) și îl inserează în poziția corectă în subvectorul deja sortat din stânga.",
    when: "Vectori mici sau aproape sortați. Optim pentru date care sosesc pe rând (online). Stabil.",
    pseudocode: [
      "pentru i = 2 → n:",
      "  cheie = v[i]",
      "  j = i - 1",
      "  cât timp j ≥ 1 și v[j] > cheie:",
      "    v[j+1] = v[j]; j = j - 1",
      "  v[j+1] = cheie"
    ],
    pros: ["O(n) pe vectori deja sortați sau aproape sortați", "Stabil și eficient pe date mici", "Funcționează online — poate sorta date care sosesc pe rând"],
    cons: ["O(n²) în cazul cel mai rău (vector sortat descrescător)", "Ineficient pentru n mare"],
    note: "Este algoritmul folosit intuitiv de oameni când sortează cărțile de joc: luăm fiecare carte și o inserăm la locul corect în mâna deja sortată."
  },
  binarySearch: {
    id: "binarySearch",
    name: "Căutare Binară",
    category: "Căutare",
    grade: 10,
    complexity: { best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
    stable: null,
    info: "Caută un element dintr-un vector sortat, împărțind repetat intervalul de căutare la jumătate.",
    when: "Orice vector sortat. Mult mai eficient decât căutarea liniară. Necesită sortare prealabilă.",
    pseudocode: [
      "stânga = 1, dreapta = n",
      "cât timp stânga ≤ dreapta:",
      "  mijloc = (stânga + dreapta) / 2",
      "  dacă v[mijloc] == țintă: găsit!",
      "  dacă v[mijloc] < țintă: stânga = mijloc+1",
      "  altfel: dreapta = mijloc-1"
    ],
    pros: ["O(log n) — extrem de rapid: 1.000.000 elemente → maxim 20 pași", "O(1) memorie", "Garantează găsirea sau absența elementului"],
    cons: ["Necesită vector sortat în prealabil — sortarea adaugă O(n log n)", "Nu funcționează pe liste înlănțuite (acces aleatoriu necesar)"],
    note: "Pe un vector de 4 miliarde de elemente, Căutarea Binară găsește orice element în maxim 32 de comparații — față de 4 miliarde pentru cea liniară."
  },
  heapSort: {
    id: "heapSort",
    name: "Heap Sort",
    category: "Sortare",
    grade: 11,
    complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
    stable: false,
    info: "Sortează folosind un heap maxim: mai întâi construiește structura heap, apoi extrage repetat elementul maxim și îl plasează la sfârșitul vectorului.",
    when: "Când complexitatea O(n log n) garantată și memoria O(1) sunt ambele importante. Mai lent în practică față de Quick Sort.",
    pseudocode: [
      "construiește heap maxim:",
      "  pentru i = n/2 → 1: heapify(v, n, i)",
      "pentru i = n → 2:",
      "  interschimbă v[1] cu v[i]",
      "  heapify(v, i-1, 1)"
    ],
    pros: ["O(n log n) garantat în orice caz", "O(1) memorie — sortare in-place fără vector auxiliar", "Ideal când memoria e limitată și garanția de timp e importantă"],
    cons: ["Nu este stabil", "Mai lent decât Quick Sort în practică (acces non-secvențial la memorie în heapify)", "Cod mai complex de scris și de înțeles"],
    note: "Heap Sort este folosit ca fallback în IntroSort (implementarea std::sort din C++): dacă Quick Sort se comportă prost, algoritmul comută automat pe Heap Sort."
  },
  countingSort: {
    id: "countingSort",
    name: "Counting Sort",
    category: "Sortare",
    grade: 11,
    complexity: { best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)" },
    stable: true,
    info: "Sortare fără comparații: numără frecvența fiecărei valori, apoi reconstruiește vectorul sortat. k = valoarea maximă din vector.",
    when: "Valori întregi într-un interval mic (ex: note 1-10, vârste 0-120). Extrem de rapid când k este mic față de n.",
    pseudocode: [
      "pentru i = 1 → n: f[v[i]]++",
      "pentru val = 0 → max(v):",
      "  cât timp f[val] > 0:",
      "    plasează val în output; f[val]--"
    ],
    pros: ["O(n+k) — mai rapid decât O(n log n) când k este mic", "Stabil în implementarea cu tablou cumulativ", "Simplu de implementat și de înțeles conceptual"],
    cons: ["Necesită O(k) memorie pentru tabloul de frecvențe", "Funcționează doar pentru valori întregi nenegative", "Ineficient când k >> n (valori mari, puține elemente)"],
    note: "Counting Sort este folosit intern în Radix Sort ca subroutine: sortând cifră cu cifră (de la cea mai puțin semnificativă), fiecare rundă aplică Counting Sort."
  },
  euclid: {
    id: "euclid",
    name: "Algoritmul lui Euclid (CMMDC)",
    category: "Matematică",
    grade: 9,
    complexity: { best: "O(log n)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
    stable: null,
    info: "Calculează cel mai mare divizor comun (CMMDC) al două numere prin împărțiri repetate. La fiecare pas: r = a mod b, a ← b, b ← r.",
    when: "Ori de câte ori este nevoie de CMMDC. Baza pentru CMMMC, fracții ireductibile, criptografie RSA.",
    pseudocode: [
      "cât timp b ≠ 0:",
      "  r = a mod b",
      "  a = b",
      "  b = r",
      "afișează a  (= CMMDC)"
    ],
    pros: ["O(log min(a,b)) — extrem de eficient, converge rapid", "Simplu de implementat în 5 linii", "Baza pentru CMMMC, fracții ireductibile, criptografie RSA"],
    cons: ["Calculează CMMDC-ul a doar două numere odată", "Nu produce factorizarea, ci doar CMMDC-ul"],
    note: "Algoritmul lui Euclid, descris în «Elementele» (~300 î.Hr.), este unul dintre cei mai vechi algoritmi cunoscuți și este folosit nemodificat și astăzi, 2300 de ani mai târziu."
  },
  isPrime: {
    id: "isPrime",
    name: "Verificare număr prim",
    category: "Matematică",
    grade: 9,
    complexity: { best: "O(1)", avg: "O(√n)", worst: "O(√n)", space: "O(1)" },
    stable: null,
    info: "Verifică dacă n este prim testând toți divizorii de la 2 la √n. Dacă niciunul nu divide n, atunci n este prim.",
    when: "Verificare rapidă a primalității unui număr. Eficient pentru n până la ~10⁹.",
    pseudocode: [
      "dacă n < 2: NU ESTE PRIM",
      "pentru d = 2 → √n:",
      "  dacă n mod d = 0: NU ESTE PRIM",
      "ESTE PRIM"
    ],
    pros: ["O(√n) — eficient pentru numere până la ~10⁹", "Simplu de implementat", "O(1) memorie"],
    cons: ["Lent pentru numere foarte mari (10¹⁵+) — se preferă teste probabilistice (Miller-Rabin)", "Testează fiecare număr individual — ineficient pentru a găsi TOATE primele până la n"],
    note: "Există numere Carmichael (ex: 561 = 3×11×17) care «păcălesc» testele simple bazate pe Teorema lui Fermat, dar nu și testul prin împărțire la toți divizorii până la √n."
  },
  sieve: {
    id: "sieve",
    name: "Ciurul lui Eratostene",
    category: "Matematică",
    grade: 10,
    complexity: { best: "O(n log log n)", avg: "O(n log log n)", worst: "O(n log log n)", space: "O(n)" },
    stable: null,
    info: "Găsește toate numerele prime până la n. Pornește de la 2 și marchează toți multiplii ca numere compuse, repetând pentru fiecare număr nemarcabil.",
    when: "Când sunt necesare toate numerele prime până la n. Mult mai eficient decât testarea fiecărui număr separat.",
    pseudocode: [
      "pentru i = 2 → n: ciur[i] = adevărat",
      "pentru i = 2 → √n:",
      "  dacă ciur[i] = adevărat:",
      "    pentru j = i² → n, pas i:",
      "      ciur[j] = fals",
      "afișează i unde ciur[i] = adevărat"
    ],
    pros: ["O(n log log n) — cel mai eficient algoritm pentru toate primele până la n", "Simplu de implementat (un singur array boolean)", "Structură de date minimă"],
    cons: ["Necesită O(n) memorie — impractibil pentru n > 10⁸", "Nu este practic pentru a testa un singur număr individual"],
    note: "Eratostene din Cyrene (~276-194 î.Hr.) a creat acest algoritm cu 2200 de ani în urmă. Versiuni optimizate (Ciurul lui Atkin) sunt folosite azi pentru calculul primelor mari."
  },
  bfs: {
    id: "bfs",
    name: "BFS (Parcurgere Graf)",
    category: "Grafuri",
    grade: 12,
    complexity: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
    stable: null,
    info: "Parcurge graful nivel cu nivel, vizitând toate nodurile la distanța k înainte de cele la distanța k+1, folosind o coadă FIFO.",
    when: "Cel mai scurt drum în grafuri neponderate, verificarea conexivității, parcurgere nivel cu nivel.",
    pseudocode: [
      "coadă ← { nod_start }",
      "marchează nod_start ca vizitat",
      "cât timp coada ≠ ∅:",
      "  nod ← extrage din coadă",
      "  pentru fiecare vecin nevizitat:",
      "    adaugă în coadă și marchează"
    ],
    pros: ["Garantează drumul cel mai scurt în grafuri neponderate", "Detectează dacă un graf este conex", "Vizitează nodurile nivel cu nivel — util în probleme de tipul «cel mai apropiat»"],
    cons: ["Necesită O(V) memorie pentru coadă", "Mai lent decât DFS pe grafuri dense când distanța nu contează"],
    note: "BFS este folosit de Google Maps pentru rutare în rețele de transport și de rețelele sociale pentru sugestia «prieteni pe care îi poți cunoaște» (noduri la distanță 2)."
  },
  dfs: {
    id: "dfs",
    name: "DFS (Parcurgere Graf)",
    category: "Grafuri",
    grade: 12,
    complexity: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
    stable: null,
    info: "Parcurge graful în adâncime, explorând complet fiecare ramură înainte de a reveni și explora o altă direcție, folosind o stivă.",
    when: "Detectarea ciclurilor, componente conexe, sortare topologică, rezolvarea labirinturilor.",
    pseudocode: [
      "stivă ← { nod_start }",
      "marchează nod_start ca vizitat",
      "cât timp stiva ≠ ∅:",
      "  nod ← extrage din vârful stivei",
      "  pentru fiecare vecin nevizitat:",
      "    adaugă în stivă și marchează"
    ],
    pros: ["O(V) memorie (stivă de recursie)", "Detectează cicluri, componente conexe și sortare topologică", "Natural recursiv — cod concis"],
    cons: ["Nu garantează drumul cel mai scurt", "Poate provoca stack overflow pe grafuri cu mii de noduri (recursie adâncă)"],
    note: "DFS este baza algoritmilor Tarjan și Kosaraju pentru componente tare conexe, și a algoritmilor clasici de rezolvare a labirinturilor prin backtracking."
  }
};

/**
 * Parsează un string de numere separate prin virgulă sau spații.
 * @param {string} input - Ex: "8, 2, 6, 1, 4" sau "8 2 6 1 4"
 * @returns {number[]} Array de numere finite
 */
export function parseVector(input) {
  return input
    .split(/[\s,]+/)
    .filter((x) => x.trim() !== "")
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x));
}

/** @param {any} arr @returns {any} */
function clone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

/**
 * Generează pașii de vizualizare pentru Bubble Sort.
 * Fiecare pas conține starea completă a vectorului, indicii activi
 * și pseudoLine pentru sincronizarea cu pseudocodul și codul C++.
 * @param {number[]} vector - Vectorul de sortat
 * @returns {Array<{array:number[], active?:number[], swapped?:boolean, message:string, pseudoLine:number}>}
 */
export function bubbleSortSteps(vector) {
  const a = [...vector];
  const steps = [{ array: [...a], message: "Vector inițial", pseudoLine: -1 }];

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ array: [...a], active: [j, j + 1], message: `Comparăm ${a[j]} și ${a[j + 1]}`, pseudoLine: 2 });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], active: [j, j + 1], swapped: true, message: "Am făcut interschimbarea", pseudoLine: 3 });
      }
    }
  }

  steps.push({ array: [...a], message: "Sortare finalizată", pseudoLine: -1 });
  return steps;
}

/**
 * Generează pașii de vizualizare pentru Selection Sort.
 * Urmărește minimul curent (minIdx) și câte elemente sunt deja sortate (sortedUpTo).
 * @param {number[]} vector - Vectorul de sortat
 * @returns {Array<{array:number[], active?:number[], minIdx?:number, sortedUpTo?:number, message:string, pseudoLine:number}>}
 */
export function selectionSortSteps(vector) {
  const a = [...vector];
  const steps = [{ array: [...a], message: "Vector inițial", pseudoLine: -1 }];

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    steps.push({ array: [...a], minIdx, sortedUpTo: i, active: [i], message: `Pasul ${i + 1}: căutăm minimul începând de la poziția ${i + 1}`, pseudoLine: 0 });
    steps.push({ array: [...a], minIdx, sortedUpTo: i, active: [i], message: `min_idx = ${i + 1}`, pseudoLine: 1 });

    for (let j = i + 1; j < a.length; j++) {
      steps.push({ array: [...a], minIdx, sortedUpTo: i, active: [j, minIdx], message: `Comparăm ${a[j]} cu minimul curent ${a[minIdx]}`, pseudoLine: 2 });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({ array: [...a], minIdx, sortedUpTo: i, active: [j], message: `Nou minim: ${a[minIdx]} la poziția ${minIdx + 1}`, pseudoLine: 3 });
      }
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
    steps.push({ array: [...a], minIdx: i, sortedUpTo: i + 1, active: [i], message: `Plasăm minimul ${a[i]} pe poziția ${i + 1}`, pseudoLine: 4 });
  }

  steps.push({ array: [...a], sortedUpTo: a.length, message: "Sortare finalizată", pseudoLine: -1 });
  return steps;
}

/**
 * Generează pașii de vizualizare pentru Quick Sort (partiție Lomuto).
 * Fiecare pas marchează pivotul, elementele comparate și intervalul activ.
 * @param {number[]} vector - Vectorul de sortat
 * @returns {Array<{array:number[], active?:number[], pivot?:number, range?:number[], message:string, pseudoLine:number}>}
 */
export function quickSortSteps(vector) {
  const a = [...vector];
  const treeNodes = [];   // referință partajată — complet construit la final
  let nodeId = 0;
  const done = new Set();

  function addNode(left, right, parentId, depth) {
    const id = nodeId++;
    treeNodes.push({ id, left, right, parentId, depth, pivotAt: null, children: [] });
    if (parentId !== null) treeNodes[parentId].children.push(id);
    return id;
  }

  const steps = [{ array: [...a], message: "Vector inițial", pseudoLine: -1, treeNodes, activeNodeId: -1, doneNodeIds: [] }];

  function push(extra) {
    steps.push({ ...extra, treeNodes, doneNodeIds: [...done] });
  }

  function partition(low, high, nid) {
    const pivot = a[high];
    let i = low - 1;
    push({ array: [...a], range: [low, high], pivot: high, message: `Pivot = ${pivot}`, pseudoLine: 0, activeNodeId: nid });

    for (let j = low; j < high; j++) {
      push({ array: [...a], active: [j, high], range: [low, high], pivot: high, message: `Comparăm ${a[j]} cu pivot ${pivot}`, pseudoLine: 1, activeNodeId: nid });
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        push({ array: [...a], active: [i, j], pivot: high, message: "Mutăm elementul în partea stângă", pseudoLine: 2, activeNodeId: nid });
      }
    }

    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    const p = i + 1;
    treeNodes[nid].pivotAt = p;
    push({ array: [...a], active: [p, high], pivot: p, message: "Plasăm pivotul pe poziția finală", pseudoLine: 3, activeNodeId: nid });
    return p;
  }

  function sort(low, high, parentId, depth) {
    if (low < high) {
      const nid = addNode(low, high, parentId, depth);
      const pi = partition(low, high, nid);
      sort(low, pi - 1, nid, depth + 1);
      sort(pi + 1, high, nid, depth + 1);
      done.add(nid);
    }
  }

  sort(0, a.length - 1, null, 0);
  steps.push({ array: [...a], message: "Sortare finalizată", pseudoLine: -1, treeNodes, activeNodeId: -1, doneNodeIds: [...done] });
  return steps;
}

/**
 * Generează pașii de vizualizare pentru Insertion Sort.
 * Urmărește cheia curentă (keyIdx) și subvectorul sortat (sortedUpTo).
 * @param {number[]} vector - Vectorul de sortat
 * @returns {Array<{array:number[], active?:number[], keyIdx?:number, sortedUpTo?:number, message:string, pseudoLine:number}>}
 */
export function insertionSortSteps(vector) {
  const a = [...vector];
  const steps = [{ array: [...a], message: "Vector inițial", pseudoLine: -1 }];

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    steps.push({ array: [...a], keyIdx: i, sortedUpTo: i, active: [i],
      message: `Pasul ${i}: cheie = ${key}, de inserat în subvectorul sortat`, pseudoLine: 1 });

    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      steps.push({ array: [...a], keyIdx: i, sortedUpTo: i, active: [j, j + 1],
        message: `${a[j]} > ${key} → deplasăm ${a[j]} cu o poziție la dreapta`, pseudoLine: 4 });
      a[j + 1] = a[j];
      j--;
      steps.push({ array: [...a], keyIdx: j + 1, sortedUpTo: i, active: [j + 1],
        message: `Loc eliberat la poziția ${j + 2}`, pseudoLine: 4 });
    }

    a[j + 1] = key;
    steps.push({ array: [...a], keyIdx: j + 1, sortedUpTo: i + 1, active: [j + 1],
      message: `Inserăm ${key} pe poziția ${j + 2}`, pseudoLine: 5 });
  }

  steps.push({ array: [...a], sortedUpTo: a.length, message: "Sortare finalizată", pseudoLine: -1 });
  return steps;
}

/**
 * Generează pașii de vizualizare pentru Căutarea Liniară.
 * @param {number[]} vector - Vectorul în care se caută
 * @param {number} target - Valoarea căutată
 * @returns {Array<{array:number[], active:number[], found:boolean, target:number, message:string, pseudoLine:number}>}
 */
export function linearSearchSteps(vector, target) {
  const a = [...vector];
  const steps = [{ array: [...a], active: [], found: false, target,
    message: `Căutăm ${target} în vector`, pseudoLine: 0 }];

  for (let i = 0; i < a.length; i++) {
    steps.push({ array: [...a], active: [i], found: false, target,
      message: `Verificăm poziția ${i + 1}: v[${i + 1}] = ${a[i]}`, pseudoLine: 1 });

    if (a[i] === target) {
      steps.push({ array: [...a], active: [i], found: true, target,
        message: `Găsit! ${target} este la poziția ${i + 1}`, pseudoLine: 2 });
      return steps;
    }
  }

  steps.push({ array: [...a], active: [], found: false, target,
    message: `${target} nu există în vector`, pseudoLine: 3 });
  return steps;
}

/**
 * Generează pașii de vizualizare pentru Merge Sort (interclasare).
 * Urmărește intervalul curent de interclasare (mergeRange) și elementele comparate (active).
 * @param {number[]} vector - Vectorul de sortat
 * @returns {Array<{array:number[], active?:number[], mergeRange?:number[]|null, message:string, pseudoLine:number}>}
 */
export function mergeSortSteps(vector) {
  const a = [...vector];
  const treeNodes = [];
  let nodeId = 0;
  const done = new Set();

  function addNode(left, right, mid, parentId, depth) {
    const id = nodeId++;
    treeNodes.push({ id, left, right, mid, parentId, depth, children: [], phase: "split" });
    if (parentId !== null) treeNodes[parentId].children.push(id);
    return id;
  }

  const steps = [{ array: [...a], active: [], mergeRange: null, message: "Vector inițial", pseudoLine: -1, treeNodes, activeNodeId: -1, doneNodeIds: [] }];

  function push(extra) {
    steps.push({ ...extra, treeNodes, doneNodeIds: [...done] });
  }

  function merge(left, mid, right, nid) {
    treeNodes[nid].phase = "merge";
    const L = a.slice(left, mid + 1);
    const R = a.slice(mid + 1, right + 1);
    push({ array: [...a], active: [], mergeRange: [left, right],
      message: `Interclasăm [${left + 1}..${mid + 1}] cu [${mid + 2}..${right + 1}]`, pseudoLine: 4, activeNodeId: nid });

    let i = 0, j = 0, k = left;
    while (i < L.length && j < R.length) {
      const li = left + i, ri = mid + 1 + j;
      if (L[i] <= R[j]) {
        push({ array: [...a], active: [li, ri], mergeRange: [left, right],
          message: `${L[i]} ≤ ${R[j]} → plasăm ${L[i]}`, pseudoLine: 4, activeNodeId: nid });
        a[k++] = L[i++];
      } else {
        push({ array: [...a], active: [li, ri], mergeRange: [left, right],
          message: `${L[i]} > ${R[j]} → plasăm ${R[j]}`, pseudoLine: 4, activeNodeId: nid });
        a[k++] = R[j++];
      }
      push({ array: [...a], active: [k - 1], mergeRange: [left, right],
        message: `Plasat pe poziția ${k}`, pseudoLine: 4, activeNodeId: nid });
    }
    while (i < L.length) { a[k++] = L[i++]; }
    while (j < R.length) { a[k++] = R[j++]; }
    push({ array: [...a], active: [], mergeRange: [left, right],
      message: `Interval [${left + 1}..${right + 1}] interclasare finalizată`, pseudoLine: 4, activeNodeId: nid });
  }

  function sort(left, right, parentId, depth) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      const nid = addNode(left, right, mid, parentId, depth);
      push({ array: [...a], active: [], mergeRange: null,
        message: `Împărțim [${left + 1}..${right + 1}] → mijloc = ${mid + 1}`, pseudoLine: 1, activeNodeId: nid });
      sort(left, mid, nid, depth + 1);
      sort(mid + 1, right, nid, depth + 1);
      merge(left, mid, right, nid);
      done.add(nid);
    }
  }

  sort(0, a.length - 1, null, 0);
  steps.push({ array: [...a], active: [], mergeRange: null, message: "Sortare finalizată", pseudoLine: -1, treeNodes, activeNodeId: -1, doneNodeIds: [...done] });
  return steps;
}

/**
 * Generează pașii de vizualizare pentru Căutarea Binară.
 * Vectorul este sortat automat înainte de căutare.
 * @param {number[]} vector - Vectorul în care se caută (va fi sortat)
 * @param {number} target - Valoarea căutată
 * @returns {Array<{array:number[], left:number, right:number, mid:number|null, found:boolean, target:number, message:string, pseudoLine:number}>}
 */
export function binarySearchSteps(vector, target) {
  const a = [...vector].sort((x, y) => x - y);
  const steps = [{ array: [...a], left: 0, right: a.length - 1, mid: null, found: false, target, message: `Căutăm ${target} în vectorul sortat`, pseudoLine: 0 }];

  let left = 0, right = a.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({ array: [...a], left, right, mid, found: false, target, message: `Interval [${left + 1}, ${right + 1}], mijloc = ${mid + 1}, v[${mid + 1}] = ${a[mid]}`, pseudoLine: 2 });

    if (a[mid] === target) {
      steps.push({ array: [...a], left, right, mid, found: true, target, message: `Găsit! ${target} este la poziția ${mid + 1}`, pseudoLine: 3 });
      break;
    } else if (a[mid] < target) {
      steps.push({ array: [...a], left, right, mid, found: false, target, message: `${a[mid]} < ${target} → căutăm în dreapta`, pseudoLine: 4 });
      left = mid + 1;
    } else {
      steps.push({ array: [...a], left, right, mid, found: false, target, message: `${a[mid]} > ${target} → căutăm în stânga`, pseudoLine: 5 });
      right = mid - 1;
    }
  }

  if (left > right) {
    steps.push({ array: [...a], left, right, mid: null, found: false, target, message: `${target} nu există în vector`, pseudoLine: -1 });
  }

  return steps;
}

/**
 * Generează pașii de vizualizare pentru BFS (Breadth-First Search).
 * Graful este reprezentat ca listă de adiacență. Pașii urmăresc coada,
 * ordinea de vizitare și nodul curent/următor pentru animația SVG.
 * @param {Object.<string, string[]>} graph - Lista de adiacență
 * @param {string} start - Nodul de start
 * @returns {Array<{graph:Object, queue:string[], order:string[], current:string|null, next?:string, message:string, pseudoLine:number}>}
 */
export function bfsSteps(graph, start) {
  const visited = new Set();
  const queue = [start];
  const order = [];
  const steps = [{ graph: clone(graph), queue: [...queue], order: [], current: null, message: `Pornim din nodul ${start}`, pseudoLine: 0 }];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    steps.push({ graph: clone(graph), queue: [...queue], order: [...order], current: node, message: `Vizităm nodul ${node}`, pseudoLine: 3 });

    const neighbors = graph[node] || [];
    for (const nb of neighbors) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
        steps.push({ graph: clone(graph), queue: [...queue], order: [...order], current: node, next: nb, message: `Adăugăm vecinul ${nb} în coadă`, pseudoLine: 5 });
      }
    }
  }

  steps.push({ graph: clone(graph), queue: [], order: [...order], current: null, message: "Parcurgere BFS finalizată", pseudoLine: -1 });
  return steps;
}

/**
 * Generează pașii de vizualizare pentru DFS (Depth-First Search) iterativ.
 * Folosește o stivă explicită pentru a evita stack overflow pe grafuri mari.
 * @param {Object.<string, string[]>} graph - Lista de adiacență
 * @param {string} start - Nodul de start
 * @returns {Array<{graph:Object, stack:string[], order:string[], current:string|null, next?:string, message:string, pseudoLine:number}>}
 */
export function dfsSteps(graph, start) {
  const visited = new Set();
  const stack = [start];
  const order = [];
  const steps = [{ graph: clone(graph), stack: [...stack], order: [], current: null, next: null, message: `Pornim DFS din nodul ${start}`, pseudoLine: 0 }];

  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.has(node)) continue;

    visited.add(node);
    order.push(node);
    steps.push({ graph: clone(graph), stack: [...stack], order: [...order], current: node, next: null, message: `Vizităm nodul ${node}`, pseudoLine: 3 });

    const neighbors = (graph[node] || []).slice().reverse();
    for (const nb of neighbors) {
      if (!visited.has(nb)) {
        stack.push(nb);
        steps.push({ graph: clone(graph), stack: [...stack], order: [...order], current: node, next: nb, message: `Adăugăm vecinul ${nb} în stivă`, pseudoLine: 5 });
      }
    }
  }

  steps.push({ graph: clone(graph), stack: [], order: [...order], current: null, next: null, message: "Parcurgere DFS finalizată", pseudoLine: -1 });
  return steps;
}

export function heapSortSteps(vector) {
  const a = [...vector];
  const n = a.length;
  let sortedFrom = n;
  const steps = [{ array: [...a], active: [], message: "Vector inițial", pseudoLine: -1, heapSortedFrom: n }];

  function heapify(heapSize, root) {
    let mx = root;
    const l = 2 * root + 1;
    const r = 2 * root + 2;
    if (l < heapSize && a[l] > a[mx]) mx = l;
    if (r < heapSize && a[r] > a[mx]) mx = r;
    const compared = [root, ...(l < heapSize ? [l] : []), ...(r < heapSize ? [r] : [])];
    steps.push({ array: [...a], active: compared,
      message: `Heapify: v[${root+1}]=${a[root]}${l<heapSize?`, v[${l+1}]=${a[l]}`:''}${r<heapSize?`, v[${r+1}]=${a[r]}`:''}`,
      pseudoLine: 0, heapSortedFrom: sortedFrom });
    if (mx !== root) {
      [a[root], a[mx]] = [a[mx], a[root]];
      steps.push({ array: [...a], active: [root, mx],
        message: `Interschimbă v[${root+1}] ↔ v[${mx+1}]`,
        pseudoLine: 1, heapSortedFrom: sortedFrom });
      heapify(heapSize, mx);
    }
  }

  steps.push({ array: [...a], active: [], message: "Construiesc heap maxim (i = n/2 → 1)", pseudoLine: 0, heapSortedFrom: n });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  steps.push({ array: [...a], active: [0], message: `Heap construit — maximul v[1]=${a[0]}`, pseudoLine: 1, heapSortedFrom: n });

  for (let i = n - 1; i > 0; i--) {
    steps.push({ array: [...a], active: [0, i],
      message: `Extrag maximul v[1]=${a[0]} → poziția ${i+1}`,
      pseudoLine: 3, heapSortedFrom: sortedFrom });
    [a[0], a[i]] = [a[i], a[0]];
    sortedFrom = i;
    steps.push({ array: [...a], active: [0],
      message: `Repar heap pe [1..${i}]`,
      pseudoLine: 4, heapSortedFrom: sortedFrom });
    heapify(i, 0);
  }
  steps.push({ array: [...a], active: [], message: "Sortare finalizată", pseudoLine: -1, heapSortedFrom: 0 });
  return steps;
}

export function countingSortSteps(vector) {
  const a = [...vector];
  const n = a.length;
  const steps = [{ array: [...a], active: [], message: "Vector inițial", pseudoLine: -1 }];
  const max = Math.max(...a);
  const freq = new Array(max + 1).fill(0);

  for (let i = 0; i < n; i++) {
    steps.push({ array: [...a], active: [i],
      message: `Numărăm v[${i+1}]=${a[i]} → f[${a[i]}] devine ${freq[a[i]]+1}`,
      pseudoLine: 0 });
    freq[a[i]]++;
  }
  steps.push({ array: [...a], active: [], message: "Frecvențe calculate. Reconstruim vectorul sortat.", pseudoLine: 1 });

  const out = [...a];
  let k = 0;
  for (let val = 0; val <= max; val++) {
    while (freq[val] > 0) {
      out[k] = val; k++; freq[val]--;
      steps.push({ array: [...out], active: [k-1], sortedUpTo: k,
        message: `Plasăm valoarea ${val} pe poziția ${k}`,
        pseudoLine: 2 });
    }
  }
  steps.push({ array: [...out], active: [], sortedUpTo: n, message: "Sortare finalizată", pseudoLine: -1 });
  return steps;
}

export function euclidSteps(a, b) {
  const steps = [{ euclidA: a, euclidB: b, euclidR: null,
    message: `CMMDC(${a}, ${b}) — pornim algoritmul`, pseudoLine: 0 }];
  while (b !== 0) {
    const r = a % b;
    steps.push({ euclidA: a, euclidB: b, euclidR: r,
      message: `r = ${a} mod ${b} = ${r}`, pseudoLine: 1 });
    a = b; b = r;
    steps.push({ euclidA: a, euclidB: b, euclidR: null,
      message: `a ← ${a},  b ← ${b}`, pseudoLine: 2 });
  }
  steps.push({ euclidA: a, euclidB: 0, euclidR: null, result: a,
    message: `b = 0 → CMMDC = ${a}`, pseudoLine: 4 });
  return steps;
}

export function isPrimeSteps(n) {
  const steps = [{ primeN: n, primeD: null, verdict: null,
    message: `Verificăm dacă ${n} este număr prim`, pseudoLine: -1 }];
  if (n < 2) {
    steps.push({ primeN: n, primeD: null, verdict: "not_prime",
      message: `${n} < 2 → NU este prim`, pseudoLine: 0 });
    return steps;
  }
  for (let d = 2; d * d <= n; d++) {
    steps.push({ primeN: n, primeD: d, verdict: null,
      message: `Testăm d=${d}: ${n} mod ${d} = ${n % d}`, pseudoLine: 1 });
    if (n % d === 0) {
      steps.push({ primeN: n, primeD: d, verdict: "not_prime",
        message: `${n} = ${d} × ${n/d} → NU este prim`, pseudoLine: 2 });
      return steps;
    }
  }
  steps.push({ primeN: n, primeD: null, verdict: "prime",
    message: `Niciun divizor până la √${n} ≈ ${Math.floor(Math.sqrt(n))} → ESTE PRIM`, pseudoLine: 3 });
  return steps;
}

export function sieveSteps(n) {
  n = Math.min(Math.max(n, 5), 100);
  const primes = new Array(n + 1).fill(true);
  primes[0] = primes[1] = false;
  const steps = [{ sieveN: n, primes: [...primes], currentPrime: null, markingVal: null,
    message: `Ciurul lui Eratostene până la ${n} — inițializăm toate ca prime`, pseudoLine: 0 }];

  for (let i = 2; i * i <= n; i++) {
    if (primes[i]) {
      steps.push({ sieveN: n, primes: [...primes], currentPrime: i, markingVal: null,
        message: `${i} este prim — marcăm multiplii: ${i}², ${i}²+${i}, …`, pseudoLine: 2 });
      for (let j = i * i; j <= n; j += i) {
        primes[j] = false;
        steps.push({ sieveN: n, primes: [...primes], currentPrime: i, markingVal: j,
          message: `Marcăm ${j} = ${i}×${j/i} ca număr compus`, pseudoLine: 3 });
      }
    }
  }
  const found = [];
  for (let i = 2; i <= n; i++) if (primes[i]) found.push(i);
  steps.push({ sieveN: n, primes: [...primes], currentPrime: null, markingVal: null,
    message: `Gata! ${found.length} prime: ${found.slice(0, 10).join(", ")}${found.length > 10 ? "…" : ""}`, pseudoLine: 5 });
  return steps;
}

/**
 * Dispatcher principal — selectează generatorul de pași potrivit.
 * @param {string} algorithmId - Id-ul algoritmului (ex: "bubbleSort", "bfs")
 * @param {{vector?:number[], target?:number, graph?:Object, startNode?:string}} payload
 * @returns {Array} Array de pași pentru vizualizare
 */
export function buildSteps(algorithmId, payload) {
  if (algorithmId === "bubbleSort")    return bubbleSortSteps(payload.vector || []);
  if (algorithmId === "selectionSort") return selectionSortSteps(payload.vector || []);
  if (algorithmId === "insertionSort") return insertionSortSteps(payload.vector || []);
  if (algorithmId === "mergeSort")     return mergeSortSteps(payload.vector || []);
  if (algorithmId === "quickSort")     return quickSortSteps(payload.vector || []);
  if (algorithmId === "linearSearch")  return linearSearchSteps(payload.vector || [], payload.target ?? 0);
  if (algorithmId === "binarySearch")  return binarySearchSteps(payload.vector || [], payload.target ?? 0);
  if (algorithmId === "heapSort")      return heapSortSteps(payload.vector || []);
  if (algorithmId === "countingSort")  return countingSortSteps(payload.vector || []);
  if (algorithmId === "euclid")        return euclidSteps(payload.a || 48, payload.b || 18);
  if (algorithmId === "isPrime")       return isPrimeSteps(payload.n || 17);
  if (algorithmId === "sieve")         return sieveSteps(payload.n || 30);
  if (algorithmId === "bfs")           return bfsSteps(payload.graph, payload.startNode);
  if (algorithmId === "dfs")           return dfsSteps(payload.graph, payload.startNode);
  return [];
}

export const DEFAULT_GRAPH = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: []
};

export const GRAPH_PRESETS = [
  {
    id: "general",
    name: "Graf general (6 noduri)",
    graph: { A:["B","C"], B:["D","E"], C:["F"], D:[], E:["F"], F:[] },
    startNode: "A"
  },
  {
    id: "lant",
    name: "Lanț (5 noduri)",
    graph: { A:["B"], B:["A","C"], C:["B","D"], D:["C","E"], E:["D"] },
    startNode: "A"
  },
  {
    id: "arbore",
    name: "Arbore binar (7 noduri)",
    graph: { A:["B","C"], B:["D","E"], C:["F","G"], D:[], E:[], F:[], G:[] },
    startNode: "A"
  },
  {
    id: "ciclic",
    name: "Graf ciclic (5 noduri)",
    graph: { A:["B","E"], B:["A","C"], C:["B","D"], D:["C","E"], E:["D","A"] },
    startNode: "A"
  }
];
