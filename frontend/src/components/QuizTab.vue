<template>
  <section class="card">
    <div class="quiz-header">
      <div>
        <h2>{{ t('quiz_title') }}</h2>
      </div>
      <div class="quiz-stats" v-if="quizSession.total > 0">
        <span class="score-chip">{{ quizSession.score }}/{{ quizSession.total }}</span>
        <span class="streak-chip" v-if="flameActive || flameOut || quizSession.streak >= 2">
          <span class="flame-icon" :class="flameOut ? 'flame-out' : (flameActive ? 'flame-burn' : '')" :key="flameKey">🔥</span>
          <span v-if="quizSession.streak >= 2">{{ quizSession.streak }}×</span>
        </span>
      </div>
    </div>

    <p class="quiz-prompt">{{ quiz.prompt }}</p>

    <div v-if="quiz.type === 'visual' && quiz.step" class="quiz-viz-area">
      <!-- Căutare Liniară -->
      <div v-if="quiz.vizAlgo === 'linearSearch'" class="bsearch-viz">
        <div class="bsearch-target">
          {{ t('search_for') }} <strong>{{ quiz.step.target }}</strong>
          <span v-if="quiz.step.found" class="bsearch-found-badge">{{ t('found_at', { pos: quiz.step.active?.[0] + 1 }) }}</span>
        </div>
        <div class="bsearch-array">
          <div v-for="(val, i) in quiz.step.array" :key="i" class="bsearch-cell">
            <div class="bsearch-box" :class="quizLinearBoxClass(i)">{{ val }}</div>
            <div class="bsearch-idx">{{ i + 1 }}</div>
          </div>
        </div>
        <div class="bar-legend" style="margin-top:10px">
          <span class="legend-item"><span class="legend-dot" style="background:#f0c040"></span>{{ t('legend_active') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#4ade80"></span>{{ t('legend_found') }}</span>
        </div>
      </div>

      <!-- Căutare Binară -->
      <div v-else-if="quiz.vizAlgo === 'binarySearch'" class="bsearch-viz">
        <div class="bsearch-target">
          {{ t('search_for') }} <strong>{{ quiz.step.target }}</strong>
          <span v-if="quiz.step.found" class="bsearch-found-badge">{{ t('found_at', { pos: quiz.step.mid + 1 }) }}</span>
        </div>
        <div class="bsearch-array">
          <div v-for="(val, i) in quiz.step.array" :key="i" class="bsearch-cell">
            <div class="bsearch-box" :class="quizBsearchBoxClass(i)">{{ val }}</div>
            <div class="bsearch-markers">
              <span v-if="i === quiz.step.left"  class="mk-st">st</span>
              <span v-if="i === quiz.step.mid"   class="mk-mij">mij</span>
              <span v-if="i === quiz.step.right" class="mk-dr">dr</span>
            </div>
            <div class="bsearch-idx">{{ i + 1 }}</div>
          </div>
        </div>
        <div class="bar-legend" style="margin-top:10px">
          <span class="legend-item"><span class="legend-dot" style="background:#f0c040"></span>{{ t('legend_mid') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#4ade80"></span>{{ t('legend_found') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#0d1a26; border:1px solid #1e3248"></span>{{ t('legend_out') }}</span>
        </div>
      </div>

      <!-- Sorting bar chart -->
      <div v-else-if="quiz.vizAlgo !== 'bfs'" class="bars-container">
        <div class="bars">
          <div v-for="(val, i) in quiz.step.array" :key="i" class="bar-wrap">
            <span class="bar-val">{{ val }}</span>
            <div class="bar" :style="quizBarStyle(val, i)"></div>
            <span class="bar-idx">{{ i + 1 }}</span>
          </div>
        </div>
        <div class="bar-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#c89000"></span>{{ t('legend_compared') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#b03030"></span>{{ t('legend_pivot') }}</span>
        </div>
      </div>

      <!-- BFS graph -->
      <div v-else-if="quiz.vizAlgo === 'bfs'" class="bfs-viz">
        <svg viewBox="0 0 400 260" class="bfs-svg">
          <defs>
            <marker id="arr-q" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill="#2a4a6a" />
            </marker>
          </defs>
          <line v-for="([a, b]) in BFS_EDGES" :key="a + b" v-bind="edgeLine(a, b)" stroke="#2a4a6a" stroke-width="2" marker-end="url(#arr-q)" />
          <g v-for="(pos, nodeId) in BFS_NODES" :key="nodeId">
            <circle :cx="pos.x" :cy="pos.y" r="20" :fill="bfsNodeFill(nodeId, quiz.step)" :stroke="bfsNodeStroke(nodeId, quiz.step)" stroke-width="2.5" />
            <text :x="pos.x" :y="pos.y + 5" text-anchor="middle" font-size="14" font-weight="bold" :fill="bfsNodeText(nodeId, quiz.step)">{{ nodeId }}</text>
          </g>
        </svg>
        <div class="bfs-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>{{ t('legend_cur') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#4ade80"></span>{{ t('legend_visited') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#a78bfa"></span>{{ t('legend_inqueue') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#60a5fa"></span>{{ t('legend_queued') }}</span>
        </div>
      </div>
    </div>

    <div class="quiz-options" :class="quiz.type === 'text' ? 'quiz-options-col' : ''">
      <button
        v-for="opt in quiz.options" :key="opt.id"
        class="quiz-option" :class="quizOptionClass(opt.id)"
        @click="answerQuiz(opt.id)" :disabled="quiz.answered"
      >{{ opt.label }}</button>
    </div>

    <div v-if="quiz.answered" class="quiz-result" :class="quiz.correct ? 'result-ok' : 'result-bad'">
      <strong>{{ quiz.correct ? t('quiz_correct') : t('quiz_wrong') }}</strong>
      {{ quiz.correct ? t('quiz_right_ans') : `${t('quiz_was')} ${prettyName(quiz.correctId)}.` }}
      <p class="quiz-explanation">{{ quiz.explanation }}</p>
    </div>

    <button class="quiz-next-btn" @click="generateQuestion">
      {{ quiz.answered ? t('quiz_next') : t('quiz_skip') }}
    </button>
  </section>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { ALGORITHMS, DEFAULT_GRAPH, bubbleSortSteps, selectionSortSteps, insertionSortSteps, mergeSortSteps, quickSortSteps, linearSearchSteps, binarySearchSteps, bfsSteps } from "../algorithms.js";
import { useI18n } from "../i18n/index.js";
import { useStats } from "../composables/useStats.js";
import { useCustomContent } from "../composables/useCustomContent.js";

const { t } = useI18n();
const { stats, quizSession, saveStats, trackAlgorithm } = useStats();
const { customQuestions } = useCustomContent();

const quiz = reactive({
  type: "text", prompt: "", vizAlgo: "", step: null, initialArray: [],
  options: [], correctId: "", explanation: "", answered: false, chosen: null, correct: false,
});

const flameActive = ref(false);
const flameOut    = ref(false);
const flameKey    = ref(0);
let flameOutTimer = null;

const BFS_NODES = { A:{x:200,y:45}, B:{x:110,y:130}, C:{x:290,y:130}, D:{x:55,y:215}, E:{x:165,y:215}, F:{x:290,y:215} };
const BFS_EDGES = [["A","B"],["A","C"],["B","D"],["B","E"],["C","F"],["E","F"]];

function edgeLine(from, to) {
  const f = BFS_NODES[from], t2 = BFS_NODES[to];
  if (!f || !t2) return {};
  const r = 24, dx = t2.x - f.x, dy = t2.y - f.y, len = Math.sqrt(dx*dx + dy*dy);
  const ux = dx/len, uy = dy/len;
  return { x1: f.x + ux*r, y1: f.y + uy*r, x2: t2.x - ux*r, y2: t2.y - uy*r };
}

function bfsNodeFill(id, step) {
  const s = step || {};
  const pending = s.queue || s.stack || [];
  if (s.current === id) return "#f59e0b";
  if (s.next    === id) return "#60a5fa";
  if ((s.order  || []).includes(id)) return "#4ade80";
  if (pending.includes(id)) return "#a78bfa";
  return "#1a2d40";
}
function bfsNodeStroke(id, step) {
  const s = step || {};
  const pending = s.queue || s.stack || [];
  if (s.current === id) return "#d97706";
  if (s.next    === id) return "#3b82f6";
  if ((s.order  || []).includes(id)) return "#22c55e";
  if (pending.includes(id)) return "#8b5cf6";
  return "#1e3550";
}
function bfsNodeText(id, step) {
  const s = step || {};
  const pending = s.queue || s.stack || [];
  if (s.current === id || s.next === id) return "#0a0a0a";
  if ((s.order  || []).includes(id)) return "#052e10";
  if (pending.includes(id)) return "#1a0a40";
  return "#7ecff5";
}

const quizMaxVal = computed(() => Math.max(...(quiz.initialArray.length ? quiz.initialArray : [1])));
const quizMinVal = computed(() => Math.min(...(quiz.initialArray.length ? quiz.initialArray : [0])));

function quizBarStyle(val, idx) {
  const s = quiz.step || {};
  const algo = quiz.vizAlgo;
  const h = Math.max(Math.round((val / quizMaxVal.value) * 160), 6) + "px";
  const gradHue = Math.round(220 - ((val - quizMinVal.value) / (quizMaxVal.value - quizMinVal.value || 1)) * 220);

  if (algo === "selectionSort") {
    const { active, minIdx, sortedUpTo } = s;
    if (sortedUpTo !== undefined && idx < sortedUpTo) return { height: h, background: "#1a4a2a" };
    if (idx === minIdx)        return { height: h, background: "#4ade80", boxShadow: "0 0 16px #4ade8099" };
    if (active?.includes(idx)) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    return { height: h, background: `hsl(${gradHue}, 72%, 52%)` };
  }
  if (algo === "insertionSort") {
    const { active, keyIdx, sortedUpTo } = s;
    if (sortedUpTo !== undefined && idx < sortedUpTo && idx !== keyIdx) return { height: h, background: "#1a4a2a" };
    if (idx === keyIdx)        return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    if (active?.includes(idx)) return { height: h, background: "#c89000" };
    return { height: h, background: `hsl(${gradHue}, 72%, 52%)` };
  }
  if (algo === "mergeSort") {
    const { active, mergeRange } = s;
    if (active?.includes(idx)) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    if (mergeRange && idx >= mergeRange[0] && idx <= mergeRange[1]) return { height: h, background: "#5b21b6", opacity: "0.85" };
    return { height: h, background: `hsl(${gradHue}, 72%, 52%)` };
  }
  // bubbleSort / quickSort
  if (s.pivot === idx) return { height: h, background: "#e05555", boxShadow: "0 0 16px #e0555599" };
  if (s.active?.includes(idx)) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
  return { height: h, background: `hsl(${gradHue}, 72%, 52%)` };
}

function quizBsearchBoxClass(i) {
  const s = quiz.step || {};
  if (!s.array) return "box-in";
  if (s.found && i === s.mid)  return "box-found";
  if (i === s.mid)             return "box-mid";
  if (s.left !== undefined && s.right !== undefined && (i < s.left || i > s.right)) return "box-out";
  return "box-in";
}
function quizLinearBoxClass(i) {
  const s = quiz.step || {};
  if (!s.array) return "box-in";
  if (s.found && s.active?.includes(i)) return "box-found";
  if (s.active?.includes(i)) return "box-mid";
  return "box-in";
}

function quizOptionClass(id) {
  if (!quiz.answered) return "";
  if (id === quiz.correctId) return "opt-correct";
  if (id === quiz.chosen)    return "opt-wrong";
  return "opt-dim";
}

function prettyName(id) { return ALGORITHMS[id]?.name || id; }

const VISUAL_QUIZ_ALGOS = ["bubbleSort", "selectionSort", "insertionSort", "quickSort", "mergeSort", "linearSearch", "binarySearch", "bfs"];
const VISUAL_EXPLANATIONS = {
  bubbleSort:    "Bubble Sort compară și interschimbă perechi de elemente vecine (galben). Nu există pivot — doar comparații adiacente repetate.",
  selectionSort: "Selection Sort caută minimul din restul vectorului (verde) prin comparații (galben) și îl plasează la stânga. Elementele sortate sunt cu verde închis.",
  insertionSort: "Insertion Sort ia fiecare element (galben) și îl inserează în poziția corectă în subvectorul sortat din stânga (verde închis), deplasând elementele mai mari.",
  quickSort:     "Quick Sort alege un element pivot (roșu) și plasează elementele mai mici la stânga, mai mari la dreapta — recursiv.",
  mergeSort:     "Merge Sort împarte vectorul în jumătăți (violet = interval curent de interclasare) și le combină comparând elementele (galben) una câte una.",
  linearSearch:  "Căutarea Liniară verifică fiecare element pe rând (galben) de la stânga la dreapta până găsește ținta (verde) sau parcurge tot vectorul.",
  binarySearch:  "Căutarea Binară înjumătățește intervalul la fiecare pas. Celula galbenă = mijlocul curent. Celulele estompate = excluse din căutare.",
  bfs:           "BFS parcurge graful nivel cu nivel cu o coadă FIFO. Nodul portocaliu este curent, cel albastru tocmai adăugat, cel verde vizitat.",
};

const TEXT_QUESTIONS = [
  { prompt: "Care este complexitatea Bubble Sort în cazul cel mai rău?", options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], correct: "O(n²)", explanation: "Bubble Sort face n·(n−1)/2 comparații în cazul cel mai rău (vector sortat invers) → O(n²)." },
  { prompt: "Care este complexitatea medie a Quick Sort?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correct: "O(n log n)", explanation: "În cazul mediu, Quick Sort produce partiții echilibrate: O(log n) niveluri × O(n) operații per nivel." },
  { prompt: "Care este complexitatea Quick Sort în cazul cel mai rău?", options: ["O(n²)", "O(n log n)", "O(n)", "O(n³)"], correct: "O(n²)", explanation: "Cazul cel mai rău apare când pivotul este mereu extrema vectorului → n niveluri dezechilibrate." },
  { prompt: "Care este complexitatea BFS pe un graf cu V noduri și E muchii?", options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V · E)"], correct: "O(V + E)", explanation: "BFS vizitează fiecare nod o singură dată (O(V)) și parcurge fiecare muchie o singură dată (O(E)) → total O(V + E)." },
  { prompt: "Bubble Sort pe un vector deja sortat face câte interschimbări (swap-uri)?", options: ["0", "n − 1", "n", "n²"], correct: "0", explanation: "Dacă vectorul e deja sortat, nicio pereche adiacentă nu necesită swap → 0 interschimbări, dar tot se fac O(n²) comparații." },
  { prompt: "Ce structură de date folosește BFS intern pentru a reține nodurile de vizitat?", options: ["Coadă (FIFO)", "Stivă (LIFO)", "Heap minim", "Arbore binar"], correct: "Coadă (FIFO)", explanation: "BFS adaugă noduri la coadă și le extrage în ordine → FIFO garantează parcurgerea nivel cu nivel." },
  { prompt: "DFS (Depth-First Search) folosește ce structură de date, spre deosebire de BFS?", options: ["Stivă (LIFO)", "Coadă (FIFO)", "Heap maxim", "Coadă de priorități"], correct: "Stivă (LIFO)", explanation: "DFS merge în adâncime înainte de a explora vecinii — implementat cu stivă explicită sau prin recursivitate." },
  { prompt: "Care algoritm folosește strategia 'divide et impera'?", options: ["Quick Sort", "Bubble Sort", "BFS", "Selection Sort"], correct: "Quick Sort", explanation: "Quick Sort împarte vectorul față de pivot și rezolvă recursiv subproblemele — clasic 'divide et impera'." },
  { prompt: "Bubble Sort este un algoritm stabil?", options: ["Da, este stabil", "Nu, nu este stabil", "Depinde de implementare", "Numai pentru n ≤ 10"], correct: "Da, este stabil", explanation: "Bubble Sort face swap doar când v[j] > v[j+1] (strict), deci elementele egale nu se inversează → stabil." },
  { prompt: "Quick Sort standard (pivot = ultimul element) este un algoritm stabil?", options: ["Nu, nu este stabil", "Da, este stabil", "Depinde de vector", "Depinde de pivot ales"], correct: "Nu, nu este stabil", explanation: "În timpul partiționării, elemente egale cu pivotul pot fi mutate relativ unul față de celălalt → ordinea relativă nu e garantată." },
  { prompt: "BFS garantează că găsește drumul cel mai scurt într-un graf neponderat?", options: ["Da, întotdeauna", "Nu, niciodată", "Numai în grafuri fără cicluri", "Numai dacă graful e conex"], correct: "Da, întotdeauna", explanation: "BFS explorează noduri nivel cu nivel → primul drum găsit spre orice nod are cel mai mic număr de muchii." },
  { prompt: "Care este complexitatea căutării binare?", options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"], correct: "O(log n)", explanation: "La fiecare pas, intervalul de căutare se înjumătățește → după log₂(n) pași, rămâne cel mult un element de verificat." },
  { prompt: "Căutarea liniară vs căutarea binară: care este avantajul căutării binare?", options: ["O(log n) față de O(n) — mult mai rapidă pe vectori mari", "Funcționează pe orice vector, sortat sau nu", "Nu necesită comparații", "Poate căuta mai multe valori simultan"], correct: "O(log n) față de O(n) — mult mai rapidă pe vectori mari", explanation: "Pe un vector de 1.000.000 elemente, căutarea liniară face până la 1.000.000 comparații, iar cea binară maxim 20." },
  { prompt: "Care este complexitatea Insertion Sort în cazul cel mai bun (vector deja sortat)?", options: ["O(n)", "O(n²)", "O(n log n)", "O(1)"], correct: "O(n)", explanation: "Pe un vector deja sortat, condiția while(a[j] > cheie) este mereu falsă → un singur parcurs de n-1 comparații → O(n)." },
  { prompt: "Care este avantajul Merge Sort față de Quick Sort?", options: ["Complexitate garantată O(n log n) în orice caz", "Folosește mai puțină memorie auxiliară", "Este mai rapid în cazul mediu", "Nu necesită nicio comparație"], correct: "Complexitate garantată O(n log n) în orice caz", explanation: "Merge Sort are complexitate O(n log n) garantată în toate cazurile. Quick Sort degenerează la O(n²) în cazul cel mai rău." },
  { prompt: "Merge Sort este un algoritm stabil?", options: ["Da, este stabil", "Nu, nu este stabil", "Depinde de implementare", "Numai pentru n par"], correct: "Da, este stabil", explanation: "La interclasare, când două elemente sunt egale, îl alegem pe cel din subvectorul stâng → ordinea relativă se păstrează." },
  { prompt: "Insertion Sort este eficient când:", options: ["Vectorul este mic sau aproape sortat", "Vectorul are milioane de elemente", "Vectorul este sortat descrescător", "Elementele sunt distribuite uniform"], correct: "Vectorul este mic sau aproape sortat", explanation: "Insertion Sort are cazul cel mai bun O(n) pe vectori aproape sortați și overhead mic față de Quick Sort pentru n mic." },
];

function generateQuestion() {
  quiz.answered = false;
  quiz.chosen   = null;
  quiz.correct  = false;

  if (customQuestions.value.length > 0 && Math.random() < 0.4) {
    const cq = customQuestions.value[Math.floor(Math.random() * customQuestions.value.length)];
    quiz.type = "text"; quiz.vizAlgo = ""; quiz.step = null; quiz.initialArray = [];
    quiz.prompt = cq.prompt; quiz.correctId = cq.correct; quiz.explanation = cq.explanation || "";
    quiz.options = cq.options.map(o => ({ id: o, label: o })).sort(() => Math.random() - 0.5);
    return;
  }

  if (Math.random() < 0.4) {
    const algo = VISUAL_QUIZ_ALGOS[Math.floor(Math.random() * VISUAL_QUIZ_ALGOS.length)];
    const wrongPool = VISUAL_QUIZ_ALGOS.filter(a => a !== algo).sort(() => Math.random() - 0.5).slice(0, 2);
    quiz.type = "visual"; quiz.vizAlgo = algo; quiz.correctId = algo;
    quiz.prompt = t('quiz_prompt_visual');
    quiz.explanation = VISUAL_EXPLANATIONS[algo];
    quiz.options = [algo, ...wrongPool].sort(() => Math.random() - 0.5).map(id => ({ id, label: prettyName(id) }));

    if (algo === "bfs") {
      const all = bfsSteps(DEFAULT_GRAPH, "A");
      const mid = all.filter(s => s.current !== null && (s.order?.length || 0) > 0 && (s.order?.length || 0) < 5);
      quiz.step = mid.length ? mid[Math.floor(Math.random() * mid.length)] : all[Math.floor(all.length / 2)];
      quiz.initialArray = [];
    } else if (algo === "binarySearch") {
      const raw = Array.from({ length: 6 + Math.floor(Math.random() * 3) }, () => 1 + Math.floor(Math.random() * 12));
      const vec = [...new Set(raw)].sort((a, b) => a - b);
      quiz.initialArray = [...vec];
      const target = vec[Math.floor(Math.random() * vec.length)];
      const all = binarySearchSteps(vec, target);
      const interesting = all.filter(s => s.mid !== null && s.mid !== undefined && !s.found);
      quiz.step = interesting.length ? interesting[Math.floor(Math.random() * interesting.length)] : all[1];
    } else if (algo === "selectionSort") {
      const vec = Array.from({ length: 5 + Math.floor(Math.random() * 3) }, () => 1 + Math.floor(Math.random() * 12));
      quiz.initialArray = [...vec];
      const all = selectionSortSteps(vec);
      const interesting = all.filter(s => s.minIdx !== undefined && s.sortedUpTo > 0 && s.sortedUpTo < vec.length - 1);
      quiz.step = interesting.length ? interesting[Math.floor(Math.random() * interesting.length)] : all[Math.floor(all.length / 2)];
    } else if (algo === "insertionSort") {
      const vec = Array.from({ length: 5 + Math.floor(Math.random() * 3) }, () => 1 + Math.floor(Math.random() * 12));
      quiz.initialArray = [...vec];
      const all = insertionSortSteps(vec);
      const interesting = all.filter(s => s.keyIdx !== undefined && s.sortedUpTo > 1);
      quiz.step = interesting.length ? interesting[Math.floor(Math.random() * interesting.length)] : all[Math.floor(all.length / 2)];
    } else if (algo === "mergeSort") {
      const vec = Array.from({ length: 6 + Math.floor(Math.random() * 2) }, () => 1 + Math.floor(Math.random() * 12));
      quiz.initialArray = [...vec];
      const all = mergeSortSteps(vec);
      const interesting = all.filter(s => s.mergeRange !== null && s.active?.length);
      quiz.step = interesting.length ? interesting[Math.floor(Math.random() * interesting.length)] : all[Math.floor(all.length / 2)];
    } else if (algo === "linearSearch") {
      const vec = Array.from({ length: 5 + Math.floor(Math.random() * 3) }, () => 1 + Math.floor(Math.random() * 12));
      quiz.initialArray = [...vec];
      const target = vec[Math.floor(Math.random() * vec.length)];
      const all = linearSearchSteps(vec, target);
      const interesting = all.filter(s => s.active?.length && !s.found);
      quiz.step = interesting.length ? interesting[Math.floor(Math.random() * interesting.length)] : all[1];
    } else {
      const vec = Array.from({ length: 5 + Math.floor(Math.random() * 3) }, () => 1 + Math.floor(Math.random() * 12));
      quiz.initialArray = [...vec];
      const all = algo === "bubbleSort" ? bubbleSortSteps(vec) : quickSortSteps(vec);
      const interesting = all.filter(s => s.active?.length || s.pivot !== undefined);
      quiz.step = interesting.length ? interesting[Math.floor(Math.random() * interesting.length)] : all[Math.floor(all.length / 2)];
    }
  } else {
    const q = TEXT_QUESTIONS[Math.floor(Math.random() * TEXT_QUESTIONS.length)];
    quiz.type = "text"; quiz.vizAlgo = ""; quiz.step = null; quiz.initialArray = [];
    quiz.prompt = q.prompt; quiz.correctId = q.correct; quiz.explanation = q.explanation;
    quiz.options = q.options.map(o => ({ id: o, label: o })).sort(() => Math.random() - 0.5);
  }
}

function answerQuiz(choice) {
  if (quiz.answered) return;
  quiz.answered = true;
  quiz.chosen   = choice;
  quiz.correct  = choice === quiz.correctId;
  quizSession.total++;
  if (quiz.correct) {
    quizSession.score++;
    quizSession.streak++;
    if (quizSession.streak > stats.quiz.bestStreak) stats.quiz.bestStreak = quizSession.streak;
  } else {
    quizSession.streak = 0;
  }
  stats.quiz.total++;
  if (quiz.correct) stats.quiz.correct++;
  stats.quiz.byType[quiz.type].total++;
  if (quiz.type === "visual") trackAlgorithm(quiz.vizAlgo, quiz.correct);
  if (quiz.correct) stats.quiz.byType[quiz.type].correct++;
  stats.quiz.recent.unshift({ correct: quiz.correct, prompt: quiz.prompt, id: stats.quiz.total });
  if (stats.quiz.recent.length > 15) stats.quiz.recent.pop();
  if (!quiz.correct) {
    stats.mistakes.unshift({ prompt: quiz.prompt, correctId: quiz.correctId });
    if (stats.mistakes.length > 8) stats.mistakes.pop();
  }
  saveStats();

  if (quiz.correct) {
    if (flameOutTimer) { clearTimeout(flameOutTimer); flameOutTimer = null; }
    flameActive.value = true;
    flameOut.value    = false;
    flameKey.value++;
  } else if (flameActive.value) {
    flameOut.value = true;
    flameOutTimer  = setTimeout(() => { flameActive.value = false; flameOut.value = false; flameOutTimer = null; }, 900);
  }
}

generateQuestion();
</script>
