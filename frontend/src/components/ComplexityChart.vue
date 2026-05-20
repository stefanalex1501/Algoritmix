<template>
  <div class="complexity-chart">
    <svg :viewBox="`0 0 ${W} ${H}`" class="cx-svg">
      <!-- Grid lines -->
      <line v-for="y in gridY" :key="'gy'+y" :x1="PAD" :y1="y" :x2="W-PAD/2" :y2="y" stroke="var(--border)" stroke-width="1" stroke-dasharray="3,3" />
      <line v-for="x in gridX" :key="'gx'+x" :x1="x" :y1="PAD/2" :x2="x" :y2="H-PAD" stroke="var(--border)" stroke-width="1" stroke-dasharray="3,3" />

      <!-- Axes -->
      <line :x1="PAD" :y1="PAD/2" :x2="PAD" :y2="H-PAD" stroke="var(--text-muted)" stroke-width="1.5" />
      <line :x1="PAD" :y1="H-PAD" :x2="W-PAD/2" :y2="H-PAD" stroke="var(--text-muted)" stroke-width="1.5" />
      <text :x="W/2" :y="H-4" text-anchor="middle" font-size="10" fill="var(--text-muted)">n</text>
      <text :x="PAD-2" :y="PAD/2-2" text-anchor="middle" font-size="10" fill="var(--text-muted)">op</text>

      <!-- Curves -->
      <polyline v-for="c in curves" :key="c.id"
        :points="c.points"
        :stroke="c.color"
        stroke-width="2"
        fill="none"
        :stroke-dasharray="c.id === highlight ? '0' : '0'"
        :opacity="highlight && c.id !== highlight ? 0.25 : 1"
      />

      <!-- Labels at end of curves -->
      <text v-for="c in curves" :key="'lbl'+c.id"
        :x="c.labelX" :y="c.labelY"
        font-size="10" font-weight="600"
        :fill="c.color"
        :opacity="highlight && c.id !== highlight ? 0.3 : 1"
      >{{ c.label }}</text>
    </svg>

    <div class="cx-legend">
      <span v-for="c in curves" :key="'leg'+c.id"
        class="cx-leg-item"
        :class="{ 'cx-leg-active': c.id === highlight }"
        :style="{ borderColor: c.color, color: c.id === highlight ? c.color : '' }"
      >
        <span class="cx-leg-dot" :style="{ background: c.color }"></span>
        {{ c.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  highlight: { type: String, default: null },
});

const W = 340, H = 180, PAD = 36;
const N = 40;
const chartW = W - PAD - PAD / 2;
const chartH = H - PAD - PAD / 2;

const CURVES = [
  { id: "O1",      label: "O(1)",      color: "#4ade80", fn: () => 1 },
  { id: "Ologn",   label: "O(log n)",  color: "#60a5fa", fn: (n) => Math.log2(n) },
  { id: "On",      label: "O(n)",      color: "#f0c040", fn: (n) => n },
  { id: "Onlogn",  label: "O(n log n)",color: "#f97316", fn: (n) => n * Math.log2(n) },
  { id: "On2",     label: "O(n²)",     color: "#f87171", fn: (n) => n * n },
];

const curves = computed(() => {
  const ns = Array.from({ length: N }, (_, i) => i + 1);
  const raw = CURVES.map(c => ({ ...c, vals: ns.map(c.fn) }));
  const maxVal = Math.max(...raw.map(c => c.vals[N - 1])) * 1.05;

  return raw.map(c => {
    const pts = ns.map((n, i) => {
      const x = PAD + (i / (N - 1)) * chartW;
      const y = (H - PAD) - (c.vals[i] / maxVal) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const lastX = PAD + chartW;
    const lastY = (H - PAD) - (c.vals[N - 1] / maxVal) * chartH;
    return {
      ...c,
      points: pts.join(" "),
      labelX: lastX + 3,
      labelY: Math.max(PAD / 2 + 6, Math.min(H - PAD - 2, lastY + 4)),
    };
  });
});

const gridY = computed(() => [PAD / 2, PAD / 2 + chartH * 0.25, PAD / 2 + chartH * 0.5, PAD / 2 + chartH * 0.75, H - PAD]);
const gridX = computed(() => [PAD, PAD + chartW * 0.25, PAD + chartW * 0.5, PAD + chartW * 0.75, PAD + chartW]);
</script>
