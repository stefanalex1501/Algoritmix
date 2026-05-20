import { ref, watch } from "vue";

const THEME_KEY = "algoritmix_theme";
const isDark = ref(localStorage.getItem(THEME_KEY) !== "light");

function applyTheme(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
}

watch(isDark, applyTheme, { immediate: true });

export function useTheme() {
  function toggleTheme() { isDark.value = !isDark.value; }
  return { isDark, toggleTheme };
}
