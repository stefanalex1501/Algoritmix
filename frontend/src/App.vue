<template>
  <div class="app">
    <header class="hero">
      <h1>Algoritmix</h1>
      <p>Laborator Virtual de Structuri de Date și Algoritmi (BAC România)</p>
    </header>

    <nav class="tabs">
      <button :class="{ active: tab === 'sim' }" @click="tab = 'sim'">Simulator</button>
      <button :class="{ active: tab === 'quiz' }" @click="tab = 'quiz'">Quiz</button>
      <button :class="{ active: tab === 'stats' }" @click="tab = 'stats'">Statistici</button>
      <button :class="{ active: tab === 'content' }" @click="tab = 'content'">Conținut</button>
    </nav>

    <!-- ═══════════════ SIMULATOR ═══════════════ -->
    <section v-if="tab === 'sim'" class="card">

      <div class="sim-controls">
        <div class="grade-filter-row">
          <span class="grade-filter-label">Clasă:</span>
          <div class="grade-filter">
            <button :class="{ active: filterGrade === null }" @click="setFilter(null)">Toate</button>
            <button :class="{ active: filterGrade === 9 }"    @click="setFilter(9)">Cls. a 9-a</button>
            <button :class="{ active: filterGrade === 10 }"   @click="setFilter(10)">Cls. a 10-a</button>
            <button :class="{ active: filterGrade === 11 }"   @click="setFilter(11)">Cls. a 11-a</button>
            <button :class="{ active: filterGrade === 12 }"   @click="setFilter(12)">Cls. a 12-a</button>
          </div>
        </div>

        <div class="row">
          <label>Algoritm</label>
          <div class="algo-select-row">
            <select v-model="sim.algorithm" @change="buildSimulation">
              <option v-for="algo in filteredAlgos" :key="algo.id" :value="algo.id">
                {{ algo.name }}
              </option>
            </select>
            <span class="grade-badge">Clasa a {{ currentAlgo.grade }}-a</span>
          </div>
        </div>

        <div v-if="sim.algorithm !== 'bfs' && sim.algorithm !== 'dfs'" class="row">
          <label>Vector{{ sim.algorithm === 'binarySearch' ? ' (sortat automat)' : ' (separate prin virgulă)' }}</label>
          <div class="input-with-btn">
            <input v-model="sim.vectorInput" :placeholder="sim.algorithm === 'binarySearch' ? 'ex: 1, 3, 5, 7, 9, 11, 14' : 'ex: 8, 2, 6, 1, 4'" />
            <button class="btn-rand" @click="randomVector" title="Generează vector aleator">&#x21BA; Random</button>
          </div>
        </div>
        <div v-if="sim.algorithm === 'binarySearch'" class="row">
          <label>Valoare căutată</label>
          <input v-model="sim.targetInput" placeholder="ex: 7" style="max-width:120px" type="number" />
        </div>
        <div v-if="sim.algorithm === 'bfs' || sim.algorithm === 'dfs'">
          <div class="row">
            <label>Nod start</label>
            <input v-model="sim.startNode" placeholder="A" maxlength="1" style="max-width:80px" />
          </div>
          <div class="row">
            <label>Graf predefinit</label>
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
          <button @click="buildSimulation" :disabled="loading">Generează pașii</button>
          <button @click="prevStep" :disabled="!steps.length || index === 0">← Pas anterior</button>
          <button @click="nextStep" :disabled="!steps.length || index >= steps.length - 1">Pas următor →</button>
          <button @click="togglePlay" :disabled="!steps.length">{{ playing ? "⏸ Pauză" : "▶ Play" }}</button>
          <button @click="resetSimulation" :disabled="!steps.length || index === 0">⏮ Reset</button>
        </div>
        <div class="speed-row">
          <span class="speed-label">Viteză:</span>
          <div class="speed-btns">
            <button :class="{ active: playSpeed === 0.5 }" @click="playSpeed = 0.5">0.5×</button>
            <button :class="{ active: playSpeed === 1 }"   @click="playSpeed = 1">1×</button>
            <button :class="{ active: playSpeed === 1.5 }" @click="playSpeed = 1.5">1.5×</button>
            <button :class="{ active: playSpeed === 2 }"   @click="playSpeed = 2">2×</button>
          </div>
        </div>
      </div>

      <p v-if="loading" class="muted" style="margin-top:10px">Se rulează simularea...</p>

      <!-- Zona de vizualizare -->
      <div v-if="steps.length" class="viz-area">

        <!-- Header pas + progres -->
        <div class="step-header">
          <span class="step-badge">{{ index + 1 }} / {{ steps.length }}</span>
          <span class="step-msg">{{ currentStep.message }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: ((index + 1) / steps.length * 100) + '%' }"></div>
        </div>

        <!-- ── Căutare Binară ── -->
        <div v-if="sim.algorithm === 'binarySearch'" class="bsearch-viz">
          <div class="bsearch-target">
            Căutăm: <strong>{{ currentStep.target }}</strong>
            <span v-if="currentStep.found" class="bsearch-found-badge">✓ Găsit la poziția {{ currentStep.mid }}!</span>
          </div>
          <div class="bsearch-array">
            <div v-for="(val, i) in currentStep.array" :key="i" class="bsearch-cell">
              <div class="bsearch-box" :class="[bsearchBoxClass(i), changedIndices.has(i) ? 'bar-changed' : '']">{{ val }}</div>
              <div class="bsearch-markers">
                <span v-if="i === currentStep.left"  class="mk-st">st</span>
                <span v-if="i === currentStep.mid"   class="mk-mij">mij</span>
                <span v-if="i === currentStep.right" class="mk-dr">dr</span>
              </div>
              <div class="bsearch-idx">{{ i }}</div>
            </div>
          </div>
          <div class="bar-legend" style="margin-top:10px">
            <span class="legend-item"><span class="legend-dot" style="background:#f0c040"></span>Mijloc</span>
            <span class="legend-item"><span class="legend-dot" style="background:#4ade80"></span>Găsit</span>
            <span class="legend-item"><span class="legend-dot" style="background:#0d1a26; border:1px solid #1e3248"></span>Exclus</span>
          </div>
        </div>

        <!-- ── Bar chart pentru sortare ── -->
        <div v-else-if="sim.algorithm !== 'bfs' && sim.algorithm !== 'dfs'" class="bars-container">
          <div class="bars">
            <div v-for="(val, i) in currentStep.array" :key="i" class="bar-wrap">
              <span class="bar-val">{{ val }}</span>
              <div class="bar" :style="barStyle(val, i)" :class="{ 'bar-changed': changedIndices.has(i) }"></div>
              <span class="bar-idx">{{ i }}</span>
            </div>
          </div>
          <div v-if="sim.algorithm === 'selectionSort'" class="bar-legend">
            <span class="legend-item"><span class="legend-dot" style="background:#c89000"></span>Comparat</span>
            <span class="legend-item"><span class="legend-dot" style="background:#22c55e"></span>Minim curent</span>
            <span class="legend-item"><span class="legend-dot" style="background:#1a4a2a"></span>Sortat</span>
          </div>
          <div v-else class="bar-legend">
            <span class="legend-item"><span class="legend-dot" style="background:#c89000"></span>Comparat</span>
            <span class="legend-item"><span class="legend-dot" style="background:#b03030"></span>Pivot</span>
          </div>
        </div>

        <!-- ── Graf SVG pentru BFS / DFS ── -->
        <div v-else class="bfs-viz">
          <svg viewBox="0 0 400 260" class="bfs-svg">
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#2a4a6a" />
              </marker>
            </defs>
            <line
              v-for="([a, b]) in BFS_EDGES" :key="a + b"
              v-bind="edgeLine(a, b)"
              stroke="#2a4a6a" stroke-width="2" marker-end="url(#arr)"
            />
            <g v-for="(pos, nodeId) in BFS_NODES" :key="nodeId">
              <circle
                :cx="pos.x" :cy="pos.y" r="20"
                :fill="bfsNodeFill(nodeId)"
                :stroke="bfsNodeStroke(nodeId)"
                stroke-width="2.5"
                class="bfs-node"
              />
              <text
                :x="pos.x" :y="pos.y + 5"
                text-anchor="middle" font-size="14" font-weight="bold"
                :fill="bfsNodeText(nodeId)"
              >{{ nodeId }}</text>
            </g>
          </svg>

          <div class="bfs-legend">
            <span class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>Curent</span>
            <span class="legend-item"><span class="legend-dot" style="background:#60a5fa"></span>Adăugat</span>
            <span class="legend-item"><span class="legend-dot" style="background:#a78bfa"></span>În coadă</span>
            <span class="legend-item"><span class="legend-dot" style="background:#4ade80"></span>Vizitat</span>
            <span class="legend-item"><span class="legend-dot" style="background:#1a2d40"></span>Nevizitat</span>
          </div>

          <div class="bfs-info">
            <p><strong>Ordine vizitare:</strong> {{ (currentStep.order || []).join(' → ') || '—' }}</p>
            <p v-if="currentStep.queue?.length"><strong>Coadă:</strong> [ {{ currentStep.queue.join(', ') }} ]</p>
            <p v-if="currentStep.stack?.length"><strong>Stivă:</strong> [ {{ currentStep.stack.join(', ') }} ]</p>
          </div>
        </div>
      </div>

      <!-- ── Despre algoritm ── -->
      <div class="about-toggle" @click="showAbout = !showAbout">
        <span>Despre algoritm — {{ currentAlgo.name }}</span>
        <span class="about-chevron">{{ showAbout ? '▲' : '▼' }}</span>
      </div>
      <div v-if="showAbout" class="about-card">
        <p class="about-info">{{ currentAlgo.info }}</p>
        <table class="about-table">
          <tr><td>Cazul cel mai bun</td><td>{{ currentAlgo.complexity?.best }}</td></tr>
          <tr><td>Cazul mediu</td><td>{{ currentAlgo.complexity?.avg }}</td></tr>
          <tr><td>Cazul cel mai rău</td><td>{{ currentAlgo.complexity?.worst }}</td></tr>
          <tr><td>Memorie</td><td>{{ currentAlgo.complexity?.space }}</td></tr>
          <tr v-if="currentAlgo.stable !== null">
            <td>Stabil</td>
            <td :class="currentAlgo.stable ? 'ok' : 'bad'">{{ currentAlgo.stable ? 'Da' : 'Nu' }}</td>
          </tr>
        </table>
        <p class="about-when"><strong>Când se folosește:</strong> {{ currentAlgo.when }}</p>
      </div>

      <!-- ── Pseudocod / Cod C++ ── -->
      <div class="pseudo">
        <div class="pseudo-tabs">
          <button :class="{ active: codeView === 'pseudo' }" @click="codeView = 'pseudo'">Pseudocod</button>
          <button :class="{ active: codeView === 'cpp' }" @click="codeView = 'cpp'">Cod C++</button>
        </div>
        <div v-if="codeView === 'pseudo'" class="pseudo-lines">
          <div
            v-for="(line, i) in activePseudoLines"
            :key="i"
            class="pseudo-line"
            :class="{ 'pseudo-line-active': i === activeLine }"
          >{{ line }}</div>
        </div>
        <div v-else class="pseudo-lines">
          <div
            v-for="(line, i) in activeCppLines"
            :key="i"
            class="pseudo-line"
            :class="{ 'pseudo-line-active': activeCppHighlight.has(i) }"
          >{{ line }}</div>
        </div>
      </div>
    </section>

    <!-- ═══════════════ QUIZ ═══════════════ -->
    <section v-if="tab === 'quiz'" class="card">
      <div class="quiz-header">
        <div>
          <h2>Quiz</h2>
        </div>
        <div class="quiz-stats" v-if="quiz.total > 0">
          <span class="score-chip">{{ quiz.score }}/{{ quiz.total }}</span>
          <span class="streak-chip" v-if="flameActive || flameOut || quiz.streak >= 2">
            <span
              class="flame-icon"
              :class="flameOut ? 'flame-out' : (flameActive ? 'flame-burn' : '')"
              :key="flameKey"
            >🔥</span>
            <span v-if="quiz.streak >= 2">{{ quiz.streak }}×</span>
          </span>
        </div>
      </div>

      <p class="quiz-prompt">{{ quiz.prompt }}</p>

      <div v-if="quiz.type === 'visual' && quiz.step" class="quiz-viz-area">
        <!-- Sorting bar chart -->
        <div v-if="quiz.vizAlgo !== 'bfs'" class="bars-container">
          <div class="bars">
            <div v-for="(val, i) in quiz.step.array" :key="i" class="bar-wrap">
              <span class="bar-val">{{ val }}</span>
              <div class="bar" :style="quizBarStyle(val, i)"></div>
              <span class="bar-idx">{{ i }}</span>
            </div>
          </div>
          <div class="bar-legend">
            <span class="legend-item"><span class="legend-dot" style="background:#c89000"></span>Activ</span>
            <span class="legend-item"><span class="legend-dot" style="background:#b03030"></span>Pivot</span>
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
            <line
              v-for="([a, b]) in BFS_EDGES" :key="a + b"
              v-bind="edgeLine(a, b)"
              stroke="#2a4a6a" stroke-width="2" marker-end="url(#arr-q)"
            />
            <g v-for="(pos, nodeId) in BFS_NODES" :key="nodeId">
              <circle
                :cx="pos.x" :cy="pos.y" r="20"
                :fill="bfsNodeFill(nodeId, quiz.step)"
                :stroke="bfsNodeStroke(nodeId, quiz.step)"
                stroke-width="2.5"
              />
              <text
                :x="pos.x" :y="pos.y + 5"
                text-anchor="middle" font-size="14" font-weight="bold"
                :fill="bfsNodeText(nodeId, quiz.step)"
              >{{ nodeId }}</text>
            </g>
          </svg>
          <div class="bfs-legend">
            <span class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>Curent</span>
            <span class="legend-item"><span class="legend-dot" style="background:#4ade80"></span>Vizitat</span>
            <span class="legend-item"><span class="legend-dot" style="background:#a78bfa"></span>În coadă</span>
            <span class="legend-item"><span class="legend-dot" style="background:#60a5fa"></span>Adăugat</span>
          </div>
        </div>
      </div>

      <div class="quiz-options" :class="quiz.type === 'text' ? 'quiz-options-col' : ''">
        <button
          v-for="opt in quiz.options"
          :key="opt.id"
          class="quiz-option"
          :class="quizOptionClass(opt.id)"
          @click="answerQuiz(opt.id)"
          :disabled="quiz.answered"
        >{{ opt.label }}</button>
      </div>

      <div v-if="quiz.answered" class="quiz-result" :class="quiz.correct ? 'result-ok' : 'result-bad'">
        <strong>{{ quiz.correct ? 'Corect!' : 'Greșit!' }}</strong>
        {{ quiz.correct ? 'Răspuns corect.' : `Răspunsul corect era: ${prettyName(quiz.correctId)}.` }}
        <p class="quiz-explanation">{{ quiz.explanation }}</p>
      </div>

      <button class="quiz-next-btn" @click="generateQuestion">
        {{ quiz.answered ? 'Întrebare nouă →' : 'Sari →' }}
      </button>
    </section>

    <!-- ═══════════════ STATISTICI ═══════════════ -->
    <section v-if="tab === 'stats'" class="card">
      <div class="stats-header">
        <h2>Statistici sesiune</h2>
        <button class="btn-reset" @click="resetStats" v-if="stats.quiz.total > 0 || stats.sim.runs > 0">Resetează</button>
      </div>

      <!-- Summary cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-val">{{ stats.quiz.total }}</span>
          <span class="stat-lbl">Întrebări</span>
        </div>
        <div class="stat-card" :class="stats.quiz.total === 0 ? '' : accuracy >= 70 ? 'stat-good' : accuracy >= 40 ? 'stat-mid' : 'stat-low'">
          <span class="stat-val">{{ stats.quiz.total > 0 ? accuracy + '%' : '—' }}</span>
          <span class="stat-lbl">Acuratețe</span>
        </div>
        <div class="stat-card">
          <span class="stat-val">{{ stats.quiz.bestStreak > 0 ? stats.quiz.bestStreak : '—' }}</span>
          <span class="stat-lbl">Serie maximă</span>
        </div>
        <div class="stat-card">
          <span class="stat-val">{{ stats.sim.runs > 0 ? stats.sim.runs : '—' }}</span>
          <span class="stat-lbl">Simulări rulate</span>
        </div>
      </div>

      <template v-if="stats.quiz.total > 0">
        <h3 class="stats-section-title">Progresul sesiunii</h3>
        <div class="answer-strip">
          <div
            v-for="a in [...stats.quiz.recent].reverse()"
            :key="a.id"
            class="strip-cell"
            :class="a.correct ? 'strip-ok' : 'strip-bad'"
            :title="a.prompt"
          ></div>
        </div>
        <div class="strip-legend">
          <span><span class="strip-dot strip-ok"></span>Corecte: {{ stats.quiz.correct }}</span>
          <span><span class="strip-dot strip-bad"></span>Greșite: {{ stats.quiz.total - stats.quiz.correct }}</span>
        </div>
        <div class="stats-accuracy-row">
          <span class="stats-bar-label">Acuratețe</span>
          <div class="stats-bar-track">
            <div class="stats-bar-fill stats-bar-total" :style="{ width: accuracy + '%' }"></div>
          </div>
          <span class="stats-bar-num">{{ accuracy }}%</span>
        </div>
      </template>

      <template v-if="stats.mistakes.length > 0">
        <h3 class="stats-section-title">De reținut — ultimele greșeli</h3>
        <div class="mistakes-list">
          <div v-for="(m, i) in stats.mistakes" :key="i" class="mistake-item">
            <p class="mistake-q">{{ m.prompt }}</p>
            <p class="mistake-ans">Răspuns corect: <strong>{{ prettyName(m.correctId) }}</strong></p>
          </div>
        </div>
      </template>

      <template v-if="stats.quiz.recent.length > 0">
        <!-- Istoric recent -->
        <h3 class="stats-section-title">Ultimele răspunsuri</h3>
        <div class="recent-list">
          <div v-for="a in stats.quiz.recent" :key="a.id" class="recent-item">
            <span class="recent-dot" :class="a.correct ? 'dot-ok' : 'dot-bad'">{{ a.correct ? '✓' : '✗' }}</span>
            <span class="recent-text">{{ a.prompt }}</span>
          </div>
        </div>
      </template>

      <p v-if="stats.quiz.total === 0 && stats.sim.runs === 0" class="muted" style="margin-top:12px">
        Folosește Simulatorul și Quiz-ul pentru a vedea statistici ale sesiunii.
      </p>
    </section>

    <!-- ═══════════════ CONȚINUT ═══════════════ -->
    <section v-if="tab === 'content'" class="card">
      <h2>Gestionare Conținut</h2>
      <p class="muted">Adaugă întrebări personalizate în Quiz și seturi de exerciții pentru Simulator.</p>

      <!-- ── Întrebări Quiz ── -->
      <h3 class="cnt-title">Adaugă întrebare Quiz</h3>
      <div class="cnt-form">
        <div class="row">
          <label>Întrebarea *</label>
          <input v-model="newQ.prompt" placeholder="Ex: Care este complexitatea Bubble Sort în cazul cel mai rău?" />
        </div>
        <div class="cnt-opts">
          <div class="row"><label>Opțiune 1 *</label><input v-model="newQ.opt1" placeholder="Ex: O(n²)" /></div>
          <div class="row"><label>Opțiune 2 *</label><input v-model="newQ.opt2" placeholder="Ex: O(n log n)" /></div>
          <div class="row"><label>Opțiune 3</label><input v-model="newQ.opt3" placeholder="Opțional" /></div>
          <div class="row"><label>Opțiune 4</label><input v-model="newQ.opt4" placeholder="Opțional" /></div>
        </div>
        <div class="row">
          <label>Răspuns corect *</label>
          <select v-model="newQ.correct" :disabled="newQOptions.length < 2">
            <option value="">— completează opțiunile mai întâi —</option>
            <option v-for="o in newQOptions" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
        <div class="row">
          <label>Explicație (afișată după răspuns)</label>
          <input v-model="newQ.explanation" placeholder="Ex: Bubble Sort face n·(n-1)/2 comparații în cazul cel mai rău." />
        </div>
        <button @click="addCustomQuestion" :disabled="!newQValid">+ Adaugă întrebare</button>
      </div>

      <template v-if="customQuestions.length > 0">
        <h3 class="cnt-title">Întrebări personalizate ({{ customQuestions.length }})</h3>
        <ul class="cnt-list">
          <li v-for="q in customQuestions" :key="q.id" class="cnt-item">
            <div class="cnt-item-body">
              <p class="cnt-q">{{ q.prompt }}</p>
              <p class="cnt-ans">Corect: <strong>{{ q.correct }}</strong>
                <span v-if="q.explanation" class="cnt-expl"> · {{ q.explanation }}</span>
              </p>
            </div>
            <button class="danger" @click="deleteCustomQuestion(q.id)">Șterge</button>
          </li>
        </ul>
      </template>

      <hr class="cnt-divider" />

      <!-- ── Seturi Simulator ── -->
      <h3 class="cnt-title">Seturi de exerciții pentru Simulator</h3>
      <div class="cnt-form">
        <div class="row"><label>Titlu set *</label><input v-model="admin.title" placeholder="Ex: Sortare vector clasa a 9-a" /></div>
        <div class="row">
          <label>Algoritm</label>
          <select v-model="admin.algorithm">
            <option v-for="algo in Object.values(ALGORITHMS)" :key="algo.id" :value="algo.id">{{ algo.name }}</option>
          </select>
        </div>
        <div v-if="admin.algorithm !== 'bfs' && admin.algorithm !== 'dfs'" class="row">
          <label>Vector (separate prin virgulă)</label>
          <input v-model="admin.payload" placeholder="ex: 5, 1, 9, 3, 7" />
        </div>
        <div v-else class="row">
          <label>Nod start</label>
          <input v-model="admin.payload" placeholder="A" maxlength="1" style="max-width:80px" />
        </div>
        <button @click="saveCustomSet" :disabled="!admin.title.trim()">+ Salvează set</button>
      </div>

      <ul v-if="customSets.length > 0" class="cnt-list">
        <li v-for="set in customSets" :key="set.id" class="cnt-item">
          <span class="cnt-set-label">{{ set.title }} <span class="muted">— {{ prettyName(set.algorithm) }}</span></span>
          <div class="buttons">
            <button @click="loadCustomSet(set)">Încarcă în Simulator</button>
            <button class="danger" @click="deleteCustomSet(set.id)">Șterge</button>
          </div>
        </li>
      </ul>

      <p v-if="customQuestions.length === 0 && customSets.length === 0" class="muted" style="margin-top:12px">
        Niciun conținut personalizat adăugat încă.
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { ALGORITHMS, parseVector, buildSteps, DEFAULT_GRAPH, bubbleSortSteps, selectionSortSteps, quickSortSteps, binarySearchSteps, bfsSteps, dfsSteps, GRAPH_PRESETS } from "./algorithms";
import { CPP_SNIPPETS, CPP_LINE_MAP } from "./cppSnippets";

