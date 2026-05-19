import { ref, computed } from "vue";
import ro from "./ro.js";
import en from "./en.js";

const translations = { ro, en };
const lang = ref("ro");

export function useI18n() {
  function t(key, vars = {}) {
    let str = translations[lang.value]?.[key] ?? translations.ro[key] ?? key;
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, v);
    }
    return str;
  }

  const currentLang = computed(() => lang.value);

  function setLang(l) {
    if (translations[l]) lang.value = l;
  }

  function toggleLang() {
    lang.value = lang.value === "ro" ? "en" : "ro";
  }

  return { t, currentLang, setLang, toggleLang };
}
