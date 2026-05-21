<template>
  <div class="rec-tree-wrap">
    <p class="rec-tree-title">{{ t('tree_title') }}</p>
    <div class="rec-tree-scroll">
      <svg :viewBox="`0 0 ${svgW} ${svgH}`" :width="svgW" :height="svgH" class="rec-tree-svg">
        <!-- Edges -->
        <line
          v-for="e in edges" :key="e.key"
          :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2"
          class="rec-edge"
        />
        <!-- Nodes -->
        <g v-for="n in positioned" :key="n.id" class="rec-node-g">
          <circle
            :cx="n.x" :cy="n.y" :r="R"
            :class="nodeClass(n)"
          />
          <!-- Range label -->
          <text :x="n.x" :y="n.y + (n.subLabel ? -3 : 4)" text-anchor="middle" :class="textClass(n)" font-size="9">
            {{ n.left + 1 }}..{{ n.right + 1 }}
          </text>
          <!-- Pivot / mid sub-label -->
          <text v-if="n.subLabel" :x="n.x" :y="n.y + 8" text-anchor="middle" :class="textClass(n)" font-size="8">
            {{ n.subLabel }}
          </text>
        </g>
      </svg>
    </div>
    <!-- Legend -->
    <div class="rec-legend">
      <span class="rec-leg-item"><span class="rec-dot rec-dot-active"></span>{{ t('tree_active') }}</span>
      <span class="rec-leg-item"><span class="rec-dot rec-dot-done"></span>{{ t('tree_done') }}</span>
      <span v-if="algo === 'mergeSort'" class="rec-leg-item"><span class="rec-dot rec-dot-merge"></span>{{ t('tree_merging') }}</span>
      <span class="rec-leg-item"><span class="rec-dot rec-dot-pending"></span>{{ t('tree_pending') }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  nodes:         { type: Array,  default: () => [] },
  activeNodeId:  { type: Number, default: -1 },
  doneNodeIds:   { type: Array,  default: () => [] },
  arrayLen:      { type: Number, default: 1 },
  algo:          { type: String, default: "quickSort" },
});

const R      = 18;
const ROW_H  = 54;
const PAD_X  = 24;
const PAD_Y  = 20;
const MIN_W  = 280;

const maxDepth = computed(() =>
  props.nodes.length ? Math.max(...props.nodes.map(n => n.depth)) : 0
);

const svgH = computed(() => PAD_Y + (maxDepth.value + 1) * ROW_H + PAD_Y);
const svgW = computed(() => Math.max(MIN_W, props.arrayLen * 32 + PAD_X * 2));

const positioned = computed(() => {
  const availW = svgW.value - PAD_X * 2;
  const n1 = Math.max(props.arrayLen - 1, 1);
  return props.nodes.map(nd => {
    const cx = PAD_X + ((nd.left + nd.right) / 2 / n1) * availW;
    const cy = PAD_Y + nd.depth * ROW_H + R;
    let subLabel = null;
    if (props.algo === "quickSort" && nd.pivotAt !== null) subLabel = `p=${nd.pivotAt + 1}`;
    if (props.algo === "mergeSort" && nd.mid !== null)    subLabel = `m=${nd.mid + 1}`;
    return { ...nd, x: cx, y: cy, subLabel };
  });
});

const posMap = computed(() => Object.fromEntries(positioned.value.map(n => [n.id, n])));

const edges = computed(() =>
  positioned.value
    .filter(n => n.parentId !== null && posMap.value[n.parentId])
    .map(n => {
      const p = posMap.value[n.parentId];
      return { key: `${n.parentId}-${n.id}`, x1: p.x, y1: p.y, x2: n.x, y2: n.y };
    })
);

const doneSet = computed(() => new Set(props.doneNodeIds));

function nodeClass(n) {
  if (n.id === props.activeNodeId) {
    return n.phase === "merge" ? "rec-node rec-node-merge" : "rec-node rec-node-active";
  }
  if (doneSet.value.has(n.id)) return "rec-node rec-node-done";
  return "rec-node rec-node-pending";
}

function textClass(n) {
  if (n.id === props.activeNodeId || doneSet.value.has(n.id)) return "rec-text rec-text-light";
  return "rec-text";
}
</script>