// ── State ──────────────────────────────────────────────
const tab = ref("sim");
const sim = reactive({ algorithm: "bubbleSort", vectorInput: "8, 2, 6, 1, 4", startNode: "A", targetInput: "7", graphPreset: 0 });

const steps = ref([]);
const index = ref(0);
const playing = ref(false);
const loading = ref(false);
let timer = null;

// ── Conținut personalizat ──────────────────────────────
const QUESTIONS_KEY = "algoritmix_custom_questions_v1";
const SETS_KEY      = "algoritmix_custom_sets_v1";

const customQuestions = ref([]);
const customSets      = ref([]);

const newQ = reactive({ prompt: "", opt1: "", opt2: "", opt3: "", opt4: "", correct: "", explanation: "" });
const admin = reactive({ title: "", algorithm: "bubbleSort", payload: "" });

const newQOptions = computed(() =>
  [newQ.opt1, newQ.opt2, newQ.opt3, newQ.opt4].filter(o => o.trim())
);
const newQValid = computed(() =>
  newQ.prompt.trim() && newQ.opt1.trim() && newQ.opt2.trim() && newQOptions.value.includes(newQ.correct)
);

function loadCustomContent() {
  try { const r = localStorage.getItem(QUESTIONS_KEY); if (r) customQuestions.value = JSON.parse(r); } catch {}
  try { const r = localStorage.getItem(SETS_KEY);      if (r) customSets.value      = JSON.parse(r); } catch {}
}

