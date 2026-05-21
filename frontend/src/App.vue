<template>
  <div class="app">
    <header class="hero">
      <div class="hero-text">
        <h1>Algoritmix</h1>
        <p>{{ currentLang === 'ro' ? 'Laborator Virtual de Structuri de Date și Algoritmi (BAC România)' : 'Virtual Lab for Data Structures and Algorithms (Romanian BAC)' }}</p>
      </div>
      <div class="hero-controls">
        <button class="lang-toggle" @click="toggleLang" :title="currentLang === 'ro' ? 'Switch to English' : 'Schimbă în Română'">
          {{ currentLang === 'ro' ? '🌐 EN' : '🌐 RO' }}
        </button>
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <nav class="tabs">
      <button :class="{ active: tab === 'sim' }"     @click="tab = 'sim'">{{ t('tab_sim') }}</button>
      <button :class="{ active: tab === 'quiz' }"    @click="tab = 'quiz'">{{ t('tab_quiz') }}</button>
      <button :class="{ active: tab === 'stats' }"   @click="tab = 'stats'">{{ t('tab_stats') }}</button>
      <button :class="{ active: tab === 'content' }"   @click="tab = 'content'">{{ t('tab_admin') }}</button>
      <button :class="{ active: tab === 'challenge' }" @click="tab = 'challenge'">{{ t('tab_challenge') }}</button>
    </nav>

    <SimulatorTab v-if="tab === 'sim'" />
    <QuizTab      v-else-if="tab === 'quiz'" />
    <StatsTab     v-else-if="tab === 'stats'" />
    <AdminTab     v-else-if="tab === 'content'"   @load-set="tab = 'sim'" />
    <ChallengeTab v-else-if="tab === 'challenge'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n }        from "./i18n/index.js";
import { useStats }       from "./composables/useStats.js";
import { useCustomContent } from "./composables/useCustomContent.js";
import { useTheme }       from "./composables/useTheme.js";
import SimulatorTab   from "./components/SimulatorTab.vue";
import QuizTab        from "./components/QuizTab.vue";
import StatsTab       from "./components/StatsTab.vue";
import AdminTab       from "./components/AdminTab.vue";
import ChallengeTab   from "./components/ChallengeTab.vue";

const { t, currentLang, toggleLang } = useI18n();
const { isDark, toggleTheme } = useTheme();
const { loadStats }          = useStats();
const { loadCustomContent }  = useCustomContent();

const tab = ref("sim");

onMounted(() => { loadStats(); loadCustomContent(); });
</script>

<style>
:root, [data-theme="dark"] {
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
  --pseudo-bg: #060e18;
  --pseudo-border: #0e2035;
  --pseudo-text: #3a6080;
  --bar-inactive: #0d1a26;
  --about-bg:  #0a1825;
  --score-bg:  #0a2030;
}

[data-theme="light"] {
  --bg:        #f0f4f8;
  --bg-card:   #ffffff;
  --bg-input:  #f8fafc;
  --bg-result: #f1f5f9;
  --border:    #cbd5e1;
  --accent:    #1a8fd1;
  --accent-hi: #0e6fa8;
  --text:      #1e293b;
  --text-muted:#64748b;
  --text-label:#475569;
  --pseudo-bg: #f8fafc;
  --pseudo-border: #e2e8f0;
  --pseudo-text: #64748b;
  --bar-inactive: #e2e8f0;
  --about-bg:  #f1f5f9;
  --score-bg:  #e0f2fe;
}

:root {
  font-family: "Trebuchet MS", "Segoe UI", sans-serif;
  color: var(--text);
}

* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); }

.app { max-width: 980px; margin: 0 auto; padding: 24px; }
.hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.hero-text { flex: 1; }
.hero h1 { margin-bottom: 4px; color: var(--accent-hi); font-size: 2rem; letter-spacing: 0.5px; }
.hero p  { margin-top: 0; color: var(--text-muted); }
.hero-controls { display: flex; gap: 8px; flex-shrink: 0; margin-top: 6px; }
.lang-toggle, .theme-toggle { background: var(--bg-result); border: 1px solid var(--accent); color: var(--accent-hi); padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s; }
.lang-toggle:hover, .theme-toggle:hover { background: var(--about-bg); }

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

