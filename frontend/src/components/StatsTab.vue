<template>
  <section class="card">
    <div class="stats-header">
      <h2>{{ t('stats_title') }}</h2>
      <div class="stats-header-btns">
        <button class="btn-export" @click="exportStats" v-if="stats.quiz.total > 0 || stats.sim.runs > 0">{{ t('stats_export') }}</button>
        <button class="btn-reset"  @click="resetStats"  v-if="stats.quiz.total > 0 || stats.sim.runs > 0">{{ t('stats_reset') }}</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-val">{{ stats.quiz.total }}</span>
        <span class="stat-lbl">{{ t('stats_questions') }}</span>
      </div>
      <div class="stat-card" :class="stats.quiz.total === 0 ? '' : accuracy >= 70 ? 'stat-good' : accuracy >= 40 ? 'stat-mid' : 'stat-low'">
        <span class="stat-val">{{ stats.quiz.total > 0 ? accuracy + '%' : '—' }}</span>
        <span class="stat-lbl">{{ t('stats_accuracy') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-val">{{ stats.quiz.bestStreak > 0 ? stats.quiz.bestStreak : '—' }}</span>
        <span class="stat-lbl">{{ t('stats_streak') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-val">{{ stats.sim.runs > 0 ? stats.sim.runs : '—' }}</span>
        <span class="stat-lbl">{{ t('stats_runs') }}</span>
      </div>
    </div>

    <template v-if="stats.quiz.total > 0">
      <h3 class="stats-section-title">{{ t('stats_progress') }}</h3>
      <div class="answer-strip">
        <div
          v-for="a in recentReversed"
          :key="a.id"
          class="strip-cell"
          :class="a.correct ? 'strip-ok' : 'strip-bad'"
          :title="a.prompt"
        ></div>
      </div>
      <div class="strip-legend">
        <span><span class="strip-dot strip-ok"></span>{{ t('stats_correct_lbl') }} {{ stats.quiz.correct }}</span>
        <span><span class="strip-dot strip-bad"></span>{{ t('stats_wrong_lbl') }} {{ stats.quiz.total - stats.quiz.correct }}</span>
      </div>
      <div class="stats-accuracy-row">
        <span class="stats-bar-label">{{ t('stats_accuracy') }}</span>
        <div class="stats-bar-track">
          <div class="stats-bar-fill stats-bar-total" :style="{ width: accuracy + '%' }"></div>
        </div>
        <span class="stats-bar-num">{{ accuracy }}%</span>
      </div>
      <div v-if="sparkDots.length >= 3" class="spark-wrap">
        <svg viewBox="0 0 300 110" class="spark-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="110">
              <stop offset="0%"   stop-color="#1a8fd1" stop-opacity="0.28"/>
              <stop offset="100%" stop-color="#1a8fd1" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <line x1="0" y1="55" x2="300" y2="55" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,3"/>
          <text x="3" y="51" font-size="8" fill="#3a5570">50%</text>
          <path :d="sparkArea" fill="url(#sparkGrad)"/>
          <path :d="sparkPath" fill="none" stroke="#1a8fd1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <g v-for="(d, i) in sparkDots" :key="i" :transform="`translate(${d.x},${d.y})`">
            <rect x="-4.5" y="-4.5" width="9" height="9" :fill="d.correct ? '#22c55e' : '#ef4444'" transform="rotate(45)" rx="1.5"/>
          </g>
        </svg>
      </div>
    </template>

    <template v-if="stats.quiz.byType.visual.total > 0 || stats.quiz.byType.text.total > 0 || stats.quiz.byType.pseudocode.total > 0">
      <h3 class="stats-section-title">{{ t('stats_by_type') }}</h3>
      <div class="algo-stats-list">
        <div v-if="stats.quiz.byType.visual.total > 0" class="algo-stat-row">
          <span class="algo-stat-name">{{ t('stats_visual') }}</span>
          <div class="stats-bar-track">
            <div class="stats-bar-fill" :class="algoBarClass(stats.quiz.byType.visual)" :style="{ width: algoAccuracy(stats.quiz.byType.visual) + '%' }"></div>
          </div>
          <span class="algo-stat-pct" :class="algoTextClass(stats.quiz.byType.visual)">{{ algoAccuracy(stats.quiz.byType.visual) }}%</span>
          <span class="algo-stat-count">{{ stats.quiz.byType.visual.correct }}/{{ stats.quiz.byType.visual.total }}</span>
        </div>
        <div v-if="stats.quiz.byType.text.total > 0" class="algo-stat-row">
          <span class="algo-stat-name">{{ t('stats_text') }}</span>
          <div class="stats-bar-track">
            <div class="stats-bar-fill" :class="algoBarClass(stats.quiz.byType.text)" :style="{ width: algoAccuracy(stats.quiz.byType.text) + '%' }"></div>
          </div>
          <span class="algo-stat-pct" :class="algoTextClass(stats.quiz.byType.text)">{{ algoAccuracy(stats.quiz.byType.text) }}%</span>
          <span class="algo-stat-count">{{ stats.quiz.byType.text.correct }}/{{ stats.quiz.byType.text.total }}</span>
        </div>
        <div v-if="stats.quiz.byType.pseudocode.total > 0" class="algo-stat-row">
          <span class="algo-stat-name">{{ t('stats_pseudocode') }}</span>
          <div class="stats-bar-track">
            <div class="stats-bar-fill" :class="algoBarClass(stats.quiz.byType.pseudocode)" :style="{ width: algoAccuracy(stats.quiz.byType.pseudocode) + '%' }"></div>
          </div>
          <span class="algo-stat-pct" :class="algoTextClass(stats.quiz.byType.pseudocode)">{{ algoAccuracy(stats.quiz.byType.pseudocode) }}%</span>
          <span class="algo-stat-count">{{ stats.quiz.byType.pseudocode.correct }}/{{ stats.quiz.byType.pseudocode.total }}</span>
        </div>
      </div>
    </template>

    <template v-if="Object.keys(stats.quiz.byAlgorithm).length > 0">
      <h3 class="stats-section-title">{{ t('stats_by_algo') }}</h3>
      <div class="algo-stats-list">
        <div v-for="(data, algoId) in stats.quiz.byAlgorithm" :key="algoId" class="algo-stat-row">
          <span class="algo-stat-name">{{ algoName(algoId) }}</span>
          <div class="stats-bar-track">
            <div class="stats-bar-fill" :class="algoBarClass(data)" :style="{ width: algoAccuracy(data) + '%' }"></div>
          </div>
          <span class="algo-stat-pct" :class="algoTextClass(data)">{{ algoAccuracy(data) }}%</span>
          <span class="algo-stat-count">{{ data.correct }}/{{ data.total }}</span>
        </div>
      </div>
    </template>

    <template v-if="stats.mistakes.length > 0">
      <h3 class="stats-section-title">{{ t('stats_mistakes') }}</h3>
      <div class="mistakes-list">
        <div v-for="(m, i) in stats.mistakes" :key="i" class="mistake-item">
          <p class="mistake-q">{{ m.prompt }}</p>
          <p class="mistake-ans">{{ t('stats_correct_ans') }} <strong>{{ m.correctId }}</strong></p>
        </div>
      </div>
    </template>

    <template v-if="stats.quiz.recent.length > 0">
      <h3 class="stats-section-title">{{ t('stats_recent_ans') }}</h3>
      <div class="recent-list">
        <div v-for="a in stats.quiz.recent" :key="a.id" class="recent-item">
          <span class="recent-dot" :class="a.correct ? 'dot-ok' : 'dot-bad'">{{ a.correct ? '✓' : '✗' }}</span>
          <span class="recent-type-badge" v-if="a.type === 'pseudocode'">P</span>
          <span class="recent-text">{{ a.prompt }}</span>
        </div>
      </div>
    </template>

    <p v-if="stats.quiz.total === 0 && stats.sim.runs === 0" class="muted" style="margin-top:12px">
      {{ t('stats_no_data') }}
    </p>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useStats } from "../composables/useStats.js";
import { useI18n } from "../i18n/index.js";
import { ALGORITHMS } from "../algorithms.js";

const { t } = useI18n();
const { stats, accuracy, resetStats } = useStats();

const recentReversed = computed(() => [...stats.quiz.recent].reverse());

const sparkDots = computed(() => {
  const items = [...stats.quiz.recent].reverse();
  const n = items.length;
  if (n < 2) return [];
  return items.map((item, i) => {
    const win = items.slice(Math.max(0, i - 4), i + 1);
    const acc = win.filter(x => x.correct).length / win.length;
    const x = n === 1 ? 150 : Math.round(i * 300 / (n - 1));
    const y = Math.round(106 - acc * 102);
    return { x, y, correct: item.correct };
  });
});

const sparkPath = computed(() => {
  const pts = sparkDots.value;
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cpX = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${cpX},${pts[i - 1].y} ${cpX},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }
  return d;
});

const sparkArea = computed(() => {
  const pts = sparkDots.value;
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},110 L ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cpX = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${cpX},${pts[i - 1].y} ${cpX},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }
  d += ` L ${pts[pts.length - 1].x},110 Z`;
  return d;
});

function algoName(id)     { return ALGORITHMS[id]?.name || id; }
function algoAccuracy(d)  { return d.total > 0 ? Math.round(d.correct / d.total * 100) : 0; }
function algoBarClass(d)  {
  const pct = algoAccuracy(d);
  return pct >= 70 ? "bar-good" : pct >= 40 ? "bar-mid" : "bar-low";
}
function algoTextClass(d) {
  const pct = algoAccuracy(d);
  return pct >= 70 ? "pct-good" : pct >= 40 ? "pct-mid" : "pct-low";
}

function exportStats() {
  const payload = {
    exportedAt: new Date().toISOString(),
    quiz: stats.quiz,
    sim: stats.sim,
    mistakes: stats.mistakes,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `algoritmix-stats-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>