function saveQuestions() { localStorage.setItem(QUESTIONS_KEY, JSON.stringify(customQuestions.value)); }
function saveSets()      { localStorage.setItem(SETS_KEY,      JSON.stringify(customSets.value)); }

function addCustomQuestion() {
  if (!newQValid.value) return;
  customQuestions.value.unshift({
    id: crypto.randomUUID(),
    prompt:      newQ.prompt.trim(),
    options:     newQOptions.value,
    correct:     newQ.correct,
    explanation: newQ.explanation.trim(),
  });
  saveQuestions();
  Object.assign(newQ, { prompt: "", opt1: "", opt2: "", opt3: "", opt4: "", correct: "", explanation: "" });
}

function deleteCustomQuestion(id) {
  customQuestions.value = customQuestions.value.filter(q => q.id !== id);
  saveQuestions();
}

function saveCustomSet() {
  if (!admin.title.trim()) return;
  customSets.value.unshift({ id: crypto.randomUUID(), title: admin.title.trim(), algorithm: admin.algorithm, payload: admin.payload.trim() });
  saveSets();
  admin.title = ""; admin.payload = "";
}

function deleteCustomSet(id) {
  customSets.value = customSets.value.filter(s => s.id !== id);
  saveSets();
}

function loadCustomSet(set) {
  tab.value = "sim";
  sim.algorithm = set.algorithm;
  if (set.algorithm === "bfs" || set.algorithm === "dfs") { sim.startNode = set.payload || "A"; }
  else { sim.vectorInput = set.payload; }
  buildSimulation();
}

const quiz = reactive({
  type: "text",       // "text" | "visual"
  prompt: "",
  vizAlgo: "",        // algo to render (visual only)
  step: null,
  initialArray: [],
  options: [],        // [{ id, label }]
  correctId: "",      // id of correct option
  explanation: "",
  answered: false,
  chosen: null,
  correct: false,
  score: 0,
  total: 0,
  streak: 0,
});
const codeView   = ref("pseudo");
const filterGrade = ref(null);
const playSpeed   = ref(1);
const showAbout   = ref(false);
const flameActive = ref(false);
const flameOut    = ref(false);
const flameKey    = ref(0);
let flameOutTimer = null;

const stats = reactive({
  quiz: {
    total: 0, correct: 0, bestStreak: 0,
    byType: {
      visual: { total: 0, correct: 0 },
      text:   { total: 0, correct: 0 },
    },
    recent: [],
  },
  sim: { runs: 0 },
  mistakes: [],
});

const STATS_KEY = "algoritmix_stats_v1";

function saveStats() {
  localStorage.setItem(STATS_KEY, JSON.stringify({
    quiz:       stats.quiz,
    mistakes:   stats.mistakes,
    quizScore:  quiz.score,
    quizTotal:  quiz.total,
    quizStreak: quiz.streak,
  }));
}

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (!s?.quiz) return;
    Object.assign(stats.quiz, s.quiz);
    if (Array.isArray(s.mistakes)) stats.mistakes = s.mistakes;
    quiz.score  = s.quizScore  ?? 0;
    quiz.total  = s.quizTotal  ?? 0;
    quiz.streak = s.quizStreak ?? 0;
  } catch {}
}

// ── BFS/DFS graph layouts (SVG positions per preset) ───
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
  const f = nodes[from], t = nodes[to];
  if (!f || !t) return {};
  const r = 24, dx = t.x - f.x, dy = t.y - f.y, len = Math.sqrt(dx*dx + dy*dy);
  const ux = dx/len, uy = dy/len;
  return { x1: f.x + ux*r, y1: f.y + uy*r, x2: t.x - ux*r, y2: t.y - uy*r };
}

function bfsNodeFill(id, step) {
  const s = step || currentStep.value;
  const pending = s.queue || s.stack || [];
  if (s.current === id) return "#f59e0b";
  if (s.next    === id) return "#60a5fa";
  if ((s.order  || []).includes(id)) return "#4ade80";
  if (pending.includes(id)) return "#a78bfa";
  return "#1a2d40";
}
function bfsNodeStroke(id, step) {
  const s = step || currentStep.value;
  const pending = s.queue || s.stack || [];
  if (s.current === id) return "#d97706";
  if (s.next    === id) return "#3b82f6";
  if ((s.order  || []).includes(id)) return "#22c55e";
  if (pending.includes(id)) return "#8b5cf6";
  return "#1e3550";
}
function bfsNodeText(id, step) {
  const s = step || currentStep.value;
  const pending = s.queue || s.stack || [];
  if (s.current === id || s.next === id) return "#0a0a0a";
  if ((s.order  || []).includes(id)) return "#052e10";
  if (pending.includes(id)) return "#1a0a40";
  return "#7ecff5";
}

// ── Bar chart ──────────────────────────────────────────
const maxVal = computed(() => Math.max(...(steps.value[0]?.array || [1]), 1));
const minVal = computed(() => Math.min(...(steps.value[0]?.array || [0])));

function barHeight(val) { return Math.max(Math.round((val / maxVal.value) * 160), 6); }