/* ── Căutare Binară / Liniară ── */
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
.about-toggle { display: flex; justify-content: space-between; align-items: center; margin: 14px 0 0; padding: 10px 14px; background: var(--about-bg); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; font-size: 14px; color: var(--text-muted); transition: background .15s, border-color .15s; user-select: none; }
.about-toggle:hover { background: var(--bg-result); border-color: var(--accent); color: var(--text); }
.about-chevron { font-size: 11px; }
.about-card { margin-top: 6px; padding: 14px 16px; background: var(--bg-result); border: 1px solid var(--border); border-radius: 10px; }
.about-info { margin: 0 0 12px; font-size: 14px; color: var(--text); line-height: 1.6; }
.about-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 10px; }
.about-table td { padding: 5px 10px; border-bottom: 1px solid #0e2035; color: var(--text-muted); }
.about-table td:first-child { color: var(--text-label); width: 140px; }
.about-table td:last-child { font-family: monospace; color: var(--accent-hi); }
.about-when { margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.6; }
.about-body { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 10px; }
.about-body .about-table { flex: 1; min-width: 200px; margin-bottom: 0; }
.complexity-chart { flex: 1; min-width: 220px; }
.cx-svg { width: 100%; display: block; }
.cx-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.cx-leg-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-muted); padding: 2px 7px; border-radius: 12px; border: 1px solid var(--border); cursor: default; transition: color .15s; }
.cx-leg-item.cx-leg-active { font-weight: 700; border-color: currentColor; }
.cx-leg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* ── Buttons ── */
.buttons { display: flex; flex-wrap: wrap; gap: 8px; }
button { padding: 9px 14px; border: 1px solid transparent; border-radius: 8px; background: var(--accent); color: #fff; cursor: pointer; font-size: 14px; transition: background .15s; }
button:hover { background: var(--accent-hi); }
button:disabled { opacity: 0.38; cursor: not-allowed; }
button.danger { background: #8b2020; border-color: #b03030; }
button.danger:hover { background: #b03030; }

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
.pseudo-lines { background: var(--pseudo-bg); border: 1px solid var(--pseudo-border); border-radius: 10px; padding: 10px 6px; overflow-x: auto; }
.pseudo-line { font-family: monospace; font-size: 13px; line-height: 2; color: var(--pseudo-text); padding: 1px 10px 1px 13px; border-radius: 5px; border-left: 3px solid transparent; white-space: pre; transition: background .25s, color .25s, border-color .25s; }
.pseudo-line-active { background: #0a2540; color: #e0f2ff; border-left: 3px solid var(--accent-hi); font-weight: bold; }

/* ── Quiz ── */
.quiz-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.quiz-header h2 { margin: 0; }
.quiz-prompt { font-size: 16px; color: var(--text); margin: 0 0 16px; line-height: 1.65; font-weight: 500; }
.quiz-stats { display: flex; gap: 8px; align-items: center; flex-shrink: 0; margin-top: 6px; }
.score-chip { background: var(--score-bg); border: 1px solid var(--border); border-radius: 20px; padding: 4px 12px; font-size: 13px; color: var(--accent-hi); font-weight: 600; white-space: nowrap; }
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
.stats-header-btns { display: flex; gap: 8px; }
.btn-export { background: #0a1e30; border: 1px solid var(--accent); color: var(--accent-hi); padding: 7px 14px; font-size: 13px; border-radius: 8px; cursor: pointer; }
.btn-export:hover { background: var(--about-bg); }
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
.stats-accuracy-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.stats-bar-label { font-size: 13px; color: var(--text); width: 110px; flex-shrink: 0; }
.stats-bar-track { flex: 1; height: 8px; background: #0a1825; border-radius: 4px; overflow: hidden; }
.stats-bar-fill { height: 100%; background: var(--accent); border-radius: 4px; transition: width .5s ease; min-width: 2px; }
.stats-bar-total { background: #2aa8f0; }
.stats-bar-num { font-size: 12px; color: var(--text-muted); width: 44px; text-align: right; flex-shrink: 0; }
.algo-stats-list { display: flex; flex-direction: column; gap: 8px; }
.algo-stat-row { display: flex; align-items: center; gap: 10px; }
.algo-stat-name { font-size: 13px; color: var(--text); width: 130px; flex-shrink: 0; }
.algo-stat-pct { font-size: 12px; font-weight: 600; width: 38px; text-align: right; flex-shrink: 0; }
.algo-stat-count { font-size: 11px; color: var(--text-muted); width: 40px; text-align: right; flex-shrink: 0; }
.bar-good { background: #22c55e !important; color: #4ade80; }
.bar-mid  { background: #f59e0b !important; color: #fbbf24; }
.bar-low  { background: #ef4444 !important; color: #f87171; }
.mistakes-list { display: flex; flex-direction: column; gap: 8px; }
.mistake-item { padding: 10px 14px; background: #1a0a0a; border: 1px solid #5a1a1a; border-radius: 10px; }
.mistake-q { margin: 0 0 5px; font-size: 13px; color: var(--text); line-height: 1.5; }
.mistake-ans { margin: 0; font-size: 12px; color: #f87171; }
.mistake-ans strong { color: #4ade80; }
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

/* ── Recursion Tree ── */
.rec-tree-wrap { margin-top: 16px; padding: 12px 14px; background: var(--bg-result); border: 1px solid var(--border); border-radius: 10px; }
.rec-tree-title { font-size: 12px; font-weight: 600; color: var(--text-label); text-transform: uppercase; letter-spacing: .05em; margin: 0 0 10px; }
.rec-tree-scroll { overflow-x: auto; }
.rec-tree-svg { display: block; }
.rec-edge { stroke: var(--border); stroke-width: 1.5; }
.rec-node { transition: fill .3s, stroke .3s; }
.rec-node-active  { fill: var(--accent);  stroke: var(--accent-hi); stroke-width: 2; }
.rec-node-merge   { fill: #5b21b6;        stroke: #7c3aed;          stroke-width: 2; }
.rec-node-done    { fill: #1a4a2a;        stroke: #22c55e;          stroke-width: 1.5; }
.rec-node-pending { fill: var(--bg-input); stroke: var(--border);    stroke-width: 1.5; }
.rec-text { fill: var(--text-muted); font-family: monospace; }
.rec-text-light { fill: #e0f2ff; font-family: monospace; }
.rec-node-done ~ .rec-text { fill: #4ade80; }
.rec-legend { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
.rec-leg-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-muted); }
.rec-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.rec-dot-active  { background: var(--accent); }
.rec-dot-merge   { background: #7c3aed; }
.rec-dot-done    { background: #22c55e; }
.rec-dot-pending { background: var(--bg-input); border: 1px solid var(--border); }

/* ── Pseudocode Quiz ── */
.challenge-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.challenge-header h2 { margin: 0; }
.pq-algo-label { font-size: 14px; color: var(--text-muted); margin: 0 0 12px; }
.pq-pseudo { margin-bottom: 16px; pointer-events: none; }
.pq-blank-line { color: var(--accent-hi) !important; background: #0a2540 !important; border-left-color: var(--accent-hi) !important; font-weight: 700 !important; letter-spacing: .03em; }
.pq-question { font-size: 15px; font-weight: 600; color: var(--text); margin: 0 0 12px; }
.pq-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }
.pq-option { text-align: left; font-family: monospace; font-size: 13px; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text); cursor: pointer; transition: background .15s, border-color .15s; white-space: pre; }
.pq-option:hover:not(:disabled) { background: var(--bg-result); border-color: var(--accent); }
.pq-option:disabled { cursor: not-allowed; }

/* ── Misc ── */
.muted { color: var(--text-muted); font-size: 14px; }
.ok  { color: #4ade80; }
.bad { color: #f87171; }

@media (max-width: 700px) {
  .app  { padding: 10px; }
  .card { padding: 14px; }
  .hero h1 { font-size: 1.5rem; }
  .hero p  { font-size: 13px; }
  input, select { font-size: 16px !important; }
  .grade-filter-row { flex-direction: column; align-items: flex-start; gap: 6px; }
  .algo-select-row  { flex-direction: column; align-items: stretch; gap: 6px; }
  .algo-select-row select { width: 100%; }
  .grade-badge { align-self: flex-start; }
  .preset-btns { flex-direction: column; gap: 5px; }
  .preset-btns button { border-radius: 8px !important; font-size: 13px !important; padding: 9px 12px !important; text-align: left; width: 100%; }
  .buttons button { padding: 9px 10px; font-size: 13px; }
  .bar     { width: 26px; }
  .bar-val { font-size: 10px; }
  .bar-idx { font-size: 10px; }
  .bars    { gap: 4px; }
  .bsearch-box   { width: 34px; height: 34px; font-size: 12px; }
  .bsearch-array { gap: 4px; }
  .pseudo-line { font-size: 12px; line-height: 1.7; }
  .about-toggle { font-size: 13px; padding: 9px 12px; }
  .about-card   { padding: 12px; }
  .about-info   { font-size: 13px; }
  .about-table  { font-size: 12px; }
  .about-table td:first-child { width: 100px; }
  .about-when   { font-size: 12px; }
  .quiz-prompt     { font-size: 14px; }
  .quiz-option     { font-size: 13px; padding: 10px 12px; }
  .quiz-explanation { font-size: 12px; }
  .quiz-result     { font-size: 13px; }
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
  .step-msg  { font-size: 13px; }
  .bfs-info p { font-size: 12px; overflow-wrap: break-word; }
  .bfs-legend { gap: 8px; }
  .legend-item { font-size: 11px; }
  .speed-row { flex-wrap: wrap; }
}
</style>
