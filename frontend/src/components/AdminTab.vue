<template>
  <section class="card">
    <h2>{{ t('admin_title') }}</h2>
    <p class="muted">{{ t('admin_desc') }}</p>

    <!-- Întrebări Quiz -->
    <h3 class="cnt-title">{{ t('admin_quiz_title') }}</h3>
    <div class="cnt-form">
      <div class="row">
        <label>{{ t('admin_prompt') }} *</label>
        <input v-model="newQ.prompt" placeholder="Ex: Care este complexitatea Bubble Sort în cazul cel mai rău?" />
      </div>
      <div class="cnt-opts">
        <div class="row"><label>{{ t('admin_options') }} 1 *</label><input v-model="newQ.opt1" placeholder="Ex: O(n²)" /></div>
        <div class="row"><label>{{ t('admin_options') }} 2 *</label><input v-model="newQ.opt2" placeholder="Ex: O(n log n)" /></div>
        <div class="row"><label>{{ t('admin_options') }} 3</label><input v-model="newQ.opt3" :placeholder="t('admin_optional')" /></div>
        <div class="row"><label>{{ t('admin_options') }} 4</label><input v-model="newQ.opt4" :placeholder="t('admin_optional')" /></div>
      </div>
      <div class="row">
        <label>{{ t('admin_correct') }} *</label>
        <select v-model="newQ.correct" :disabled="newQOptions.length < 2">
          <option value="">{{ t('admin_select_first') }}</option>
          <option v-for="o in newQOptions" :key="o" :value="o">{{ o }}</option>
        </select>
      </div>
      <div class="row">
        <label>{{ t('admin_explanation') }}</label>
        <input v-model="newQ.explanation" placeholder="Ex: Bubble Sort face n·(n-1)/2 comparații în cazul cel mai rău." />
      </div>
      <button @click="submitQuestion" :disabled="!newQValid">+ {{ t('admin_add_q') }}</button>
    </div>

    <template v-if="customQuestions.length > 0">
      <h3 class="cnt-title">{{ t('admin_my_questions') }} ({{ customQuestions.length }})</h3>
      <ul class="cnt-list">
        <li v-for="q in customQuestions" :key="q.id" class="cnt-item">
          <div class="cnt-item-body">
            <p class="cnt-q">{{ q.prompt }}</p>
            <p class="cnt-ans">{{ t('admin_correct_lbl') }} <strong>{{ q.correct }}</strong>
              <span v-if="q.explanation" class="cnt-expl"> · {{ q.explanation }}</span>
            </p>
          </div>
          <button class="danger" @click="deleteQuestion(q.id)">{{ t('admin_delete') }}</button>
        </li>
      </ul>
    </template>

    <hr class="cnt-divider" />

    <!-- Seturi Simulator -->
    <h3 class="cnt-title">{{ t('admin_ex_title') }}</h3>
    <div class="cnt-form">
      <div class="row"><label>{{ t('admin_ex_name') }} *</label><input v-model="form.title" placeholder="Ex: Sortare vector clasa a 9-a" /></div>
      <div class="row">
        <label>{{ t('admin_ex_algo') }}</label>
        <select v-model="form.algorithm">
          <option v-for="algo in Object.values(ALGORITHMS)" :key="algo.id" :value="algo.id">{{ algo.name }}</option>
        </select>
      </div>
      <div v-if="form.algorithm !== 'bfs' && form.algorithm !== 'dfs'" class="row">
        <label>{{ t('admin_ex_vector') }}</label>
        <input v-model="form.payload" placeholder="ex: 5, 1, 9, 3, 7" />
      </div>
      <div v-else class="row">
        <label>{{ t('label_start_node') }}</label>
        <input v-model="form.payload" placeholder="A" maxlength="1" style="max-width:80px" />
      </div>
      <button @click="submitSet" :disabled="!form.title.trim()">+ {{ t('admin_add_ex') }}</button>
    </div>

    <ul v-if="customSets.length > 0" class="cnt-list">
      <li v-for="set in customSets" :key="set.id" class="cnt-item">
        <span class="cnt-set-label">{{ set.title }} <span class="muted">— {{ ALGORITHMS[set.algorithm]?.name || set.algorithm }}</span></span>
        <div class="buttons">
          <button @click="loadSet(set)">{{ t('admin_load') }}</button>
          <button class="danger" @click="deleteSet(set.id)">{{ t('admin_delete') }}</button>
        </div>
      </li>
    </ul>

    <p v-if="customQuestions.length === 0 && customSets.length === 0" class="muted" style="margin-top:12px">
      {{ t('admin_no_questions') }}
    </p>
  </section>
</template>

<script setup>
import { reactive, computed } from "vue";
import { ALGORITHMS } from "../algorithms.js";
import { useI18n } from "../i18n/index.js";
import { useCustomContent } from "../composables/useCustomContent.js";
import { useSimulatorState } from "../composables/useSimulatorState.js";

const emit = defineEmits(["load-set"]);

const { t } = useI18n();
const { customQuestions, customSets, addQuestion, deleteQuestion, addSet, deleteSet } = useCustomContent();
const { loadPreset } = useSimulatorState();

const newQ = reactive({ prompt: "", opt1: "", opt2: "", opt3: "", opt4: "", correct: "", explanation: "" });
const form = reactive({ title: "", algorithm: "bubbleSort", payload: "" });

const newQOptions = computed(() => [newQ.opt1, newQ.opt2, newQ.opt3, newQ.opt4].filter(o => o.trim()));
const newQValid   = computed(() => newQ.prompt.trim() && newQ.opt1.trim() && newQ.opt2.trim() && newQOptions.value.includes(newQ.correct));

function submitQuestion() {
  if (!newQValid.value) return;
  addQuestion({
    id: crypto.randomUUID(),
    prompt: newQ.prompt.trim(),
    options: newQOptions.value,
    correct: newQ.correct,
    explanation: newQ.explanation.trim(),
  });
  Object.assign(newQ, { prompt: "", opt1: "", opt2: "", opt3: "", opt4: "", correct: "", explanation: "" });
}

function submitSet() {
  if (!form.title.trim()) return;
  addSet({ id: crypto.randomUUID(), title: form.title.trim(), algorithm: form.algorithm, payload: form.payload.trim() });
  form.title = ""; form.payload = "";
}

function loadSet(set) {
  loadPreset(set);
  emit("load-set");
}
</script>
