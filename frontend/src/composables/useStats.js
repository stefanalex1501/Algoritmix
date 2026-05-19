import { reactive, computed } from "vue";

const STATS_KEY = "algoritmix_stats_v1";

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

// quiz session display state (persisted together with stats)
const quizSession = reactive({ score: 0, total: 0, streak: 0 });

const accuracy = computed(() =>
  stats.quiz.total > 0 ? Math.round(stats.quiz.correct / stats.quiz.total * 100) : 0
);

function saveStats() {
  localStorage.setItem(STATS_KEY, JSON.stringify({
    quiz:       stats.quiz,
    mistakes:   stats.mistakes,
    quizScore:  quizSession.score,
    quizTotal:  quizSession.total,
    quizStreak: quizSession.streak,
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
    quizSession.score  = s.quizScore  ?? 0;
    quizSession.total  = s.quizTotal  ?? 0;
    quizSession.streak = s.quizStreak ?? 0;
  } catch {}
}

function resetStats() {
  stats.quiz.total = 0; stats.quiz.correct = 0; stats.quiz.bestStreak = 0;
  stats.quiz.byType.visual = { total: 0, correct: 0 };
  stats.quiz.byType.text   = { total: 0, correct: 0 };
  stats.quiz.recent = [];
  stats.sim.runs = 0;
  stats.mistakes = [];
  quizSession.score = 0; quizSession.total = 0; quizSession.streak = 0;
  saveStats();
}

export function useStats() {
  return { stats, quizSession, accuracy, saveStats, loadStats, resetStats };
}