function barStyle(val, idx) {
  const step = currentStep.value;
  const h = barHeight(val) + "px";

  if (sim.algorithm === "binarySearch") {
    const { left, right, mid, found } = step;
    if (found && mid === idx) return { height: h, background: "#4ade80", boxShadow: "0 0 16px #4ade8099" };
    if (mid === idx)          return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    if (left !== undefined && (idx < left || idx > right))
      return { height: h, background: "#0d1a26", boxShadow: "none", opacity: "0.3" };
    const hue = Math.round(220 - ((val - minVal.value) / (maxVal.value - minVal.value || 1)) * 220);
    return { height: h, background: `hsl(${hue}, 72%, 52%)`, boxShadow: "none" };
  }

  if (sim.algorithm === "selectionSort") {
    const { active, minIdx, sortedUpTo } = step;
    if (sortedUpTo !== undefined && idx < sortedUpTo) return { height: h, background: "#1a4a2a", boxShadow: "none" };
    if (idx === minIdx)        return { height: h, background: "#4ade80", boxShadow: "0 0 16px #4ade8099" };
    if (active?.includes(idx)) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    const hue = Math.round(220 - ((val - minVal.value) / (maxVal.value - minVal.value || 1)) * 220);
    return { height: h, background: `hsl(${hue}, 72%, 52%)`, boxShadow: "none" };
  }

  // bubbleSort / quickSort
  const isPivot  = step.pivot === idx;
  const isActive = step.active?.includes(idx);
  let bg, glow;
  if (isPivot) {
    bg = "#e05555"; glow = "0 0 16px #e0555599, 0 0 4px #e05555";
  } else if (isActive) {
    bg = "#f0c040"; glow = "0 0 16px #f0c04099, 0 0 4px #f0c040";
  } else {
    const hue = Math.round(220 - ((val - minVal.value) / (maxVal.value - minVal.value || 1)) * 220);
    bg = `hsl(${hue}, 72%, 52%)`; glow = "none";
  }
  return { height: h, background: bg, boxShadow: glow };
}

// ── Highlight schimbări față de pasul anterior ─────────
const changedIndices = ref(new Set());
let changeTimer = null;

watch(index, (newIdx, oldIdx) => {
  if (changeTimer) { clearTimeout(changeTimer); changeTimer = null; }
  const curr = steps.value[newIdx]?.array;
  const prev = steps.value[oldIdx]?.array;
  if (!curr || !prev || curr.length !== prev.length) { changedIndices.value = new Set(); return; }
  const changed = new Set();
  for (let i = 0; i < curr.length; i++) {
    if (curr[i] !== prev[i]) changed.add(i);
  }
  changedIndices.value = changed;
  changeTimer = setTimeout(() => { changedIndices.value = new Set(); changeTimer = null; }, 650);
});

// ── Binary search box helper ───────────────────────────
function bsearchBoxClass(i) {
  const s = currentStep.value;
  if (!s.array) return "box-in";
  if (s.found && i === s.mid)  return "box-found";
  if (i === s.mid)             return "box-mid";
  if (s.left !== undefined && s.right !== undefined && (i < s.left || i > s.right)) return "box-out";
  return "box-in";
}

// ── Computed ───────────────────────────────────────────
const currentStep   = computed(() => steps.value[index.value] || {});
const currentAlgo   = computed(() => ALGORITHMS[sim.algorithm] || {});
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

const accuracy = computed(() =>
  stats.quiz.total > 0 ? Math.round(stats.quiz.correct / stats.quiz.total * 100) : 0
);

const activePseudoLines = computed(() => ALGORITHMS[sim.algorithm]?.pseudocode || []);
const activeCppLines = computed(() => (CPP_SNIPPETS[sim.algorithm] || "").split("\n"));
const activeCppHighlight = computed(() => {
  const lines = CPP_LINE_MAP[sim.algorithm]?.[activeLine.value] || [];
  return new Set(lines);
});

const activeLine = computed(() => {
  const pl = currentStep.value.pseudoLine;
  return pl !== undefined ? pl : -1;
});

// ── Simulare ───────────────────────────────────────────
function randomVector() {
  const len = 6 + Math.floor(Math.random() * 4);
  if (sim.algorithm === "binarySearch") {
    const raw = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 20));
    const unique = [...new Set(raw)].sort((a, b) => a - b);
    sim.vectorInput = unique.join(", ");
    sim.targetInput = String(unique[Math.floor(Math.random() * unique.length)]);
  } else {
    const vals = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 20));
    sim.vectorInput = vals.join(", ");
  }
  buildSimulation();
}

function buildSimulation() {
  stopPlay();
  loading.value = true;
  const isGraph = sim.algorithm === "bfs" || sim.algorithm === "dfs";
  let payload;
  if (isGraph) {
    const preset = GRAPH_PRESETS[sim.graphPreset] || GRAPH_PRESETS[0];
    payload = { graph: preset.graph, startNode: (sim.startNode || preset.startNode || "A").toUpperCase() };
  } else if (sim.algorithm === "binarySearch") {
    const vec = parseVector(sim.vectorInput).sort((a, b) => a - b);
    const t   = Number(sim.targetInput);
    payload   = { vector: vec, target: Number.isFinite(t) ? t : vec[Math.floor(vec.length / 2)] };
  } else {
    payload = { vector: parseVector(sim.vectorInput) };
  }
  steps.value = buildSteps(sim.algorithm, payload);
  index.value = 0;
  loading.value = false;
  stats.sim.runs++;
}

// ── Navigare pași ──────────────────────────────────────
function prevStep() { if (index.value > 0) index.value--; }
function nextStep() {
  if (index.value < steps.value.length - 1) index.value++;
  else stopPlay();
}
function resetSimulation() { stopPlay(); index.value = 0; }
function togglePlay() {
  if (playing.value) { stopPlay(); return; }
  playing.value = true;
  const ms = Math.round(1600 / playSpeed.value);
  timer = setInterval(() => {
    if (index.value >= steps.value.length - 1) { stopPlay(); return; }
    index.value++;
  }, ms);
}
function stopPlay() {
  playing.value = false;
  if (timer) { clearInterval(timer); timer = null; }
}

// ── Quiz ───────────────────────────────────────────────
const ALGO_OPTIONS = [
  { id: "bubbleSort", label: "Bubble Sort" },
  { id: "quickSort",  label: "Quick Sort" },
  { id: "bfs",        label: "BFS (Graf)" },
];

const VISUAL_QUIZ_ALGOS = ["bubbleSort", "selectionSort", "quickSort", "binarySearch", "bfs"];

const VISUAL_EXPLANATIONS = {
  bubbleSort:    "Bubble Sort compară și interschimbă perechi de elemente vecine (galben). Nu există pivot — doar comparații adiacente repetate.",
  selectionSort: "Selection Sort caută minimul din restul vectorului (verde) prin comparații (galben) și îl plasează la stânga. Elementele sortate sunt cu verde închis.",
  quickSort:     "Quick Sort alege un element pivot (roșu) și plasează elementele mai mici la stânga, mai mari la dreapta — recursiv.",
  binarySearch:  "Căutarea Binară înjumătățește intervalul la fiecare pas. Bara galbenă = mijlocul curent. Barele estompate = excluse din căutare.",
  bfs:           "BFS parcurge graful nivel cu nivel cu o coadă FIFO. Nodul portocaliu este curent, cel albastru tocmai adăugat, cel verde vizitat.",
};

