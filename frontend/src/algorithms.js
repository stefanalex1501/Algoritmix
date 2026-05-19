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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
  const steps = [{ array: [...a], message: "Vector inițial", pseudoLine: -1 }];

  function partition(low, high) {
    const pivot = a[high];
    let i = low - 1;
    steps.push({ array: [...a], range: [low, high], pivot: high, message: `Pivot = ${pivot}`, pseudoLine: 0 });

    for (let j = low; j < high; j++) {
      steps.push({ array: [...a], active: [j, high], range: [low, high], pivot: high, message: `Comparăm ${a[j]} cu pivot ${pivot}`, pseudoLine: 1 });
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({ array: [...a], active: [i, j], pivot: high, message: "Mutăm elementul în partea stângă", pseudoLine: 2 });
      }
    }

    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push({ array: [...a], active: [i + 1, high], pivot: i + 1, message: "Plasăm pivotul pe poziția finală", pseudoLine: 3 });
    return i + 1;
  }

  function sort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, a.length - 1);
  steps.push({ array: [...a], message: "Sortare finalizată", pseudoLine: -1 });
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
  const steps = [{ array: [...a], active: [], mergeRange: null, message: "Vector inițial", pseudoLine: -1 }];

  function merge(left, mid, right) {
    const L = a.slice(left, mid + 1);
    const R = a.slice(mid + 1, right + 1);
    steps.push({ array: [...a], active: [], mergeRange: [left, right],
      message: `Interclasăm [${left + 1}..${mid + 1}] cu [${mid + 2}..${right + 1}]`, pseudoLine: 4 });

    let i = 0, j = 0, k = left;
    while (i < L.length && j < R.length) {
      const li = left + i, ri = mid + 1 + j;
      if (L[i] <= R[j]) {
        steps.push({ array: [...a], active: [li, ri], mergeRange: [left, right],
          message: `${L[i]} ≤ ${R[j]} → plasăm ${L[i]}`, pseudoLine: 4 });
        a[k++] = L[i++];
      } else {
        steps.push({ array: [...a], active: [li, ri], mergeRange: [left, right],
          message: `${L[i]} > ${R[j]} → plasăm ${R[j]}`, pseudoLine: 4 });
        a[k++] = R[j++];
      }
      steps.push({ array: [...a], active: [k - 1], mergeRange: [left, right],
        message: `Plasat pe poziția ${k}`, pseudoLine: 4 });
    }
    while (i < L.length) { a[k++] = L[i++]; }
    while (j < R.length) { a[k++] = R[j++]; }
    steps.push({ array: [...a], active: [], mergeRange: [left, right],
      message: `Interval [${left + 1}..${right + 1}] interclasare finalizată`, pseudoLine: 4 });
  }

  function sort(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({ array: [...a], active: [], mergeRange: null,
        message: `Împărțim [${left + 1}..${right + 1}] → mijloc = ${mid + 1}`, pseudoLine: 1 });
      sort(left, mid);
      sort(mid + 1, right);
      merge(left, mid, right);
    }
  }

  sort(0, a.length - 1);
  steps.push({ array: [...a], active: [], mergeRange: null, message: "Sortare finalizată", pseudoLine: -1 });
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
