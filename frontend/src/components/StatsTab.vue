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
          v-for="a in [...stats.quiz.recent].reverse()"
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
    </template>

    <template v-if="Object.keys(stats.quiz.byAlgorithm).length > 0">
      <h3 class="stats-section-title">{{ t('stats_by_algo') }}</h3>
      <div class="algo-stats-list">
        <div v-for="(data, algoId) in stats.quiz.byAlgorithm" :key="algoId" class="algo-stat-row">
          <span class="algo-stat-name">{{ algoName(algoId) }}</span>
          <div class="stats-bar-track">
            <div class="stats-bar-fill" :class="algoBarClass(data)" :style="{ width: algoAccuracy(data) + '%' }"></div>
          </div>
          <span class="algo-stat-pct" :class="algoBarClass(data)">{{ algoAccuracy(data) }}%</span>
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
import { useStats } from "../composables/useStats.js";
import { useI18n } from "../i18n/index.js";
import { ALGORITHMS } from "../algorithms.js";

const { t } = useI18n();
const { stats, accuracy, resetStats } = useStats();

function algoName(id)     { return ALGORITHMS[id]?.name || id; }
function algoAccuracy(d)  { return d.total > 0 ? Math.round(d.correct / d.total * 100) : 0; }
function algoBarClass(d)  {
  const pct = algoAccuracy(d);
  return pct >= 70 ? "bar-good" : pct >= 40 ? "bar-mid" : "bar-low";
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