const TEXT_QUESTIONS = [
  // Complexitate
  {
    prompt: "Care este complexitatea Bubble Sort în cazul cel mai rău?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
    correct: "O(n²)",
    explanation: "Bubble Sort face n·(n−1)/2 comparații în cazul cel mai rău (vector sortat invers) → O(n²)."
  },
  {
    prompt: "Care este complexitatea medie a Quick Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correct: "O(n log n)",
    explanation: "În cazul mediu, Quick Sort produce partiții echilibrate: O(log n) niveluri × O(n) operații per nivel."
  },
  {
    prompt: "Care este complexitatea Quick Sort în cazul cel mai rău?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(n³)"],
    correct: "O(n²)",
    explanation: "Cazul cel mai rău apare când pivotul este mereu extrema vectorului (ex: vector sortat + pivot = ultimul element) → n niveluri dezechilibrate."
  },
  {
    prompt: "Care este complexitatea BFS pe un graf cu V noduri și E muchii?",
    options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V · E)"],
    correct: "O(V + E)",
    explanation: "BFS vizitează fiecare nod o singură dată (O(V)) și parcurge fiecare muchie o singură dată (O(E)) → total O(V + E)."
  },
  {
    prompt: "Bubble Sort pe un vector deja sortat face câte interschimbări (swap-uri)?",
    options: ["0", "n − 1", "n", "n²"],
    correct: "0",
    explanation: "Dacă vectorul e deja sortat, nicio pereche adiacentă nu necesită swap → 0 interschimbări, dar tot se fac O(n²) comparații."
  },
  {
    prompt: "Quick Sort pe un vector sortat crescător (cu pivot = ultimul element) are complexitatea:",
    options: ["O(n²) — cel mai rău caz", "O(n log n) — caz mediu", "O(n) — caz optim", "O(log n)"],
    correct: "O(n²) — cel mai rău caz",
    explanation: "Pivotul (ultimul element, cel mai mare) produce partițiile [n-1 elemente | 0 elemente] la fiecare nivel → n niveluri → O(n²)."
  },
  // Structuri de date
  {
    prompt: "Ce structură de date folosește BFS intern pentru a reține nodurile de vizitat?",
    options: ["Coadă (FIFO)", "Stivă (LIFO)", "Heap minim", "Arbore binar"],
    correct: "Coadă (FIFO)",
    explanation: "BFS adaugă noduri la coada și le extrage în ordine → FIFO garantează parcurgerea nivel cu nivel."
  },
  {
    prompt: "DFS (Depth-First Search) folosește ce structură de date, spre deosebire de BFS?",
    options: ["Stivă (LIFO)", "Coadă (FIFO)", "Heap maxim", "Coadă de priorități"],
    correct: "Stivă (LIFO)",
    explanation: "DFS merge în adâncime înainte de a explora vecinii — implementat cu stivă explicită sau prin recursivitate (stiva apelurilor)."
  },
  // Proprietăți algoritmi
  {
    prompt: "Care algoritm folosește strategia 'divide et impera'?",
    options: ["Quick Sort", "Bubble Sort", "BFS", "Selection Sort"],
    correct: "Quick Sort",
    explanation: "Quick Sort împarte vectorul față de pivot și rezolvă recursiv subproblemele — clasic 'divide et impera'."
  },
  {
    prompt: "Bubble Sort este un algoritm stabil? (elementele egale îsi păstrează ordinea relativă)",
    options: ["Da, este stabil", "Nu, nu este stabil", "Depinde de implementare", "Numai pentru n ≤ 10"],
    correct: "Da, este stabil",
    explanation: "Bubble Sort face swap doar când v[j] > v[j+1] (strict inegalitate), deci elementele egale nu se inversează → stabil."
  },
  {
    prompt: "Quick Sort standard (pivot = ultimul element) este un algoritm stabil?",
    options: ["Nu, nu este stabil", "Da, este stabil", "Depinde de vector", "Depinde de pivot ales"],
    correct: "Nu, nu este stabil",
    explanation: "În timpul partiționării, elemente egale cu pivotul pot fi mutate relativ unul față de celălalt → ordinea relativă nu e garantată."
  },
  {
    prompt: "BFS garantează că găsește drumul cel mai scurt într-un graf neponderat?",
    options: ["Da, întotdeauna", "Nu, niciodată", "Numai în grafuri fără cicluri", "Numai dacă graful e conex"],
    correct: "Da, întotdeauna",
    explanation: "BFS explorează noduri nivel cu nivel → primul drum găsit spre orice nod are cel mai mic număr de muchii."
  },
  {
    prompt: "Care este rolul variabilei 'pivot' în Quick Sort?",
    options: [
      "Elementul față de care se partiționează vectorul",
      "Indexul de mijloc al subvectorului",
      "Numărul de swap-uri efectuate",
      "Primul element comparat la fiecare pas"
    ],
    correct: "Elementul față de care se partiționează vectorul",
    explanation: "Pivotul separă vectorul: elementele ≤ pivot merg la stânga, > pivot la dreapta, iar la final pivotul e plasat pe poziția sa definitivă."
  },
  {
    prompt: "În Bubble Sort, după i treceri complete, câte elemente sunt garantat pe poziția lor finală?",
    options: ["i elemente (cele mai mari, la dreapta)", "i elemente (cele mai mici, la stânga)", "Toate elementele", "Niciun element"],
    correct: "i elemente (cele mai mari, la dreapta)",
    explanation: "La fiecare trecere, cel mai mare element rămas 'plutește' la capătul drept → după i treceri, ultimele i poziții sunt fixate."
  },
  {
    prompt: "Ce înseamnă că BFS parcurge graful 'nivel cu nivel'?",
    options: [
      "Vizitează toți vecinii direcți înainte de a trece mai departe",
      "Merge cât mai adânc pe o ramură înainte de a reveni",
      "Vizitează nodurile în ordine alfabetică",
      "Sortează nodurile după numărul de vecini"
    ],
    correct: "Vizitează toți vecinii direcți înainte de a trece mai departe",
    explanation: "Coada FIFO asigură că nodurile la distanța k sunt procesate complet înainte de orice nod la distanța k+1 de la sursa."
  },
  {
    prompt: "Care algoritm de sortare consumă memorie suplimentară O(1) (in-place)?",
    options: ["Bubble Sort și Quick Sort", "Merge Sort", "Numai Bubble Sort", "Numai Quick Sort"],
    correct: "Bubble Sort și Quick Sort",
    explanation: "Atât Bubble Sort cât și Quick Sort (varianta in-place) sortează direct în vector fără alocare suplimentară semnificativă — O(1) spațiu extra (ignorând stiva de recursivitate la Quick Sort)."
  },
  {
    prompt: "Cât spațiu extra (memorie) folosește BFS în cel mai rău caz?",
    options: ["O(V) — coada poate conține toate nodurile", "O(1)", "O(E)", "O(V²)"],
    correct: "O(V) — coada poate conține toate nodurile",
    explanation: "În cel mai rău caz (ex: un nod conectat la toți ceilalți), coada BFS poate reține simultan toate cele V noduri."
  },
  {
    prompt: "Care afirmație despre Quick Sort este corectă?",
    options: [
      "Pivotul ajunge pe poziția sa finală după partiționare",
      "Pivotul este mereu elementul din mijloc",
      "Quick Sort nu face niciun swap dacă vectorul e sortat",
      "Pivotul se schimbă la fiecare comparație"
    ],
    correct: "Pivotul ajunge pe poziția sa finală după partiționare",
    explanation: "După o etapă de partiționare, pivotul este plasat exact pe poziția pe care o va ocupa în vectorul sortat final — nu se mai mișcă."
  },
  {
    prompt: "Ce se întâmplă dacă aplicăm BFS pe un graf deconectat (cu mai multe componente conexe)?",
    options: [
      "Vizitează doar componenta care conține nodul de start",
      "Vizitează toate nodurile din graf",
      "Produce o eroare",
      "Revine automat la nodul de start"
    ],
    correct: "Vizitează doar componenta care conține nodul de start",
    explanation: "BFS pornește dintr-un singur nod și poate ajunge numai la nodurile accesibile din el. Nodurile din alte componente nu sunt vizitate."
  },
  {
    prompt: "Bubble Sort cu optimizarea 'oprire dacă nu s-a făcut niciun swap' are ce complexitate în cazul cel mai bun?",
    options: ["O(n) — vector deja sortat", "O(n²)", "O(n log n)", "O(1)"],
    correct: "O(n) — vector deja sortat",
    explanation: "Cu această optimizare, dacă prima trecere nu produce niciun swap, algoritmul se oprește → O(n) comparații pe un vector deja sortat."
  },
  // Selection Sort
  {
    prompt: "Care este complexitatea Selection Sort în orice caz (cel mai bun, mediu, cel mai rău)?",
    options: ["O(n²) — întotdeauna", "O(n) în cel mai bun caz", "O(n log n)", "O(n²) doar în cazul cel mai rău"],
    correct: "O(n²) — întotdeauna",
    explanation: "Selection Sort face mereu n·(n-1)/2 comparații indiferent de starea vectorului, deoarece nu are optimizare de oprire timpurie."
  },
  {
    prompt: "Câte interschimbări (swap-uri) face Selection Sort pentru a sorta un vector de n elemente?",
    options: ["Exact n-1 swap-uri", "n² swap-uri", "0 swap-uri dacă e sortat", "Variabil, depinde de date"],
    correct: "Exact n-1 swap-uri",
    explanation: "La fiecare din cele n-1 treceri, Selection Sort plasează un minim cu exact un swap → mereu n-1 swap-uri, indiferent de datele de intrare."
  },
  {
    prompt: "Selection Sort este un algoritm stabil?",
    options: ["Nu, nu este stabil", "Da, este stabil", "Depinde de implementare", "Numai pentru vectori mici"],
    correct: "Nu, nu este stabil",
    explanation: "Când se face swap-ul minimului cu elementul de pe poziția i, ordinea relativă a elementelor egale poate fi distrusă → instabil."
  },
  {
    prompt: "Care este avantajul principal al Selection Sort față de Bubble Sort?",
    options: [
      "Face mai puține swap-uri (exact n-1)",
      "Are complexitate mai bună",
      "Este algoritm stabil",
      "Funcționează mai bine pe vectori sortați"
    ],
    correct: "Face mai puține swap-uri (exact n-1)",
    explanation: "Selection Sort minimizează numărul de scrieri în memorie — util când operațiile de scriere sunt costisitoare. Complexitatea rămâne O(n²)."
  },
  // DFS
  {
    prompt: "Ce structură de date folosește DFS intern (varianta iterativă)?",
    options: ["Stivă (LIFO)", "Coadă (FIFO)", "Heap minim", "Arbore echilibrat"],
    correct: "Stivă (LIFO)",
    explanation: "DFS iterativ folosește o stivă: procesează ultimul nod adăugat primul → merge în adâncime înainte de a explora vecinii."
  },
  {
    prompt: "DFS garantează că găsește drumul cel mai scurt într-un graf neponderat?",
    options: ["Nu, nu garantează", "Da, întotdeauna", "Numai în grafuri fără cicluri", "Numai în grafuri orientate"],
    correct: "Nu, nu garantează",
    explanation: "DFS urmează o singură ramură până la capăt — drumul găsit poate fi mai lung decât cel optim. BFS garantează drumul minim."
  },
  {
    prompt: "Care este principala diferență dintre DFS și BFS?",
    options: [
      "DFS merge în adâncime (stivă), BFS pe lățime (coadă)",
      "DFS e mai rapid decât BFS",
      "BFS funcționează doar pe grafuri orientate",
      "DFS nu poate detecta cicluri"
    ],
    correct: "DFS merge în adâncime (stivă), BFS pe lățime (coadă)",
    explanation: "DFS explorează complet o ramură înainte de a reveni. BFS explorează toți vecinii la distanța k înainte de distanța k+1."
  },
  {
    prompt: "DFS poate fi folosit pentru a detecta cicluri într-un graf?",
    options: ["Da, prin urmărirea nodurilor în curs de procesare", "Nu, doar BFS poate face asta", "Numai în grafuri neorientate", "Numai în grafuri ponderate"],
    correct: "Da, prin urmărirea nodurilor în curs de procesare",
    explanation: "Dacă în DFS ajungem la un nod deja marcat ca 'în curs de vizitare' (nu doar vizitat), am detectat un ciclu."
  },
  // Căutare Binară
  {
    prompt: "Ce condiție trebuie să îndeplinească vectorul pentru a putea aplica căutarea binară?",
    options: ["Să fie sortat", "Să aibă lungime pară", "Să nu conțină duplicate", "Să fie de tip întreg"],
    correct: "Să fie sortat",
    explanation: "Căutarea binară se bazează pe compararea cu mijlocul și eliminarea unei jumătăți — aceasta funcționează corect numai pe un vector sortat."
  },
  {
    prompt: "Care este complexitatea căutării binare?",
    options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
    correct: "O(log n)",
    explanation: "La fiecare pas, intervalul de căutare se înjumătățește → după log₂(n) pași, rămâne cel mult un element de verificat."
  },
  {
    prompt: "Câte elemente sunt eliminate din căutare la fiecare pas al căutării binare?",
    options: ["Jumătate din intervalul curent", "Un singur element", "Un sfert din vector", "Depinde de valoarea căutată"],
    correct: "Jumătate din intervalul curent",
    explanation: "Comparând cu mijlocul, eliminăm fie jumătatea stângă, fie cea dreaptă → intervalul se reduce la jumătate la fiecare iterație."
  },
  {
    prompt: "Căutarea liniară vs căutarea binară: care este avantajul căutării binare?",
    options: [
      "O(log n) față de O(n) — mult mai rapidă pe vectori mari",
      "Funcționează pe orice vector, sortat sau nu",
      "Nu necesită comparații",
      "Poate căuta mai multe valori simultan"
    ],
    correct: "O(log n) față de O(n) — mult mai rapidă pe vectori mari",
    explanation: "Pe un vector de 1.000.000 elemente, căutarea liniară face până la 1.000.000 comparații, iar cea binară maxim 20 (log₂(1.000.000) ≈ 20)."
  },
];

