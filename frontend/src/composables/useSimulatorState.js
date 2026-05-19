import { reactive, ref } from "vue";

// Module-level sim config so AdminTab can load presets into the simulator
const sim = reactive({
  algorithm: "bubbleSort",
  vectorInput: "8, 2, 6, 1, 4",
  startNode: "A",
  targetInput: "7",
  graphPreset: 0,
});

// Set to true by AdminTab when a preset is loaded; SimulatorTab watches and rebuilds
const pendingBuild = ref(false);

function loadPreset(set) {
  sim.algorithm = set.algorithm;
  if (set.algorithm === "bfs" || set.algorithm === "dfs") {
    sim.startNode = set.payload || "A";
  } else {
    sim.vectorInput = set.payload;
  }
  pendingBuild.value = true;
}

export function useSimulatorState() {
  return { sim, pendingBuild, loadPreset };
}
