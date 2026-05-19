<template>
  <section class="card">
    <div class="stats-header">
      <h2>{{ t('stats_title') }}</h2>
      <button class="btn-reset" @click="resetStats" v-if="stats.quiz.total > 0 || stats.sim.runs > 0">{{ t('stats_reset') }}</button>
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
      <h3 class="stats-section-title">{{ t('stats_history') }}</h3>
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

    <template v-if="stats.mistakes.length > 0">
      <h3 class="stats-section-title">{{ t('stats_mistakes') }}</h3>
      <div class="mistakes-list">
        <div v-for="(m, i) in stats.mistakes" :key="i" class="mistake-item">
          <p class="mistake-q">{{ m.prompt }}</p>
          <p class="mistake-ans">{{ t('about_when') }} <strong>{{ m.correctId }}</strong></p>
        </div>
      </div>
    </template>

    <template v-if="stats.quiz.recent.length > 0">
      <h3 class="stats-section-title">{{ t('stats_history') }}</h3>
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

const { t } = useI18n();
const { stats, accuracy, resetStats } = useStats();
</script>