const quizMaxVal = computed(() => Math.max(...(quiz.initialArray.length ? quiz.initialArray : [1])));
const quizMinVal = computed(() => Math.min(...(quiz.initialArray.length ? quiz.initialArray : [0])));

function quizBarStyle(val, idx) {
  const s = quiz.step || {};
  const algo = quiz.vizAlgo;
  const h = Math.max(Math.round((val / quizMaxVal.value) * 160), 6) + "px";
  const gradHue = Math.round(220 - ((val - quizMinVal.value) / (quizMaxVal.value - quizMinVal.value || 1)) * 220);

  if (algo === "binarySearch") {
    const { left, right, mid, found } = s;
    if (found && mid === idx) return { height: h, background: "#4ade80", boxShadow: "0 0 16px #4ade8099" };
    if (mid === idx)          return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    if (left !== undefined && (idx < left || idx > right))
      return { height: h, background: "#0d1a26", boxShadow: "none", opacity: "0.3" };
    return { height: h, background: `hsl(${gradHue}, 72%, 52%)`, boxShadow: "none" };
  }

  if (algo === "selectionSort") {
    const { active, minIdx, sortedUpTo } = s;
    if (sortedUpTo !== undefined && idx < sortedUpTo) return { height: h, background: "#1a4a2a", boxShadow: "none" };
    if (idx === minIdx)        return { height: h, background: "#4ade80", boxShadow: "0 0 16px #4ade8099" };
    if (active?.includes(idx)) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
    return { height: h, background: `hsl(${gradHue}, 72%, 52%)`, boxShadow: "none" };
  }

  // bubbleSort / quickSort
  const isPivot  = s.pivot === idx;
  const isActive = s.active?.includes(idx);
  if (isPivot)  return { height: h, background: "#e05555", boxShadow: "0 0 16px #e0555599" };
  if (isActive) return { height: h, background: "#f0c040", boxShadow: "0 0 16px #f0c04099" };
  return { height: h, background: `hsl(${gradHue}, 72%, 52%)`, boxShadow: "none" };
}

function quizOptionClass(id) {
  if (!quiz.answered) return "";
  if (id === quiz.correctId) return "opt-correct";
  if (id === quiz.chosen)    return "opt-wrong";
  return "opt-dim";
}

function generateQuestion() {
  quiz.answered = false;
  quiz.chosen   = null;
  quiz.correct  = false;

  // Dacă există întrebări personalizate, 40% șanse să fie aleasă una
  if (customQuestions.value.length > 0 && Math.random() < 0.4) {
    const cq = customQuestions.value[Math.floor(Math.random() * customQuestions.value.length)];
    quiz.type        = "text";
    quiz.vizAlgo     = "";
    quiz.step        = null;
    quiz.initialArray = [];
    quiz.prompt      = cq.prompt;
    quiz.correctId   = cq.correct;
    quiz.explanation = cq.explanation || "";
    quiz.options     = cq.options.map(o => ({ id: o, label: o })).sort(() => Math.random() - 0.5);
    return;
  }

  // 40% vizual, 60% text
  if (Math.random() < 0.4) {
    const algo = VISUAL_QUIZ_ALGOS[Math.floor(Math.random() * VISUAL_QUIZ_ALGOS.length)];
    const wrongPool = VISUAL_QUIZ_ALGOS.filter(a => a !== algo).sort(() => Math.random() - 0.5).slice(0, 2);
    quiz.type        = "visual";
    quiz.vizAlgo     = algo;
    quiz.correctId   = algo;
    quiz.prompt      = "Ce algoritm este reprezentat în vizualizarea de mai jos?";
    quiz.explanation = VISUAL_EXPLANATIONS[algo];
    quiz.options     = [algo, ...wrongPool].sort(() => Math.random() - 0.5).map(id => ({ id, label: prettyName(id) }));

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
    } else {
      const vec = Array.from({ length: 5 + Math.floor(Math.random() * 3) }, () => 1 + Math.floor(Math.random() * 12));
      quiz.initialArray = [...vec];
      const all = algo === "bubbleSort" ? bubbleSortSteps(vec) : quickSortSteps(vec);
      const interesting = all.filter(s => s.active?.length || s.pivot !== undefined);
      quiz.step = interesting.length ? interesting[Math.floor(Math.random() * interesting.length)] : all[Math.floor(all.length / 2)];
    }
  } else {
    const q = TEXT_QUESTIONS[Math.floor(Math.random() * TEXT_QUESTIONS.length)];
    quiz.type        = "text";
    quiz.vizAlgo     = "";
    quiz.step        = null;
    quiz.initialArray = [];
    quiz.prompt      = q.prompt;
    quiz.correctId   = q.correct;
    quiz.explanation = q.explanation;
    quiz.options     = q.options.map(o => ({ id: o, label: o })).sort(() => Math.random() - 0.5);
  }
}

function answerQuiz(choice) {
  if (quiz.answered) return;
  quiz.answered = true;
  quiz.chosen   = choice;
  quiz.correct  = choice === quiz.correctId;
  quiz.total++;
  if (quiz.correct) {
    quiz.score++;
    quiz.streak++;
    if (quiz.streak > stats.quiz.bestStreak) stats.quiz.bestStreak = quiz.streak;
  } else {
    quiz.streak = 0;
  }
  stats.quiz.total++;
  if (quiz.correct) stats.quiz.correct++;
  stats.quiz.byType[quiz.type].total++;
  if (quiz.correct) stats.quiz.byType[quiz.type].correct++;
  stats.quiz.recent.unshift({ correct: quiz.correct, prompt: quiz.prompt, id: stats.quiz.total });
  if (stats.quiz.recent.length > 15) stats.quiz.recent.pop();
  if (!quiz.correct) {
    stats.mistakes.unshift({ prompt: quiz.prompt, correctId: quiz.correctId });
    if (stats.mistakes.length > 8) stats.mistakes.pop();
  }
  saveStats();

  // ── Flacără ──
  if (quiz.correct) {
    if (flameOutTimer) { clearTimeout(flameOutTimer); flameOutTimer = null; }
    flameActive.value = true;
    flameOut.value    = false;
    flameKey.value++;
  } else if (flameActive.value) {
    flameOut.value = true;
    flameOutTimer  = setTimeout(() => {
      flameActive.value = false;
      flameOut.value    = false;
      flameOutTimer     = null;
    }, 900);
  }
}

function resetStats() {
  stats.quiz.total = 0; stats.quiz.correct = 0; stats.quiz.bestStreak = 0;
  stats.quiz.byType.visual = { total: 0, correct: 0 };
  stats.quiz.byType.text   = { total: 0, correct: 0 };
  stats.quiz.recent = [];
  stats.sim.runs = 0;
  stats.mistakes = [];
  quiz.score = 0; quiz.total = 0; quiz.streak = 0;
  localStorage.removeItem(STATS_KEY);
  flameActive.value = false;
  flameOut.value    = false;
  flameKey.value    = 0;
  if (flameOutTimer) { clearTimeout(flameOutTimer); flameOutTimer = null; }
}

function prettyName(id) { return ALGORITHMS[id]?.name || id; }

onMounted(() => { loadStats(); loadCustomContent(); buildSimulation(); generateQuestion(); });
onBeforeUnmount(() => stopPlay());
</script>

<style>
:root {
  font-family: "Trebuchet MS", "Segoe UI", sans-serif;
  color: #cfe1f0;
  --bg:        #0d1520;
  --bg-card:   #131f2e;
  --bg-input:  #0f1a27;
  --bg-result: #0a1621;
  --border:    #1e3248;
  --accent:    #1a8fd1;
  --accent-hi: #2aa8f0;
  --text:      #cfe1f0;
  --text-muted:#6a8faa;
  --text-label:#8fb3cc;
}

* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); }

.app { max-width: 980px; margin: 0 auto; padding: 24px; }
.hero h1 { margin-bottom: 4px; color: var(--accent-hi); font-size: 2rem; letter-spacing: 0.5px; }
.hero p  { margin-top: 0; color: var(--text-muted); }

