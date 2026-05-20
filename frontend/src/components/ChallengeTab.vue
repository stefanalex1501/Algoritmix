<template>
  <section class="card">
    <div class="challenge-header">
      <div>
        <h2>{{ t('challenge_title') }}</h2>
        <p class="muted" style="margin:4px 0 0">{{ t('challenge_desc') }}</p>
      </div>
      <span class="score-chip" v-if="score.total > 0">{{ score.correct }}/{{ score.total }}</span>
    </div>

    <!-- Pasul curent -->
    <div v-if="challenge" class="viz-area">
      <div class="step-header">
        <span class="step-badge">{{ t('challenge_step') }}</span>
        <span class="step-msg">{{ t('challenge_question', { algo: algoName }) }}</span>
      </div>

      <!-- Vizualizare pas curent -->
      <div class="challenge-current">
        <p class="challenge-sublabel">{{ t('challenge_current_state') }}</p>
        <div v-if="isBsearch" class="bsearch-viz">
          <div class="bsearch-target">{{ t('search_for') }} <strong>{{ challenge.current.target }}</strong></div>
          <div class="bsearch-array">
            <div v-for="(val, i) in challenge.current.array" :key="i" class="bsearch-cell">
              <div class="bsearch-box" :class="bsearchClass(i, challenge.current)">{{ val }}</div>
              <div class="bsearch-markers">
                <span v-if="i === challenge.current.left"  class="mk-st">st</span>
                <span v-if="i === challenge.current.mid"   class="mk-mij">mij</span>
                <span v-if="i === challenge.current.right" class="mk-dr">dr</span>
              </div>
              <div class="bsearch-idx">{{ i + 1 }}</div>
            </div>
          </div>
        </div>
        <div v-else class="bars-container">
          <div class="bars">
            <div v-for="(val, i) in challenge.current.array" :key="i" class="bar-wrap">
              <span class="bar-val">{{ val }}</span>
              <div class="bar" :style="stepBarStyle(val, i, challenge.current)"></div>
              <span class="bar-idx">{{ i + 1 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Opțiuni: care e pasul următor? -->
      <p class="challenge-question-lbl">{{ t('challenge_pick_next') }}</p>
      <div class="challenge-options">
        <div
          v-for="(opt, idx) in challenge.options" :key="idx"
          class="challenge-opt"
          :class="optClass(idx)"
          @click="answer(idx)"
          :style="{ cursor: answered ? 'default' : 'pointer' }"
        >
          <div v-if="isBsearch" class="bsearch-array ch-opt-array">
            <div v-for="(val, i) in opt.array" :key="i" class="bsearch-cell">
              <div class="bsearch-box bsearch-box-sm" :class="bsearchClass(i, opt)">{{ val }}</div>
              <div class="bsearch-markers">
                <span v-if="i === opt.left"  class="mk-st">st</span>
                <span v-if="i === opt.mid"   class="mk-mij">mij</span>
                <span v-if="i === opt.right" class="mk-dr">dr</span>
              </div>
            </div>
          </div>
          <div v-else class="bars ch-opt-bars">
            <div v-for="(val, i) in opt.array" :key="i" class="bar-wrap bar-wrap-sm">
              <div class="bar bar-sm" :style="optBarStyle(val, i, opt)"></div>
              <span class="bar-idx">{{ i + 1 }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="answered" class="quiz-result" :class="wasCorrect ? 'result-ok' : 'result-bad'">
        <strong>{{ wasCorrect ? t('quiz_correct') : t('quiz_wrong') }}</strong>
        {{ wasCorrect ? t('challenge_right') : t('challenge_wrong') }}
      </div>

      <button class="quiz-next-btn" @click="nextChallenge" style="margin-top:14px">
        {{ answered ? t('challenge_next') : t('quiz_skip') }}
      </button>
    </div>

    <p v-else class="muted" style="margin-top:16px">{{ t('challenge_loading') }}</p>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { ALGORITHMS, bubbleSortSteps, selectionSortSteps, insertionSortSteps, quickSortSteps, binarySearchSteps } from "../algorithms.js";
import { useI18n } from "../i18n/index.js";

const { t } = useI18n();

const SUPPORTED = ["bubbleSort", "selectionSort", "insertionSort", "quickSort", "binarySearch"];

const challenge  = ref(null);
const answered   = ref(false);
const chosen     = ref(null);
const wasCorrect = ref(false);
const score      = ref({ correct: 0, total: 0 });

const algoName  = computed(() => ALGORITHMS[challenge.value?.algo]?.name || "");
const isBsearch = computed(() => challenge.value?.algo === "binarySearch");

function randVec(len = 6) {
  return Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 14));
}

function buildChallenge() {
  const algo = SUPPORTED[Math.floor(Math.random() * SUPPORTED.length)];
  let steps, vec, target;

  if (algo === "binarySearch") {
    const raw = randVec(7);
    vec    = [...new Set(raw)].sort((a, b) => a - b);
    target = vec[Math.floor(Math.random() * vec.length)];
    steps  = binarySearchSteps(vec, target);
  } else {
    vec   = randVec(5 + Math.floor(Math.random() * 3));
    steps = algo === "bubbleSort"    ? bubbleSortSteps(vec)
          : algo === "selectionSort" ? selectionSortSteps(vec)
          : algo === "insertionSort" ? insertionSortSteps(vec)
          :                           quickSortSteps(vec);
  }

  // Pick a step that's not the first or last
  const candidates = steps.slice(1, -1).filter((_, i) => i < steps.length - 3);
  if (!candidates.length) { buildChallenge(); return; }

  const idx     = Math.floor(Math.random() * candidates.length);
  const current = candidates[idx];
  const correct = steps[steps.indexOf(current) + 1] ?? steps.at(-1);

  // Generate 3 wrong options by mutating the correct array
  const wrongs = generateWrongs(correct, algo, 3);
  const options = shuffle([correct, ...wrongs]);
  const correctIdx = options.indexOf(correct);

  challenge.value  = { algo, current, options, correctIdx };
  answered.value   = false;
  chosen.value     = null;
  wasCorrect.value = false;
}

function generateWrongs(correct, algo, n) {
  const results = [];
  for (let attempt = 0; results.length < n && attempt < 20; attempt++) {
    const arr = [...correct.array];
    const i = Math.floor(Math.random() * arr.length);
    const j = Math.floor(Math.random() * arr.length);
    if (i !== j) { [arr[i], arr[j]] = [arr[j], arr[i]]; }
    else { arr[i] = 1 + Math.floor(Math.random() * 14); }

    if (algo === "binarySearch") {
      const midOpts = [0, Math.floor(arr.length / 2), arr.length - 1];
      const mid = midOpts[Math.floor(Math.random() * midOpts.length)];
      const wrong = { ...correct, array: arr, mid };
      if (!results.some(r => JSON.stringify(r.array) === JSON.stringify(arr))) {
        results.push(wrong);
      }
    } else {
      const wrong = { ...correct, array: arr };
      if (!results.some(r => JSON.stringify(r.array) === JSON.stringify(arr))
          && JSON.stringify(arr) !== JSON.stringify(correct.array)) {
        results.push(wrong);
      }
    }
  }
  while (results.length < n) {
    const arr = [...correct.array].reverse();
    results.push({ ...correct, array: arr });
  }
  return results;
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function answer(idx) {
  if (answered.value) return;
  answered.value   = true;
  chosen.value     = idx;
  wasCorrect.value = idx === challenge.value.correctIdx;
  score.value.total++;
  if (wasCorrect.value) score.value.correct++;
}

function nextChallenge() { buildChallenge(); }

function optClass(idx) {
  if (!answered.value) return "";
  if (idx === challenge.value.correctIdx) return "ch-opt-correct";
  if (idx === chosen.value)               return "ch-opt-wrong";
  return "ch-opt-dim";
}

// Colours for bars / cells
const MAX_N = 14;
function barH(val) { return Math.max(Math.round((val / MAX_N) * 80), 4) + "px"; }
function hue(val)  { return Math.round(220 - (val / MAX_N) * 220); }

function stepBarStyle(val, i, s) {
  const h = barH(val);
  if (s.pivot === i)         return { height: h, background: "#e05555" };
  if (s.active?.includes(i)) return { height: h, background: "#f0c040" };
  if (s.minIdx === i)        return { height: h, background: "#4ade80" };
  if (s.sortedUpTo !== undefined && i < s.sortedUpTo) return { height: h, background: "#1a4a2a" };
  if (s.keyIdx === i)        return { height: h, background: "#f0c040" };
  return { height: h, background: `hsl(${hue(val)}, 70%, 52%)` };
}

function optBarStyle(val, i, s) { return stepBarStyle(val, i, s); }

function bsearchClass(i, s) {
  if (!s) return "box-in";
  if (s.found && i === s.mid)  return "box-found";
  if (i === s.mid)             return "box-mid";
  if (s.left !== undefined && s.right !== undefined && (i < s.left || i > s.right)) return "box-out";
  return "box-in";
}

buildChallenge();
</script>
