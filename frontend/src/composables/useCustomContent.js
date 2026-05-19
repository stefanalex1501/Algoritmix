import { ref } from "vue";

const QUESTIONS_KEY = "algoritmix_custom_questions_v1";
const SETS_KEY      = "algoritmix_custom_sets_v1";

const customQuestions = ref([]);
const customSets      = ref([]);

function loadCustomContent() {
  try { const r = localStorage.getItem(QUESTIONS_KEY); if (r) customQuestions.value = JSON.parse(r); } catch {}
  try { const r = localStorage.getItem(SETS_KEY);      if (r) customSets.value      = JSON.parse(r); } catch {}
}

function saveQuestions() { localStorage.setItem(QUESTIONS_KEY, JSON.stringify(customQuestions.value)); }
function saveSets()      { localStorage.setItem(SETS_KEY,      JSON.stringify(customSets.value)); }

function addQuestion(q) { customQuestions.value.unshift(q); saveQuestions(); }
function deleteQuestion(id) { customQuestions.value = customQuestions.value.filter(q => q.id !== id); saveQuestions(); }

function addSet(s) { customSets.value.unshift(s); saveSets(); }
function deleteSet(id) { customSets.value = customSets.value.filter(s => s.id !== id); saveSets(); }

export function useCustomContent() {
  return { customQuestions, customSets, loadCustomContent, addQuestion, deleteQuestion, addSet, deleteSet };
}
