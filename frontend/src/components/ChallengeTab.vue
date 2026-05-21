<template>
  <section class="card">
    <div class="challenge-header">
      <div>
        <h2>{{ t('tab_challenge') }}</h2>
        <p class="muted" style="margin:4px 0 0">{{ t('challenge_desc') }}</p>
      </div>
      <span class="score-chip" v-if="score.total > 0">{{ score.correct }}/{{ score.total }}</span>
    </div>

    <div v-if="q">
      <p class="pq-algo-label">{{ t('challenge_algo') }}: <strong>{{ algoName }}</strong></p>

      <div class="pseudo-lines pq-pseudo">
        <div
          v-for="(line, i) in q.pseudocode" :key="i"
          class="pseudo-line"
          :class="i === q.blankLine ? 'pq-blank-line' : ''"
        >{{ i === q.blankLine ? '  ???' : line }}</div>
      </div>

      <p class="pq-question">{{ t('challenge_question') }}</p>

      <div class="pq-options">
        <button
          v-for="(opt, idx) in q.options" :key="idx"
          class="pq-option"
          :class="optClass(idx)"
          @click="answer(idx)"
          :disabled="answered"
        >{{ opt }}</button>
      </div>

      <div v-if="answered" class="quiz-result" :class="wasCorrect ? 'result-ok' : 'result-bad'">
        <strong>{{ wasCorrect ? t('quiz_correct') : t('quiz_wrong') }}</strong>
        <p class="quiz-explanation">{{ q.explanation }}</p>
      </div>

      <button class="quiz-next-btn" @click="next">
        {{ answered ? t('quiz_next') : t('quiz_skip') }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { ALGORITHMS } from "../algorithms.js";
import { useI18n } from "../i18n/index.js";

const { t } = useI18n();

const QUESTIONS = [
  // ── Bubble Sort ────────────────────────────────────────
  {
    algo: "bubbleSort",
    pseudocode: ["pentru i = 1 → n-1:", "  pentru j = 1 → n-i:", "    dacă v[j] > v[j+1]:", "      interschimbă v[j] și v[j+1]"],
    blankLine: 2,
    correct: "    dacă v[j] > v[j+1]:",
    options: ["    dacă v[j] > v[j+1]:", "    dacă v[j] < v[j+1]:", "    dacă v[j] == v[j+1]:", "    dacă v[i] > v[j]:"],
    explanation: "Bubble Sort interschimbă când elementul stâng este MAI MARE decât cel drept (v[j] > v[j+1]), aducând elementele mari spre dreapta."
  },
  {
    algo: "bubbleSort",
    pseudocode: ["pentru i = 1 → n-1:", "  pentru j = 1 → n-i:", "    dacă v[j] > v[j+1]:", "      interschimbă v[j] și v[j+1]"],
    blankLine: 1,
    correct: "  pentru j = 1 → n-i:",
    options: ["  pentru j = 1 → n-i:", "  pentru j = 1 → n:", "  pentru j = i → n-1:", "  pentru j = 1 → n-1:"],
    explanation: "Bucla interioară merge până la n-i deoarece după i pași, ultimele i elemente sunt deja la locul lor — nu mai trebuie comparate."
  },
  {
    algo: "bubbleSort",
    pseudocode: ["pentru i = 1 → n-1:", "  pentru j = 1 → n-i:", "    dacă v[j] > v[j+1]:", "      interschimbă v[j] și v[j+1]"],
    blankLine: 0,
    correct: "pentru i = 1 → n-1:",
    options: ["pentru i = 1 → n-1:", "pentru i = 1 → n:", "pentru i = 1 → n-2:", "pentru i = 0 → n:"],
    explanation: "Bucla exterioară face n-1 pași. Nu e nevoie de n pași deoarece după n-1 interschimbări, primul element e și el la locul corect."
  },

  // ── Selection Sort ─────────────────────────────────────
  {
    algo: "selectionSort",
    pseudocode: ["pentru i = 1 → n-1:", "  min_idx = i", "  pentru j = i+1 → n:", "    dacă v[j] < v[min_idx]: min_idx = j", "  interschimbă v[i] și v[min_idx]"],
    blankLine: 3,
    correct: "    dacă v[j] < v[min_idx]: min_idx = j",
    options: ["    dacă v[j] < v[min_idx]: min_idx = j", "    dacă v[j] > v[min_idx]: min_idx = j", "    dacă v[j] < v[i]: min_idx = j", "    dacă v[j] == v[min_idx]: min_idx = j"],
    explanation: "Selection Sort caută MINIMUL subvectorului nesortat, deci condiția e v[j] < v[min_idx] — actualizăm min_idx când găsim un element mai mic."
  },
  {
    algo: "selectionSort",
    pseudocode: ["pentru i = 1 → n-1:", "  min_idx = i", "  pentru j = i+1 → n:", "    dacă v[j] < v[min_idx]: min_idx = j", "  interschimbă v[i] și v[min_idx]"],
    blankLine: 1,
    correct: "  min_idx = i",
    options: ["  min_idx = i", "  min_idx = 1", "  min_idx = 0", "  min_idx = j"],
    explanation: "La fiecare pas i, presupunem că minimul subvectorului nesortat este chiar elementul de la poziția i (min_idx = i), apoi verificăm dacă există unul mai mic."
  },
  {
    algo: "selectionSort",
    pseudocode: ["pentru i = 1 → n-1:", "  min_idx = i", "  pentru j = i+1 → n:", "    dacă v[j] < v[min_idx]: min_idx = j", "  interschimbă v[i] și v[min_idx]"],
    blankLine: 4,
    correct: "  interschimbă v[i] și v[min_idx]",
    options: ["  interschimbă v[i] și v[min_idx]", "  interschimbă v[i] și v[i+1]", "  interschimbă v[min_idx] și v[n]", "  v[i] = v[min_idx]"],
    explanation: "Plasăm minimul găsit (v[min_idx]) pe poziția corectă (i) printr-o singură interschimbare — acesta e avantajul față de Bubble Sort."
  },

  // ── Insertion Sort ─────────────────────────────────────
  {
    algo: "insertionSort",
    pseudocode: ["pentru i = 2 → n:", "  cheie = v[i]", "  j = i - 1", "  cât timp j ≥ 1 și v[j] > cheie:", "    v[j+1] = v[j]; j = j - 1", "  v[j+1] = cheie"],
    blankLine: 3,
    correct: "  cât timp j ≥ 1 și v[j] > cheie:",
    options: ["  cât timp j ≥ 1 și v[j] > cheie:", "  cât timp j ≥ 1 și v[j] < cheie:", "  cât timp j > 0 și v[j] == cheie:", "  cât timp j ≥ 0 și v[j] > cheie:"],
    explanation: "Condiția deplasează spre dreapta elementele mai mari decât cheia (v[j] > cheie), oprindu-se când găsim locul corect sau ajungem la începutul vectorului (j ≥ 1)."
  },
  {
    algo: "insertionSort",
    pseudocode: ["pentru i = 2 → n:", "  cheie = v[i]", "  j = i - 1", "  cât timp j ≥ 1 și v[j] > cheie:", "    v[j+1] = v[j]; j = j - 1", "  v[j+1] = cheie"],
    blankLine: 5,
    correct: "  v[j+1] = cheie",
    options: ["  v[j+1] = cheie", "  v[j] = cheie", "  v[i] = cheie", "  v[j-1] = cheie"],
    explanation: "Inserăm cheia la poziția j+1 (nu j!) deoarece bucla while s-a oprit cu j indicând elementul mai mic sau egal — locul cheii e imediat la dreapta lui."
  },
  {
    algo: "insertionSort",
    pseudocode: ["pentru i = 2 → n:", "  cheie = v[i]", "  j = i - 1", "  cât timp j ≥ 1 și v[j] > cheie:", "    v[j+1] = v[j]; j = j - 1", "  v[j+1] = cheie"],
    blankLine: 0,
    correct: "pentru i = 2 → n:",
    options: ["pentru i = 2 → n:", "pentru i = 1 → n:", "pentru i = 1 → n-1:", "pentru i = 2 → n-1:"],
    explanation: "Insertion Sort pornește de la i = 2 (al doilea element) deoarece subvectorul format din primul element singur este deja sortat prin definiție."
  },

  // ── Binary Search ──────────────────────────────────────
  {
    algo: "binarySearch",
    pseudocode: ["stânga = 1, dreapta = n", "cât timp stânga ≤ dreapta:", "  mijloc = (stânga + dreapta) / 2", "  dacă v[mijloc] == țintă: găsit!", "  dacă v[mijloc] < țintă: stânga = mijloc+1", "  altfel: dreapta = mijloc-1"],
    blankLine: 4,
    correct: "  dacă v[mijloc] < țintă: stânga = mijloc+1",
    options: ["  dacă v[mijloc] < țintă: stânga = mijloc+1", "  dacă v[mijloc] < țintă: dreapta = mijloc-1", "  dacă v[mijloc] > țintă: stânga = mijloc+1", "  dacă v[mijloc] < țintă: stânga = mijloc"],
    explanation: "Dacă mijlocul e mai mic decât ținta, ținta e în jumătatea DREAPTĂ → mutăm stânga = mijloc+1. Dacă am folosi dreapta, am căuta în direcția greșită."
  },
  {
    algo: "binarySearch",
    pseudocode: ["stânga = 1, dreapta = n", "cât timp stânga ≤ dreapta:", "  mijloc = (stânga + dreapta) / 2", "  dacă v[mijloc] == țintă: găsit!", "  dacă v[mijloc] < țintă: stânga = mijloc+1", "  altfel: dreapta = mijloc-1"],
    blankLine: 2,
    correct: "  mijloc = (stânga + dreapta) / 2",
    options: ["  mijloc = (stânga + dreapta) / 2", "  mijloc = (stânga + dreapta) / 2 + 1", "  mijloc = stânga + dreapta / 2", "  mijloc = dreapta - stânga / 2"],
    explanation: "Mijlocul se calculează ca (stânga + dreapta) / 2 — media aritmetică a capetelor intervalului. Parantezele sunt esențiale pentru a evita erori de calcul."
  },
  {
    algo: "binarySearch",
    pseudocode: ["stânga = 1, dreapta = n", "cât timp stânga ≤ dreapta:", "  mijloc = (stânga + dreapta) / 2", "  dacă v[mijloc] == țintă: găsit!", "  dacă v[mijloc] < țintă: stânga = mijloc+1", "  altfel: dreapta = mijloc-1"],
    blankLine: 1,
    correct: "cât timp stânga ≤ dreapta:",
    options: ["cât timp stânga ≤ dreapta:", "cât timp stânga < dreapta:", "cât timp stânga != dreapta:", "cât timp stânga ≥ dreapta:"],
    explanation: "Condiția e stânga ≤ dreapta (nu strict <) deoarece când stânga == dreapta mai există un singur element de verificat. Cu < strict, am rata elementul din mijloc."
  },

  // ── Quick Sort ─────────────────────────────────────────
  {
    algo: "quickSort",
    pseudocode: ["alege pivot = v[dreapta]", "pentru j = stânga → dreapta-1:", "  dacă v[j] ≤ pivot → mută la stânga", "plasează pivot pe poziția finală", "apelează recursiv pe subvectori"],
    blankLine: 0,
    correct: "alege pivot = v[dreapta]",
    options: ["alege pivot = v[dreapta]", "alege pivot = v[stânga]", "alege pivot = v[mijloc]", "alege pivot = valoarea minimă"],
    explanation: "În implementarea Lomuto (cea standard din BAC), pivotul este ultimul element al subvectorului curent (v[dreapta]). Există și alte strategii de alegere a pivotului."
  },
  {
    algo: "quickSort",
    pseudocode: ["alege pivot = v[dreapta]", "pentru j = stânga → dreapta-1:", "  dacă v[j] ≤ pivot → mută la stânga", "plasează pivot pe poziția finală", "apelează recursiv pe subvectori"],
    blankLine: 2,
    correct: "  dacă v[j] ≤ pivot → mută la stânga",
    options: ["  dacă v[j] ≤ pivot → mută la stânga", "  dacă v[j] < pivot → mută la stânga", "  dacă v[j] ≥ pivot → mută la stânga", "  dacă v[j] > pivot → mută la stânga"],
    explanation: "Elementele mai mici SAU EGALE cu pivotul sunt mutate în stânga (v[j] ≤ pivot). Includerea egalității asigură că elementele duplicate față de pivot sunt gestionate corect."
  },

  // ── BFS ───────────────────────────────────────────────
  {
    algo: "bfs",
    pseudocode: ["coadă ← { nod_start }", "marchează nod_start ca vizitat", "cât timp coada ≠ ∅:", "  nod ← extrage din coadă", "  pentru fiecare vecin nevizitat:", "    adaugă în coadă și marchează"],
    blankLine: 0,
    correct: "coadă ← { nod_start }",
    options: ["coadă ← { nod_start }", "stivă ← { nod_start }", "coadă ← ∅", "coadă ← toți vecinii nod_start"],
    explanation: "BFS folosește o COADĂ (FIFO), nu o stivă. Inițializăm coada cu nodul de start — acesta este primul nod de explorat."
  },
  {
    algo: "bfs",
    pseudocode: ["coadă ← { nod_start }", "marchează nod_start ca vizitat", "cât timp coada ≠ ∅:", "  nod ← extrage din coadă", "  pentru fiecare vecin nevizitat:", "    adaugă în coadă și marchează"],
    blankLine: 4,
    correct: "  pentru fiecare vecin nevizitat:",
    options: ["  pentru fiecare vecin nevizitat:", "  pentru fiecare vecin vizitat:", "  pentru fiecare nod din graf:", "  pentru primul vecin nevizitat:"],
    explanation: "Verificăm dacă vecinul e NEVIZITAT înainte de a-l adăuga în coadă — altfel am procesa același nod de mai multe ori și am putea intra în buclă infinită."
  },

  // ── DFS ───────────────────────────────────────────────
  {
    algo: "dfs",
    pseudocode: ["stivă ← { nod_start }", "marchează nod_start ca vizitat", "cât timp stiva ≠ ∅:", "  nod ← extrage din vârful stivei", "  pentru fiecare vecin nevizitat:", "    adaugă în stivă și marchează"],
    blankLine: 3,
    correct: "  nod ← extrage din vârful stivei",
    options: ["  nod ← extrage din vârful stivei", "  nod ← extrage din baza stivei", "  nod ← extrage din coadă", "  nod ← primul nod nevizitat"],
    explanation: "DFS extrage din VÂRFUL stivei (LIFO) — acesta e motivul pentru care explorează în adâncime, urmând un drum până la capăt înainte de a reveni."
  },
];

const idx      = ref(0);
const answered = ref(false);
const chosen   = ref(null);
const wasCorrect = ref(false);
const score    = ref({ correct: 0, total: 0 });
const order    = ref(shuffle(QUESTIONS.map((_, i) => i)));

const q = computed(() => QUESTIONS[order.value[idx.value % order.value.length]]);
const algoName = computed(() => ALGORITHMS[q.value?.algo]?.name || "");

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function answer(optIdx) {
  if (answered.value) return;
  answered.value   = true;
  chosen.value     = optIdx;
  wasCorrect.value = q.value.options[optIdx] === q.value.correct;
  score.value.total++;
  if (wasCorrect.value) score.value.correct++;
}

function next() {
  idx.value++;
  answered.value   = false;
  chosen.value     = null;
  wasCorrect.value = false;
  if (idx.value >= order.value.length) {
    order.value = shuffle(QUESTIONS.map((_, i) => i));
    idx.value   = 0;
  }
}

function optClass(optIdx) {
  if (!answered.value) return "";
  if (q.value.options[optIdx] === q.value.correct) return "opt-correct";
  if (optIdx === chosen.value)                      return "opt-wrong";
  return "opt-dim";
}
</script>
