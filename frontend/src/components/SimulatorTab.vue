<template>
  <section class="card">
    <div class="sim-controls">
      <div class="grade-filter-row">
        <span class="grade-filter-label">{{ t('label_class') }}</span>
        <div class="grade-filter">
          <button :class="{ active: filterGrade === null }" @click="setFilter(null)">{{ t('filter_all') }}</button>
          <button :class="{ active: filterGrade === 9 }"    @click="setFilter(9)">{{ t('filter_grade', { g: 9 }) }}</button>
          <button :class="{ active: filterGrade === 10 }"   @click="setFilter(10)">{{ t('filter_grade', { g: 10 }) }}</button>
          <button :class="{ active: filterGrade === 11 }"   @click="setFilter(11)">{{ t('filter_grade', { g: 11 }) }}</button>
          <button :class="{ active: filterGrade === 12 }"   @click="setFilter(12)">{{ t('filter_grade', { g: 12 }) }}</button>
        </div>
      </div>

      <div class="row">
        <label>{{ t('label_algorithm') }}</label>
        <div class="algo-select-row">
          <select v-model="sim.algorithm" @change="buildSimulation">
            <option v-for="algo in filteredAlgos" :key="algo.id" :value="algo.id">{{ algo.name }}</option>
          </select>
          <span class="grade-badge">{{ t('grade_badge', { g: currentAlgo.grade }) }}</span>
        </div>
      </div>

      <div v-if="sim.algorithm !== 'bfs' && sim.algorithm !== 'dfs'" class="row">
        <label>{{
          sim.algorithm === 'binarySearch' ? t('label_vector_sorted') :
          sim.algorithm === 'euclid'       ? t('label_euclid_ab') :
          sim.algorithm === 'isPrime'      ? t('label_prime_n') :
          sim.algorithm === 'sieve'        ? t('label_sieve_n') :
          t('label_vector')
        }}</label>
        <div class="input-with-btn">
          <input v-model="sim.vectorInput"
            :placeholder="sim.algorithm === 'binarySearch' ? 'ex: 1, 3, 5, 7, 9, 11, 14' :
                          sim.algorithm === 'euclid'       ? 'ex: 48, 18' :
                          sim.algorithm === 'isPrime'      ? 'ex: 97' :
                          sim.algorithm === 'sieve'        ? 'ex: 50' : 'ex: 8, 2, 6, 1, 4'"
            :type="['isPrime','sieve'].includes(sim.algorithm) ? 'number' : 'text'"
            :min="sim.algorithm === 'sieve' ? 5 : 2"
            :max="sim.algorithm === 'sieve' ? 100 : undefined" />
          <button class="btn-rand" @click="randomVector" :title="t('btn_random')">{{ t('btn_random') }}</button>
        </div>
      </div>
      <div v-if="sim.algorithm === 'binarySearch' || sim.algorithm === 'linearSearch'" class="row">
        <label>{{ t('label_target') }}</label>
        <input v-model="sim.targetInput" placeholder="ex: 7" style="max-width:120px" type="number" />
      </div>
      <div v-if="sim.algorithm === 'bfs' || sim.algorithm === 'dfs'">
        <div class="row">
          <label>{{ t('label_start_node') }}</label>
          <input v-model="sim.startNode" placeholder="A" maxlength="1" style="max-width:80px" />
        </div>
        <div class="row">
          <label>{{ t('label_graph') }}</label>
          <div class="preset-btns">
            <button
              v-for="(p, i) in GRAPH_PRESETS" :key="p.id"
              :class="{ active: sim.graphPreset === i }"
              @click="sim.graphPreset = i; buildSimulation()"
            >{{ p.name }}</button>
          </div>
        </div>
      </div>

      <div class="buttons">
        <button @click="buildSimulation" :disabled="loading">{{ t('btn_generate') }}</button>
        <button @click="prevStep" :disabled="!steps.length || index === 0 || predictMode">{{ t('btn_prev') }}</button>
        <button @click="nextStep" :disabled="!steps.length || index >= steps.length - 1 || predictMode">{{ t('btn_next') }}</button>
        <button @click="togglePlay" :disabled="!steps.length || predictMode">{{ playing ? t('btn_pause') : t('btn_play') }}</button>
        <button @click="resetSimulation" :disabled="!steps.length || index === 0">{{ t('btn_reset') }}</button>
        <button v-if="steps.length" class="btn-predict" :class="{ active: predictMode }" @click="togglePredict" :disabled="playing">{{ t('predict_toggle') }}</button>
      </div>
      <div class="speed-row">
        <span class="speed-label">{{ t('label_speed') }}</span>
        <div class="speed-btns">
          <button :class="{ active: playSpeed === 0.5 }" @click="playSpeed = 0.5">0.5×</button>
          <button :class="{ active: playSpeed === 1 }"   @click="playSpeed = 1">1×</button>
          <button :class="{ active: playSpeed === 1.5 }" @click="playSpeed = 1.5">1.5×</button>
          <button :class="{ active: playSpeed === 2 }"   @click="playSpeed = 2">2×</button>
        </div>
      </div>
    </div>

    <p v-if="loading" class="muted" style="margin-top:10px">{{ t('loading') }}</p>

    <div v-if="steps.length" class="viz-area">
      <div class="step-header">
        <span class="step-badge">{{ index + 1 }} / {{ steps.length }}</span>
        <span class="step-msg">{{ currentStep.message }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: ((index + 1) / steps.length * 100) + '%' }"></div>
      </div>
      <div v-if="predictMode" class="predict-banner" :class="predictResult ? ('predict-' + predictResult) : ''">
        <template v-if="!predictResult">{{ index < steps.length - 1 ? t('predict_instruction') : t('predict_last') }}</template>
        <template v-else>{{ predictResult === 'correct' ? t('predict_correct') : t('predict_wrong') }}</template>
      </div>

      <!-- Căutare Binară -->
      <div v-if="sim.algorithm === 'binarySearch'" class="bsearch-viz">
        <div class="bsearch-target">
          {{ t('search_for') }} <strong>{{ currentStep.target }}</strong>
          <span v-if="currentStep.found" class="bsearch-found-badge">{{ t('found_at', { pos: currentStep.mid + 1 }) }}</span>
        </div>
        <div class="bsearch-array">
          <div v-for="(val, i) in currentStep.array" :key="i" class="bsearch-cell">
            <div class="bsearch-box"
              :class="[bsearchBoxClass(i), changedIndices.has(i) ? 'bar-changed' : '',
                predictMode && !predictResult && index < steps.length - 1 ? 'predict-clickable' : '',
                predictMode && predictedIdx === i ? (predictResult === 'correct' ? 'predict-hit-ok' : predictResult === 'wrong' ? 'predict-hit-bad' : '') : '']"
              @click="predictClick(i)">{{ val }}</div>
            <div class="bsearch-markers">
              <span v-if="i === currentStep.left"  class="mk-st">st</span>
              <span v-if="i === currentStep.mid"   class="mk-mij">mij</span>
              <span v-if="i === currentStep.right" class="mk-dr">dr</span>
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

      <!-- Căutare Liniară -->
      <div v-else-if="sim.algorithm === 'linearSearch'" class="bsearch-viz">
        <div class="bsearch-target">
          {{ t('search_for') }} <strong>{{ currentStep.target }}</strong>
          <span v-if="currentStep.found" class="bsearch-found-badge">{{ t('found_at', { pos: currentStep.active?.[0] + 1 }) }}</span>
        </div>
        <div class="bsearch-array">
          <div v-for="(val, i) in currentStep.array" :key="i" class="bsearch-cell">
            <div class="bsearch-box"
              :class="[linearSearchBoxClass(i), changedIndices.has(i) ? 'bar-changed' : '',
                predictMode && !predictResult && index < steps.length - 1 ? 'predict-clickable' : '',
                predictMode && predictedIdx === i ? (predictResult === 'correct' ? 'predict-hit-ok' : predictResult === 'wrong' ? 'predict-hit-bad' : '') : '']"
              @click="predictClick(i)">{{ val }}</div>
            <div class="bsearch-idx">{{ i + 1 }}</div>
          </div>
        </div>
        <div class="bar-legend" style="margin-top:10px">
          <span class="legend-item"><span class="legend-dot" style="background:#f0c040"></span>{{ t('legend_active') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#4ade80"></span>{{ t('legend_found') }}</span>
        </div>
      </div>

      <!-- Algoritmul lui Euclid -->
      <div v-else-if="sim.algorithm === 'euclid'" class="euclid-viz">
        <div class="euclid-display">
          <div class="euclid-var"><span class="euclid-label">a</span><span class="euclid-val">{{ currentStep.euclidA }}</span></div>
          <div class="euclid-var"><span class="euclid-label">b</span><span class="euclid-val">{{ currentStep.euclidB }}</span></div>
          <div class="euclid-var" v-if="currentStep.euclidR !== null && currentStep.euclidR !== undefined">
            <span class="euclid-label">r = a mod b</span>
            <span class="euclid-val euclid-r">{{ currentStep.euclidR }}</span>
          </div>
        </div>
        <div class="euclid-result" v-if="currentStep.result !== undefined">
          CMMDC = <strong>{{ currentStep.result }}</strong>
        </div>
      </div>

      <!-- Verificare număr prim -->
      <div v-else-if="sim.algorithm === 'isPrime'" class="prime-viz">
        <div class="prime-number">{{ currentStep.primeN }}</div>
        <div class="prime-test" v-if="currentStep.primeD">
          <span class="prime-d">d = {{ currentStep.primeD }}</span>
          <span class="prime-mod">{{ currentStep.primeN }} mod {{ currentStep.primeD }} = {{ currentStep.primeN % currentStep.primeD }}</span>
        </div>
        <div class="prime-verdict"
          :class="currentStep.verdict === 'prime' ? 'verdict-prime' : currentStep.verdict === 'not_prime' ? 'verdict-not' : ''"
          v-if="currentStep.verdict">
          {{ currentStep.verdict === 'prime' ? t('prime_yes') : t('prime_no') }}
        </div>
      </div>

      <!-- Ciurul lui Eratostene -->
      <div v-else-if="sim.algorithm === 'sieve'" class="sieve-viz">
        <div class="sieve-grid">
          <div v-for="num in currentStep.sieveN - 1" :key="num"
               class="sieve-num" :class="sieveCellClass(num + 1)">{{ num + 1 }}</div>
        </div>
        <div class="bar-legend" style="margin-top:10px">
          <span class="legend-item"><span class="legend-dot" style="background:var(--accent)"></span>Prim</span>
          <span class="legend-item"><span class="legend-dot" style="background:#f0c040"></span>Prim curent</span>
          <span class="legend-item"><span class="legend-dot" style="background:#ef4444"></span>Marcat compus</span>
          <span class="legend-item"><span class="legend-dot" style="background:#1a2d40"></span>Compus</span>
        </div>
      </div>

      <!-- Bar chart sortare -->
      <div v-else-if="sim.algorithm !== 'bfs' && sim.algorithm !== 'dfs'" class="bars-container">
        <div class="bars">
          <div v-for="(val, i) in currentStep.array" :key="i" class="bar-wrap">
            <span class="bar-val">{{ val }}</span>
            <div class="bar" :style="barStyle(val, i)"
              :class="[changedIndices.has(i) ? 'bar-changed' : '',
                predictMode && !predictResult && index < steps.length - 1 ? 'predict-clickable' : '',
                predictMode && predictedIdx === i ? (predictResult === 'correct' ? 'predict-hit-ok' : predictResult === 'wrong' ? 'predict-hit-bad' : '') : '']"
              @click="predictClick(i)"></div>
            <span class="bar-idx">{{ i + 1 }}</span>
          </div>
        </div>
        <div v-if="sim.algorithm === 'selectionSort'" class="bar-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#c89000"></span>{{ t('legend_compared') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#22c55e"></span>{{ t('legend_min') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#1a4a2a"></span>{{ t('legend_sorted') }}</span>
        </div>
        <div v-else-if="sim.algorithm === 'insertionSort'" class="bar-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#f0c040"></span>{{ t('legend_key') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#c89000"></span>{{ t('legend_shifted') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#1a4a2a"></span>{{ t('legend_sorted') }}</span>
        </div>
        <div v-else-if="sim.algorithm === 'mergeSort'" class="bar-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#7c3aed"></span>{{ t('legend_merge_range') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#f0c040"></span>{{ t('legend_compared') }}</span>
        </div>
        <div v-else-if="sim.algorithm === 'heapSort'" class="bar-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#f0c040"></span>{{ t('legend_compared') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#1a4a2a"></span>{{ t('legend_sorted') }}</span>
        </div>
        <div v-else-if="sim.algorithm === 'countingSort'" class="bar-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#f0c040"></span>{{ t('legend_active') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#1a4a2a"></span>{{ t('legend_sorted') }}</span>
        </div>
        <div v-else class="bar-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#c89000"></span>{{ t('legend_compared') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#b03030"></span>{{ t('legend_pivot') }}</span>
        </div>
      </div>

      <!-- Graf SVG pentru BFS / DFS -->
      <div v-else class="bfs-viz">
        <svg viewBox="0 0 400 260" class="bfs-svg">
          <defs>
            <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill="#2a4a6a" />
            </marker>
          </defs>
          <line v-for="([a, b]) in BFS_EDGES" :key="a + b" v-bind="edgeLine(a, b)" stroke="#2a4a6a" stroke-width="2" marker-end="url(#arr)" />
          <g v-for="(pos, nodeId) in BFS_NODES" :key="nodeId"
             @click="predictClickNode(nodeId)"
             :style="predictMode && !predictResult && index < steps.length - 1 ? 'cursor:crosshair' : ''">
            <circle :cx="pos.x" :cy="pos.y" r="20" :fill="bfsNodeFill(nodeId)"
              :stroke="predictMode && predictedNode === nodeId && predictResult ? (predictResult === 'correct' ? '#22c55e' : '#ef4444') : bfsNodeStroke(nodeId)"
              :stroke-width="predictMode && predictedNode === nodeId && predictResult ? 4 : 2.5"
              class="bfs-node" />
            <text :x="pos.x" :y="pos.y + 5" text-anchor="middle" font-size="14" font-weight="bold" :fill="bfsNodeText(nodeId)">{{ nodeId }}</text>
          </g>
        </svg>
        <div class="bfs-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>{{ t('legend_cur') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#60a5fa"></span>{{ t('legend_queued') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#a78bfa"></span>{{ t('legend_inqueue') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#4ade80"></span>{{ t('legend_visited') }}</span>
          <span class="legend-item"><span class="legend-dot" style="background:#1a2d40"></span>{{ t('legend_unvisited') }}</span>
        </div>
        <div class="bfs-info">
          <p><strong>{{ t('bfs_visit_order') }}</strong> {{ (currentStep.order || []).join(' → ') || '—' }}</p>
          <p v-if="currentStep.queue?.length"><strong>{{ t('bfs_queue') }}</strong> [ {{ currentStep.queue.join(', ') }} ]</p>
          <p v-if="currentStep.stack?.length"><strong>{{ t('bfs_stack') }}</strong> [ {{ currentStep.stack.join(', ') }} ]</p>
        </div>
      </div>
      <!-- Arbore de recursivitate -->
      <RecursionTree
        v-if="(sim.algorithm === 'quickSort' || sim.algorithm === 'mergeSort') && currentStep.treeNodes?.length"
        :nodes="currentStep.treeNodes"
        :active-node-id="currentStep.activeNodeId ?? -1"
        :done-node-ids="currentStep.doneNodeIds ?? []"
        :array-len="currentStep.array?.length ?? 1"
        :algo="sim.algorithm"
      />
    </div>

    <!-- Despre algoritm -->
    <div class="about-toggle" @click="showAbout = !showAbout">
      <span>{{ t('about_algo', { name: currentAlgo.name }) }}</span>
      <span class="about-chevron">{{ showAbout ? '▲' : '▼' }}</span>
    </div>
    <div v-if="showAbout" class="about-card">
      <p class="about-info">{{ currentAlgo.info }}</p>
      <div class="about-body">
        <table class="about-table">
          <tr><td>{{ t('about_best') }}</td><td>{{ currentAlgo.complexity?.best }}</td></tr>
          <tr><td>{{ t('about_avg') }}</td><td>{{ currentAlgo.complexity?.avg }}</td></tr>
          <tr><td>{{ t('about_worst') }}</td><td>{{ currentAlgo.complexity?.worst }}</td></tr>
          <tr><td>{{ t('about_space') }}</td><td>{{ currentAlgo.complexity?.space }}</td></tr>
          <tr v-if="currentAlgo.stable !== null">
            <td>{{ t('about_stable') }}</td>
            <td :class="currentAlgo.stable ? 'ok' : 'bad'">{{ currentAlgo.stable ? t('about_yes') : t('about_no') }}</td>
          </tr>
        </table>
        <ComplexityChart :highlight="complexityHighlight" />
      </div>
      <p class="about-when"><strong>{{ t('about_when') }}</strong> {{ currentAlgo.when }}</p>
      <div v-if="currentAlgo.pros || currentAlgo.cons" class="about-pros-cons">
        <div v-if="currentAlgo.pros">
          <p class="about-list-title about-list-pro-title">{{ t('about_pros') }}</p>
          <ul class="about-list">
            <li v-for="item in currentAlgo.pros" :key="item" class="about-list-pro">{{ item }}</li>
          </ul>
        </div>
        <div v-if="currentAlgo.cons">
          <p class="about-list-title about-list-con-title">{{ t('about_cons') }}</p>
          <ul class="about-list">
            <li v-for="item in currentAlgo.cons" :key="item" class="about-list-con">{{ item }}</li>
          </ul>
        </div>
      </div>
      <div v-if="currentAlgo.note" class="about-note">
        <span class="about-note-icon">💡</span>{{ currentAlgo.note }}
      </div>
    </div>

    <!-- Pseudocod / Cod C++ -->
    <div class="pseudo">
      <div class="pseudo-tabs">
        <button :class="{ active: codeView === 'pseudo' }" @click="codeView = 'pseudo'">{{ t('tab_pseudo') }}</button>
        <button :class="{ active: codeView === 'cpp' }" @click="codeView = 'cpp'">{{ t('tab_cpp') }}</button>
      </div>
      <div v-if="codeView === 'pseudo'" class="pseudo-lines">
        <div v-for="(line, i) in activePseudoLines" :key="i" class="pseudo-line" :class="{ 'pseudo-line-active': i === activeLine }">{{ line }}</div>
      </div>
      <div v-else class="pseudo-lines">
        <div v-for="(line, i) in activeCppLines" :key="i" class="pseudo-line" :class="{ 'pseudo-line-active': activeCppHighlight.has(i) }">{{ line }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { ALGORITHMS, parseVector, buildSteps, GRAPH_PRESETS,
  heapSortSteps, countingSortSteps, euclidSteps, isPrimeSteps, sieveSteps } from "../algorithms.js";
import ComplexityChart from "./ComplexityChart.vue";
import RecursionTree  from "./RecursionTree.vue";
import { CPP_SNIPPETS, CPP_LINE_MAP } from "../cppSnippets.js";
import { useI18n } from "../i18n/index.js";
import { useStats } from "../composables/useStats.js";
import { useSimulatorState } from "../composables/useSimulatorState.js";

const { t } = useI18n();
const { stats } = useStats();
const { sim, pendingBuild } = useSimulatorState();

const steps      = ref([]);
const index      = ref(0);
const playing    = ref(false);
const loading    = ref(false);
const showAbout  = ref(false);
const codeView   = ref("pseudo");
const filterGrade = ref(null);
const playSpeed  = ref(1);
let timer        = null;

const predictMode   = ref(false);
const predictResult = ref(null);
const predictedIdx  = ref(null);
const predictedNode = ref(null);
let predictTimer    = null;

// Watch for preset loads from AdminTab
watch(pendingBuild, (val) => {
  if (val) { pendingBuild.value = false; buildSimulation(); }
});

const GRAPH_LAYOUTS = [
  { nodes: { A:{x:200,y:45},  B:{x:110,y:130}, C:{x:290,y:130}, D:{x:55,y:215},  E:{x:165,y:215}, F:{x:290,y:215} },
    edges: [["A","B"],["A","C"],["B","D"],["B","E"],["C","F"],["E","F"]] },
  { nodes: { A:{x:50,y:130},  B:{x:140,y:130}, C:{x:230,y:130}, D:{x:320,y:130}, E:{x:355,y:80} },
    edges: [["A","B"],["B","C"],["C","D"],["D","E"]] },
  { nodes: { A:{x:200,y:35},  B:{x:110,y:115}, C:{x:290,y:115}, D:{x:55,y:200},  E:{x:165,y:200}, F:{x:235,y:200}, G:{x:345,y:200} },
    edges: [["A","B"],["A","C"],["B","D"],["B","E"],["C","F"],["C","G"]] },
  { nodes: { A:{x:200,y:40},  B:{x:330,y:130}, C:{x:270,y:235}, D:{x:130,y:235}, E:{x:70,y:130} },
    edges: [["A","B"],["B","C"],["C","D"],["D","E"],["E","A"]] },
];

const BFS_NODES = computed(() => GRAPH_LAYOUTS[sim.graphPreset]?.nodes || GRAPH_LAYOUTS[0].nodes);
const BFS_EDGES = computed(() => GRAPH_LAYOUTS[sim.graphPreset]?.edges || GRAPH_LAYOUTS[0].edges);

function edgeLine(from, to) {
  const nodes = BFS_NODES.value;
  const f = nodes[from], t2 = nodes[to];
  if (!f || !t2) return {};
  const r = 24, dx = t2.x - f.x, dy = t2.y - f.y, len = Math.sqrt(dx*dx + dy*dy);
  const ux = dx/len, uy = dy/len;
  return { x1: f.x + ux*r, y1: f.y + uy*r, x2: t2.x - ux*r, y2: t2.y - uy*r };
}

function bfsNodeFill(id) {
  const s = currentStep.value;
  const pending = s.queue || s.stack || [];
  if (s.current === id) return "#f59e0b";
  if (s.next    === id) return "#60a5fa";
  if ((s.order  || []).includes(id)) return "#4ade80";
  if (pending.includes(id)) return "#a78bfa";
  return "#1a2d40";
}
function bfsNodeStroke(id) {
  const s = currentStep.value;
  const pending = s.queue || s.stack || [];
  if (s.current === id) return "#d97706";
  if (s.next    === id) return "#3b82f6";
  if ((s.order  || []).includes(id)) return "#22c55e";
  if (pending.includes(id)) return "#8b5cf6";
  return "#1e3550";
}
function bfsNodeText(id) {
  const s = currentStep.value;
  const pending = s.queue || s.stack || [];
  if (s.current === id || s.next === id) return "#0a0a0a";
  if ((s.order  || []).includes(id)) return "#052e10";
  if (pending.includes(id)) return "#1a0a40";
  return "#7ecff5";
}

const maxVal = computed(() => Math.max(...(steps.value[0]?.array || [1]), 1));
const minVal = computed(() => { const a = steps.value[0]?.array; return a?.length ? Math.min(...a) : 0; });
function barHeight(val) { return Math.max(Math.round((val / maxVal.value) * 160), 6); }

function sieveCellClass(num) {
  const s = currentStep.value;
  if (!s.primes) return "sieve-composite";
  if (num === s.markingVal)   return "sieve-marking";
  if (num === s.currentPrime) return "sieve-current";
  if (s.primes[num])          return "sieve-prime";
  return "sieve-composite";
}

function barStyle(val, idx) {
  const step = currentStep.value;
  const h = barHeight(val) + "px";
  const hue = () => Math.round(220 - ((val - minVal.value) / (maxVal.value - minVal.value || 1)) * 220);

  if (sim.algorithm === "heapSort") {
    const { active, heapSortedFrom } = step;
    if (heapSortedFrom !== undefined && idx >= heapSortedFrom) return { height: h, background: "#1a4a2a" };
    if (active?.includes(idx)) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    return { height: h, background: `hsl(${hue()}, 72%, 52%)` };
  }
  if (sim.algorithm === "countingSort") {
    const { active, sortedUpTo } = step;
    if (sortedUpTo !== undefined && idx < sortedUpTo) return { height: h, background: "#1a4a2a" };
    if (active?.includes(idx)) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    return { height: h, background: `hsl(${hue()}, 72%, 52%)` };
  }
  if (sim.algorithm === "selectionSort") {
    const { active, minIdx, sortedUpTo } = step;
    if (sortedUpTo !== undefined && idx < sortedUpTo) return { height: h, background: "#1a4a2a" };
    if (idx === minIdx)        return { height: h, background: "#4ade80", boxShadow: "0 0 16px #4ade8099" };
    if (active?.includes(idx)) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    return { height: h, background: `hsl(${hue()}, 72%, 52%)` };
  }
  if (sim.algorithm === "insertionSort") {
    const { active, keyIdx, sortedUpTo } = step;
    if (sortedUpTo !== undefined && idx < sortedUpTo && idx !== keyIdx) return { height: h, background: "#1a4a2a" };
    if (idx === keyIdx)        return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    if (active?.includes(idx)) return { height: h, background: "#c89000" };
    return { height: h, background: `hsl(${hue()}, 72%, 52%)` };
  }
  if (sim.algorithm === "mergeSort") {
    const { active, mergeRange } = step;
    if (active?.includes(idx)) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    if (mergeRange && idx >= mergeRange[0] && idx <= mergeRange[1]) return { height: h, background: "#5b21b6", opacity: "0.85" };
    return { height: h, background: `hsl(${hue()}, 72%, 52%)` };
  }
  // bubbleSort / quickSort
  const isPivot  = step.pivot === idx;
  const isActive = step.active?.includes(idx);
  if (isPivot)  return { height: h, background: "#e05555", boxShadow: "0 0 16px #e0555599, 0 0 4px #e05555" };
  if (isActive) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099, 0 0 4px #f0c040" };
  return { height: h, background: `hsl(${hue()}, 72%, 52%)` };
}

const changedIndices = ref(new Set());
let changeTimer = null;
watch(index, (newIdx, oldIdx) => {
  if (changeTimer) { clearTimeout(changeTimer); changeTimer = null; }
  const curr = steps.value[newIdx]?.array;
  const prev = steps.value[oldIdx]?.array;
  if (!curr || !prev || curr.length !== prev.length) { changedIndices.value = new Set(); return; }
  const changed = new Set();
  for (let i = 0; i < curr.length; i++) { if (curr[i] !== prev[i]) changed.add(i); }
  changedIndices.value = changed;
  changeTimer = setTimeout(() => { changedIndices.value = new Set(); changeTimer = null; }, 650);
});

function bsearchBoxClass(i) {
  const s = currentStep.value;
  if (!s.array) return "box-in";
  if (s.found && i === s.mid)  return "box-found";
  if (i === s.mid)             return "box-mid";
  if (s.left !== undefined && s.right !== undefined && (i < s.left || i > s.right)) return "box-out";
  return "box-in";
}
function linearSearchBoxClass(i) {
  const s = currentStep.value;
  if (!s.array) return "box-in";
  if (s.found && s.active?.includes(i)) return "box-found";
  if (s.active?.includes(i)) return "box-mid";
  return "box-in";
}

const currentStep  = computed(() => steps.value[index.value] || {});
const currentAlgo  = computed(() => ALGORITHMS[sim.algorithm] || {});
const filteredAlgos = computed(() =>
  Object.values(ALGORITHMS).filter(a => filterGrade.value === null || a.grade === filterGrade.value)
);
function setFilter(grade) {
  filterGrade.value = grade;
  const visible = filteredAlgos.value;
  if (visible.length && !visible.find(a => a.id === sim.algorithm)) {
    sim.algorithm = visible[0].id;
    buildSimulation();
  }
}

const COMPLEXITY_MAP = {
  "O(1)": "O1", "O(n)": "On", "O(log n)": "Ologn",
  "O(n log n)": "Onlogn", "O(n²)": "On2", "O(V+E)": "On",
};
const complexityHighlight = computed(() => {
  const avg = currentAlgo.value.complexity?.avg;
  return COMPLEXITY_MAP[avg] || null;
});

const activePseudoLines  = computed(() => ALGORITHMS[sim.algorithm]?.pseudocode || []);
const activeCppLines     = computed(() => (CPP_SNIPPETS[sim.algorithm] || "").split("\n"));
const activeLine         = computed(() => { const pl = currentStep.value.pseudoLine; return pl !== undefined ? pl : -1; });
const activeCppHighlight = computed(() => new Set(CPP_LINE_MAP[sim.algorithm]?.[activeLine.value] || []));

function getNextActiveIndices() {
  if (index.value >= steps.value.length - 1) return new Set();
  const next = steps.value[index.value + 1];
  if (!next) return new Set();
  const s = new Set();
  if (sim.algorithm === 'binarySearch') {
    if (next.mid != null) s.add(next.mid);
  } else if (sim.algorithm === 'linearSearch') {
    (next.active || []).forEach(x => s.add(x));
  } else {
    (next.active || []).forEach(x => s.add(x));
    if (next.pivot  != null) s.add(next.pivot);
    if (next.minIdx != null) s.add(next.minIdx);
    if (next.keyIdx != null) s.add(next.keyIdx);
  }
  return s;
}

function predictClick(i) {
  if (!predictMode.value || predictResult.value !== null) return;
  if (index.value >= steps.value.length - 1) return;
  predictedIdx.value  = i;
  predictResult.value = getNextActiveIndices().has(i) ? 'correct' : 'wrong';
  if (predictTimer) clearTimeout(predictTimer);
  predictTimer = setTimeout(() => {
    predictResult.value = null;
    predictedIdx.value  = null;
    nextStep();
  }, 900);
}

function predictClickNode(nodeId) {
  if (!predictMode.value || predictResult.value !== null) return;
  if (index.value >= steps.value.length - 1) return;
  predictedNode.value = nodeId;
  const next = steps.value[index.value + 1];
  predictResult.value = next?.current === nodeId ? 'correct' : 'wrong';
  if (predictTimer) clearTimeout(predictTimer);
  predictTimer = setTimeout(() => {
    predictResult.value = null;
    predictedNode.value = null;
    nextStep();
  }, 900);
}

function togglePredict() {
  predictMode.value = !predictMode.value;
  if (predictMode.value) stopPlay();
  predictResult.value = null;
  predictedIdx.value  = null;
  predictedNode.value = null;
}

function randomVector() {
  if (sim.algorithm === "euclid") {
    const a = Math.floor(Math.random() * 90) + 10;
    const b = Math.floor(Math.random() * 50) + 2;
    sim.vectorInput = `${a}, ${b}`;
    buildSimulation(); return;
  }
  if (sim.algorithm === "isPrime") {
    const pool = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,97,
                  4,6,9,10,15,21,25,35,49,51,77,91];
    sim.vectorInput = String(pool[Math.floor(Math.random() * pool.length)]);
    buildSimulation(); return;
  }
  if (sim.algorithm === "sieve") {
    sim.vectorInput = String(20 + Math.floor(Math.random() * 31));
    buildSimulation(); return;
  }
  const len = 6 + Math.floor(Math.random() * 4);
  if (sim.algorithm === "binarySearch") {
    const raw = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 20));
    const unique = [...new Set(raw)].sort((a, b) => a - b);
    sim.vectorInput = unique.join(", ");
    sim.targetInput = String(unique[Math.floor(Math.random() * unique.length)]);
  } else if (sim.algorithm === "linearSearch") {
    const vals = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 20));
    sim.vectorInput = vals.join(", ");
    sim.targetInput = String(vals[Math.floor(Math.random() * vals.length)]);
  } else {
    sim.vectorInput = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 20)).join(", ");
  }
  buildSimulation();
}

async function buildSimulation() {
  stopPlay();
  predictMode.value   = false;
  predictResult.value = null;
  predictedIdx.value  = null;
  predictedNode.value = null;
  if (predictTimer) { clearTimeout(predictTimer); predictTimer = null; }
  loading.value = true;
  await new Promise(r => setTimeout(r, 0));
  let payload;
  const isGraph = sim.algorithm === "bfs" || sim.algorithm === "dfs";
  if (isGraph) {
    const preset = GRAPH_PRESETS[sim.graphPreset] || GRAPH_PRESETS[0];
    payload = { graph: preset.graph, startNode: (sim.startNode || preset.startNode || "A").toUpperCase() };
  } else if (sim.algorithm === "binarySearch") {
    const vec = parseVector(sim.vectorInput).sort((a, b) => a - b);
    const t2  = Number(sim.targetInput);
    payload   = { vector: vec, target: Number.isFinite(t2) ? t2 : vec[Math.floor(vec.length / 2)] };
  } else if (sim.algorithm === "linearSearch") {
    const vec = parseVector(sim.vectorInput);
    const t2  = Number(sim.targetInput);
    payload   = { vector: vec, target: Number.isFinite(t2) ? t2 : vec[0] ?? 0 };
  } else if (sim.algorithm === "euclid") {
    const nums = parseVector(sim.vectorInput);
    payload = { a: nums[0] || 48, b: nums[1] || 18 };
  } else if (sim.algorithm === "isPrime") {
    payload = { n: parseVector(sim.vectorInput)[0] || 17 };
  } else if (sim.algorithm === "sieve") {
    payload = { n: parseVector(sim.vectorInput)[0] || 30 };
  } else {
    payload = { vector: parseVector(sim.vectorInput) };
  }
  steps.value = buildSteps(sim.algorithm, payload);
  index.value = 0;
  loading.value = false;
  stats.sim.runs++;
}

function prevStep() { if (index.value > 0) index.value--; }
function nextStep() {
  if (index.value < steps.value.length - 1) index.value++;
  else stopPlay();
}
function resetSimulation() { stopPlay(); index.value = 0; }
function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (index.value >= steps.value.length - 1) { stopPlay(); return; }
    index.value++;
  }, Math.round(1600 / playSpeed.value));
}
function togglePlay() {
  if (playing.value) { stopPlay(); return; }
  playing.value = true;
  startTimer();
}
function stopPlay() {
  playing.value = false;
  if (timer) { clearInterval(timer); timer = null; }
}
watch(playSpeed, () => { if (playing.value) startTimer(); });

onBeforeUnmount(() => { stopPlay(); if (predictTimer) clearTimeout(predictTimer); });

buildSimulation();
</script>