/* ── Tabs ── */
.tabs { display: flex; gap: 8px; margin: 14px 0; flex-wrap: wrap; }
.tabs button { background: var(--bg-card); color: var(--text); border: 1px solid var(--border); padding: 9px 16px; border-radius: 10px; cursor: pointer; font-size: 14px; transition: background .15s, border-color .15s; }
.tabs button:hover { background: #1a2d42; border-color: var(--accent); }
.tabs .active { background: var(--accent); color: #fff; border-color: var(--accent); }

/* ── Card ── */
.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 20px; box-shadow: 0 4px 24px rgba(0,0,0,.4); }
.card h2 { margin: 0 0 16px; color: var(--accent-hi); font-size: 1.2rem; }

/* ── Form ── */
.row { display: grid; gap: 6px; margin-bottom: 14px; }
label { font-size: 13px; color: var(--text-label); }
input, select { padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text); font-size: 14px; outline: none; }
input:focus, select:focus { border-color: var(--accent); }
select option { background: var(--bg-card); }
.sim-controls { margin-bottom: 4px; }
.grade-filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.grade-filter-label { font-size: 13px; color: var(--text-label); white-space: nowrap; }
.grade-filter { display: flex; gap: 6px; flex-wrap: wrap; }
.grade-filter button { background: var(--bg-input); color: var(--text-muted); border: 1px solid var(--border); padding: 5px 11px; border-radius: 20px; font-size: 12px; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
.grade-filter button:hover { border-color: var(--accent); color: var(--text); }
.grade-filter button.active { background: var(--accent); color: #fff; border-color: var(--accent); }
.algo-select-row { display: flex; align-items: center; gap: 10px; }
.algo-select-row select { flex: 1; }
.grade-badge { background: #0a1e30; border: 1px solid var(--accent); color: var(--accent-hi); padding: 4px 12px; border-radius: 20px; font-size: 12px; white-space: nowrap; font-weight: 600; flex-shrink: 0; }
.input-with-btn { display: flex; gap: 8px; align-items: center; }
.input-with-btn input { flex: 1; }
.btn-rand { background: #0f2a3a; border: 1px solid var(--border); color: var(--text-muted); padding: 9px 12px; font-size: 13px; white-space: nowrap; flex-shrink: 0; }
.btn-rand:hover { background: #1a3a50; border-color: var(--accent); color: var(--text); }

/* ── Speed + Graph presets ── */
.speed-row { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
.speed-label { font-size: 13px; color: var(--text-label); white-space: nowrap; }
.speed-btns, .preset-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.speed-btns button, .preset-btns button { background: var(--bg-input); color: var(--text-muted); border: 1px solid var(--border); padding: 5px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
.speed-btns button:hover, .preset-btns button:hover { border-color: var(--accent); color: var(--text); }
.speed-btns button.active, .preset-btns button.active { background: var(--accent); color: #fff; border-color: var(--accent); }

/* ── Căutare Binară ── */
.bsearch-viz { display: flex; flex-direction: column; gap: 12px; }
.bsearch-target { font-size: 15px; color: var(--text); font-weight: 500; }
.bsearch-found-badge { margin-left: 12px; background: #0a2a14; border: 1px solid #22c55e; color: #4ade80; padding: 3px 10px; border-radius: 20px; font-size: 13px; }
.bsearch-array { display: flex; gap: 6px; flex-wrap: wrap; overflow-x: auto; padding-bottom: 4px; }
.bsearch-cell { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.bsearch-box { width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 15px; font-weight: 700; border: 2px solid transparent; transition: background .3s, border-color .3s; }
.box-in    { background: #0d2035; border-color: var(--accent); color: var(--text); }
.box-mid   { background: #3a2a00; border-color: #f0c040; color: #f0c040; box-shadow: 0 0 12px #f0c04055; }
.box-found { background: #0a2a14; border-color: #4ade80; color: #4ade80; box-shadow: 0 0 12px #4ade8055; }
.box-out   { background: #0a1018; border-color: #1e3248; color: #2a4060; opacity: 0.5; }
.bsearch-markers { height: 18px; display: flex; gap: 3px; justify-content: center; }
.mk-st  { font-size: 10px; color: #60a5fa; font-weight: 700; }
.mk-mij { font-size: 10px; color: #f0c040; font-weight: 700; }
.mk-dr  { font-size: 10px; color: #f87171; font-weight: 700; }
.bsearch-idx { font-size: 10px; color: #3a5570; }

/* ── Despre algoritm ── */
.about-toggle { display: flex; justify-content: space-between; align-items: center; margin: 14px 0 0; padding: 10px 14px; background: #0a1825; border: 1px solid var(--border); border-radius: 10px; cursor: pointer; font-size: 14px; color: var(--text-muted); transition: background .15s, border-color .15s; user-select: none; }
.about-toggle:hover { background: #0f2030; border-color: var(--accent); color: var(--text); }
.about-chevron { font-size: 11px; }
.about-card { margin-top: 6px; padding: 14px 16px; background: var(--bg-result); border: 1px solid var(--border); border-radius: 10px; }
.about-info { margin: 0 0 12px; font-size: 14px; color: var(--text); line-height: 1.6; }
.about-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 10px; }
.about-table td { padding: 5px 10px; border-bottom: 1px solid #0e2035; color: var(--text-muted); }
.about-table td:first-child { color: var(--text-label); width: 140px; }
.about-table td:last-child { font-family: monospace; color: var(--accent-hi); }
.about-when { margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.6; }

/* ── Buttons ── */
.buttons { display: flex; flex-wrap: wrap; gap: 8px; }
button { padding: 9px 14px; border: 1px solid transparent; border-radius: 8px; background: var(--accent); color: #fff; cursor: pointer; font-size: 14px; transition: background .15s; }
button:hover { background: var(--accent-hi); }
button:disabled { opacity: 0.38; cursor: not-allowed; }
button.danger { background: #8b2020; border-color: #b03030; }
button.danger:hover { background: #b03030; }

/* ── Engine fallback ── */
.engine-fallback-notice { margin: 0 0 14px; padding: 7px 12px; background: #1f1500; border: 1px solid #8a6000; border-radius: 8px; color: #f4c030; font-size: 13px; }

/* ── Visualization area ── */
.viz-area { margin: 16px 0; padding: 16px; background: var(--bg-result); border-radius: 12px; border: 1px solid var(--border); }

.step-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.step-badge { background: #0a2030; border: 1px solid var(--border); border-radius: 20px; padding: 3px 10px; font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.step-msg { color: var(--text); font-size: 14px; font-weight: 500; }

.progress-bar { height: 4px; background: #1a2d40; border-radius: 2px; margin-bottom: 18px; }
.progress-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width .3s; }

/* ── Bar chart ── */
.bars-container { display: flex; flex-direction: column; gap: 10px; }
.bars { display: flex; align-items: flex-end; gap: 6px; height: 210px; overflow-x: auto; padding-bottom: 2px; }
.bar-wrap { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; flex-shrink: 0; gap: 4px; }
.bar-val { font-size: 12px; color: var(--text-muted); font-weight: bold; }
.bar { width: 44px; min-height: 6px; border-radius: 6px 6px 0 0; transition: height .35s ease, background .3s, box-shadow .3s; }
@keyframes barPulse { 0% { filter: brightness(2.2) saturate(1.5); } 100% { filter: brightness(1) saturate(1); } }
.bar-changed { animation: barPulse 0.65s ease-out; }
.bar-idx { font-size: 11px; color: #3a5570; }
.bar-legend { display: flex; gap: 14px; }

/* ── BFS SVG ── */
.bfs-viz { display: flex; flex-direction: column; gap: 10px; }
.bfs-svg { width: 100%; max-width: 400px; display: block; margin: 0 auto; }
.bfs-node { transition: fill .4s, stroke .4s; }
.bfs-legend { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.bfs-info p { margin: 4px 0; font-size: 13px; }

/* ── Legend shared ── */
.legend-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-muted); }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

/* ── Pseudocod ── */
.pseudo { margin-top: 16px; }
.pseudo-tabs { display: flex; gap: 6px; margin-bottom: 8px; }
.pseudo-tabs button { background: #0f1a27; color: var(--text-muted); border: 1px solid var(--border); padding: 6px 14px; border-radius: 8px; font-size: 13px; }
.pseudo-tabs button:hover { color: var(--text); border-color: var(--accent); }
.pseudo-tabs button.active { background: var(--accent); color: #fff; border-color: var(--accent); }

.pseudo-lines { background: #060e18; border: 1px solid #0e2035; border-radius: 10px; padding: 10px 6px; overflow-x: auto; }
.pseudo-line { font-family: monospace; font-size: 13px; line-height: 2; color: #3a6080; padding: 1px 10px 1px 13px; border-radius: 5px; border-left: 3px solid transparent; white-space: pre; transition: background .25s, color .25s, border-color .25s; }
.pseudo-line-active { background: #0a2540; color: #e0f2ff; border-left: 3px solid var(--accent-hi); font-weight: bold; }

.pseudo-cpp { background: #060e18; color: #7dd3fc; padding: 14px; border-radius: 10px; overflow: auto; font-size: 13px; line-height: 1.6; border: 1px solid #0e2035; margin: 0; }

/* ── Quiz ── */
.quiz-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.quiz-header h2 { margin: 0; }
.quiz-prompt { font-size: 16px; color: var(--text); margin: 0 0 16px; line-height: 1.65; font-weight: 500; }
.quiz-stats { display: flex; gap: 8px; align-items: center; flex-shrink: 0; margin-top: 6px; }
.score-chip { background: #0a2030; border: 1px solid var(--border); border-radius: 20px; padding: 4px 12px; font-size: 13px; color: var(--accent-hi); font-weight: 600; white-space: nowrap; }
.streak-chip { background: #1a1000; border: 1px solid #6a4000; border-radius: 20px; padding: 4px 12px; font-size: 13px; color: #f0a020; font-weight: 600; white-space: nowrap; display: flex; align-items: center; gap: 4px; }

@keyframes flameBurn {
  0%, 100% { transform: scale(1.0) rotate(-4deg); filter: brightness(1); }
  20%       { transform: scale(1.25) rotate(4deg); filter: brightness(1.6) hue-rotate(15deg); }
  45%       { transform: scale(0.88) rotate(-2deg); filter: brightness(0.8); }
  70%       { transform: scale(1.18) rotate(3deg); filter: brightness(1.4); }
}
@keyframes flameIgnite {
  0%   { transform: scale(0.2); opacity: 0.3; filter: brightness(0.5); }
  55%  { transform: scale(1.45); opacity: 1; filter: brightness(2.2); }
  100% { transform: scale(1.0); opacity: 1; filter: brightness(1); }
}
@keyframes flameOut {
  0%   { transform: scale(1); opacity: 1; filter: grayscale(0) brightness(1); }
  35%  { transform: scale(1.1) translateY(-3px); opacity: 0.7; filter: grayscale(0.3); }
  100% { transform: scale(0.15) translateY(-12px); opacity: 0; filter: grayscale(1) brightness(0.4); }
}
.flame-icon { display: inline-block; font-size: 18px; line-height: 1; }
.flame-burn { animation: flameIgnite 0.45s ease-out forwards; }
.flame-out  { animation: flameOut 0.9s ease-in forwards; }

.quiz-viz-area { margin: 16px 0; padding: 16px; background: var(--bg-result); border-radius: 12px; border: 1px solid var(--border); }

.quiz-options { display: flex; gap: 10px; flex-wrap: wrap; margin: 16px 0 0; }
.quiz-options-col { flex-direction: column; }
.quiz-option { flex: 1 1 140px; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border); background: #0f1a27; color: var(--text); font-size: 14px; font-weight: 500; cursor: pointer; text-align: left; transition: background .15s, border-color .15s, transform .1s; }
.quiz-options-col .quiz-option { flex: none; width: 100%; }
.quiz-option:hover:not(:disabled) { background: #1a2d42; border-color: var(--accent); transform: translateY(-1px); }
.quiz-option:disabled { cursor: not-allowed; }
.opt-correct { background: #0a2a14 !important; border-color: #22c55e !important; color: #4ade80 !important; }
.opt-wrong   { background: #2a0a0a !important; border-color: #ef4444 !important; color: #f87171 !important; }
.opt-dim     { opacity: 0.35; }

.quiz-result { margin: 14px 0 0; padding: 12px 16px; border-radius: 10px; font-size: 14px; line-height: 1.5; }
.result-ok  { background: #0a2a14; border: 1px solid #22c55e; color: #4ade80; }
.result-bad { background: #2a0a0a; border: 1px solid #ef4444; color: #f87171; }
.quiz-explanation { margin: 8px 0 0; font-size: 13px; color: var(--text-muted); line-height: 1.6; }

.quiz-next-btn { margin-top: 14px; background: var(--accent); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background .15s; }
.quiz-next-btn:hover { background: var(--accent-hi); }

/* ── Statistici ── */
.stats-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 8px; }
.stats-header h2 { margin: 0; }
.btn-reset { background: #1a0a0a; border: 1px solid #6a2020; color: #f87171; padding: 7px 14px; font-size: 13px; border-radius: 8px; cursor: pointer; }
.btn-reset:hover { background: #2a1010; border-color: #ef4444; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; }
@media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
.stat-card { background: var(--bg-result); border: 1px solid var(--border); border-radius: 12px; padding: 16px 12px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-card.stat-good { border-color: #22c55e; background: #071a0e; }
.stat-card.stat-mid  { border-color: #f59e0b; background: #1a1000; }
.stat-card.stat-low  { border-color: #ef4444; background: #1a0707; }
.stat-val { font-size: 2rem; font-weight: 700; color: var(--accent-hi); line-height: 1; }
.stat-card.stat-good .stat-val { color: #4ade80; }
.stat-card.stat-mid  .stat-val { color: #fbbf24; }
.stat-card.stat-low  .stat-val { color: #f87171; }
.stat-lbl { font-size: 12px; color: var(--text-muted); text-align: center; }

.stats-section-title { font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin: 20px 0 10px; font-weight: 600; }
.stats-bars { display: flex; flex-direction: column; gap: 8px; }
.stats-accuracy-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.stats-bar-row { display: flex; align-items: center; gap: 10px; }
.stats-bar-label { font-size: 13px; color: var(--text); width: 110px; flex-shrink: 0; }
.stats-bar-track { flex: 1; height: 8px; background: #0a1825; border-radius: 4px; overflow: hidden; }
.stats-bar-fill { height: 100%; background: var(--accent); border-radius: 4px; transition: width .5s ease; min-width: 2px; }
.stats-bar-total { background: #2aa8f0; }

.mistakes-list { display: flex; flex-direction: column; gap: 8px; }
.mistake-item { padding: 10px 14px; background: #1a0a0a; border: 1px solid #5a1a1a; border-radius: 10px; }
.mistake-q { margin: 0 0 5px; font-size: 13px; color: var(--text); line-height: 1.5; }
.mistake-ans { margin: 0; font-size: 12px; color: #f87171; }
.mistake-ans strong { color: #4ade80; }
.stats-bar-num { font-size: 12px; color: var(--text-muted); width: 44px; text-align: right; flex-shrink: 0; }

/* ── Answer strip ── */
.answer-strip { display: flex; gap: 5px; flex-wrap: wrap; padding: 2px 0 6px; }
.strip-cell { width: 26px; height: 26px; border-radius: 5px; cursor: default; transition: transform .1s; flex-shrink: 0; }
.strip-cell:hover { transform: scale(1.25); }
.strip-ok  { background: #22c55e; box-shadow: 0 0 6px #22c55e44; }
.strip-bad { background: #ef4444; box-shadow: 0 0 6px #ef444444; }
.strip-legend { display: flex; gap: 16px; font-size: 13px; color: var(--text-muted); align-items: center; margin-bottom: 10px; }
.strip-dot { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 4px; vertical-align: middle; }

.recent-list { display: flex; flex-direction: column; gap: 6px; }
.recent-item { display: flex; align-items: baseline; gap: 10px; padding: 7px 10px; background: var(--bg-result); border-radius: 8px; border: 1px solid var(--border); }
.recent-dot { font-size: 13px; font-weight: 700; flex-shrink: 0; width: 18px; text-align: center; }
.dot-ok  { color: #4ade80; }
.dot-bad { color: #f87171; }
.recent-text { font-size: 13px; color: var(--text-muted); line-height: 1.4; }

/* ── Conținut ── */
.cnt-title { font-size: 12px; font-weight: 600; color: var(--text-label); text-transform: uppercase; letter-spacing: 0.06em; margin: 18px 0 10px; }
.cnt-form { background: var(--bg-result); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
.cnt-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
.cnt-divider { border: none; border-top: 1px solid var(--border); margin: 22px 0; }
.cnt-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.cnt-item { display: flex; justify-content: space-between; align-items: center; gap: 12px; background: var(--bg-result); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; flex-wrap: wrap; }
.cnt-item-body { flex: 1; min-width: 0; }
.cnt-q { margin: 0 0 3px; font-size: 13px; color: var(--text); line-height: 1.4; }
.cnt-ans { margin: 0; font-size: 12px; color: var(--text-muted); }
.cnt-expl { opacity: 0.7; font-style: italic; }
.cnt-set-label { font-size: 13px; color: var(--text); }
@media (max-width: 700px) { .cnt-opts { grid-template-columns: 1fr; } }

/* ── Misc ── */
.muted { color: var(--text-muted); font-size: 14px; }
.ok  { color: #4ade80; }
.bad { color: #f87171; }

@media (max-width: 700px) {
  /* ── Layout ── */
  .app  { padding: 10px; }
  .card { padding: 14px; }
  .hero h1 { font-size: 1.5rem; }
  .hero p  { font-size: 13px; }

  /* ── iOS: previne zoom la focus pe input ── */
  input, select { font-size: 16px !important; }

  /* ── Controale simulator ── */
  .grade-filter-row { flex-direction: column; align-items: flex-start; gap: 6px; }
  .algo-select-row  { flex-direction: column; align-items: stretch; gap: 6px; }
  .algo-select-row select { width: 100%; }
  .grade-badge { align-self: flex-start; }

  /* Grafuri predefinite — stivuite vertical pe mobil */
  .preset-btns { flex-direction: column; gap: 5px; }
  .preset-btns button { border-radius: 8px !important; font-size: 13px !important; padding: 9px 12px !important; text-align: left; width: 100%; }

  /* Butoane simulator mai compacte */
  .buttons button { padding: 9px 10px; font-size: 13px; }

  /* ── Bar chart ── */
  .bar     { width: 26px; }
  .bar-val { font-size: 10px; }
  .bar-idx { font-size: 10px; }
  .bars    { gap: 4px; }

  /* ── Căutare binară ── */
  .bsearch-box   { width: 34px; height: 34px; font-size: 12px; }
  .bsearch-array { gap: 4px; }

  /* ── Pseudocod / C++ ── */
  .pseudo-line { font-size: 12px; line-height: 1.7; }

  /* ── Despre algoritm ── */
  .about-toggle { font-size: 13px; padding: 9px 12px; }
  .about-card   { padding: 12px; }
  .about-info   { font-size: 13px; }
  .about-table  { font-size: 12px; }
  .about-table td:first-child { width: 100px; }
  .about-when   { font-size: 12px; }

  /* ── Quiz ── */
  .quiz-prompt     { font-size: 14px; }
  .quiz-option     { font-size: 13px; padding: 10px 12px; }
  .quiz-explanation { font-size: 12px; }
  .quiz-result     { font-size: 13px; }

  /* ── Statistici ── */
  .stat-card  { padding: 12px 8px; }
  .stat-val   { font-size: 1.5rem; }
  .stat-lbl   { font-size: 11px; }
  .stats-bar-label { width: 80px; font-size: 12px; }
  .stats-bar-num   { width: 34px; font-size: 11px; }
  .stats-section-title { font-size: 11px; }
  .mistake-item { padding: 8px 10px; }
  .mistake-q    { font-size: 12px; }
  .mistake-ans  { font-size: 11px; }
  .recent-text  { font-size: 12px; }

  /* ── Simulator info ── */
  .step-msg  { font-size: 13px; }
  .bfs-info p { font-size: 12px; overflow-wrap: break-word; }
  .bfs-legend { gap: 8px; }
  .legend-item { font-size: 11px; }

  /* ── Speed row ── */
  .speed-row { flex-wrap: wrap; }
}
</style>
