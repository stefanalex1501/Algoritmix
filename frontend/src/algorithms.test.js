import { describe, it, expect } from "vitest";
import {
  parseVector,
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
  linearSearchSteps,
  binarySearchSteps,
  bfsSteps,
  dfsSteps,
  buildSteps,
  DEFAULT_GRAPH,
} from "./algorithms";

// ── parseVector ────────────────────────────────────────────
describe("parseVector", () => {
  it("parsează numere separate prin virgulă", () => {
    expect(parseVector("1, 2, 3")).toEqual([1, 2, 3]);
  });
  it("parsează numere separate prin spațiu", () => {
    expect(parseVector("4 5 6")).toEqual([4, 5, 6]);
  });
  it("ignoră valorile non-numerice", () => {
    expect(parseVector("1, abc, 3")).toEqual([1, 3]);
  });
  it("returnează array gol pentru input gol", () => {
    expect(parseVector("")).toEqual([]);
  });
  it("parsează numere negative", () => {
    expect(parseVector("-2, 0, 5")).toEqual([-2, 0, 5]);
  });
});

// ── bubbleSortSteps ────────────────────────────────────────
describe("bubbleSortSteps", () => {
  it("returnează cel puțin 2 pași", () => {
    expect(bubbleSortSteps([3, 1, 2]).length).toBeGreaterThan(1);
  });
  it("primul pas conține vectorul inițial cu pseudoLine -1", () => {
    const steps = bubbleSortSteps([3, 1, 2]);
    expect(steps[0].array).toEqual([3, 1, 2]);
    expect(steps[0].pseudoLine).toBe(-1);
  });
  it("ultimul pas conține vectorul sortat", () => {
    const steps = bubbleSortSteps([3, 1, 2]);
    expect(steps.at(-1).array).toEqual([1, 2, 3]);
  });
  it("sortează corect un vector de 5 elemente", () => {
    const steps = bubbleSortSteps([8, 2, 6, 1, 4]);
    expect(steps.at(-1).array).toEqual([1, 2, 4, 6, 8]);
  });
  it("vectorul deja sortat rămâne neschimbat", () => {
    const steps = bubbleSortSteps([1, 2, 3]);
    expect(steps.at(-1).array).toEqual([1, 2, 3]);
  });
  it("pașii de comparare au pseudoLine 2 și active cu 2 indici", () => {
    const steps = bubbleSortSteps([3, 1]);
    const cmp = steps.find((s) => s.pseudoLine === 2);
    expect(cmp).toBeDefined();
    expect(cmp.active).toHaveLength(2);
  });
  it("pașii de interschimbare au pseudoLine 3 și swapped true", () => {
    const steps = bubbleSortSteps([2, 1]);
    const swap = steps.find((s) => s.pseudoLine === 3);
    expect(swap).toBeDefined();
    expect(swap.swapped).toBe(true);
  });
});

// ── selectionSortSteps ────────────────────────────────────
describe("selectionSortSteps", () => {
  it("ultimul pas conține vectorul sortat", () => {
    const steps = selectionSortSteps([5, 3, 1, 4, 2]);
    expect(steps.at(-1).array).toEqual([1, 2, 3, 4, 5]);
  });
  it("există pași cu pseudoLine 1 (minIdx = i)", () => {
    const steps = selectionSortSteps([3, 1, 2]);
    expect(steps.some((s) => s.pseudoLine === 1)).toBe(true);
  });
  it("există pași cu pseudoLine 4 (swap)", () => {
    const steps = selectionSortSteps([3, 1, 2]);
    expect(steps.some((s) => s.pseudoLine === 4)).toBe(true);
  });
  it("sortedUpTo crește monoton", () => {
    const steps = selectionSortSteps([3, 1, 2]);
    const sorted = steps.filter((s) => s.sortedUpTo !== undefined).map((s) => s.sortedUpTo);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i]).toBeGreaterThanOrEqual(sorted[i - 1]);
    }
  });
});

// ── quickSortSteps ────────────────────────────────────────
describe("quickSortSteps", () => {
  it("ultimul pas conține vectorul sortat", () => {
    const steps = quickSortSteps([8, 2, 6, 1, 4]);
    expect(steps.at(-1).array).toEqual([1, 2, 4, 6, 8]);
  });
  it("există pași cu pivot definit (pseudoLine 0)", () => {
    const steps = quickSortSteps([3, 1, 2]);
    const pivotStep = steps.find((s) => s.pseudoLine === 0);
    expect(pivotStep).toBeDefined();
    expect(pivotStep.pivot).toBeDefined();
  });
  it("există pași de plasare pivot (pseudoLine 3)", () => {
    const steps = quickSortSteps([3, 1, 2]);
    expect(steps.some((s) => s.pseudoLine === 3)).toBe(true);
  });
  it("sortează un vector cu duplicate", () => {
    const steps = quickSortSteps([3, 1, 3, 2]);
    expect(steps.at(-1).array).toEqual([1, 2, 3, 3]);
  });
});

// ── binarySearchSteps ────────────────────────────────────
describe("binarySearchSteps", () => {
  it("găsește un element existent", () => {
    const steps = binarySearchSteps([1, 3, 5, 7, 9], 5);
    const found = steps.find((s) => s.found === true);
    expect(found).toBeDefined();
    expect(found.array[found.mid]).toBe(5);
  });
  it("raportează not found pentru element lipsă", () => {
    const steps = binarySearchSteps([1, 3, 5, 7, 9], 4);
    expect(steps.some((s) => s.found === true)).toBe(false);
  });
  it("sortează automat vectorul înainte de căutare", () => {
    const steps = binarySearchSteps([5, 1, 3], 3);
    expect(steps[0].array).toEqual([1, 3, 5]);
  });
  it("pașii au left ≤ mid ≤ right", () => {
    const steps = binarySearchSteps([1, 2, 3, 4, 5], 3);
    steps
      .filter((s) => s.mid !== null && s.mid !== undefined)
      .forEach((s) => {
        expect(s.mid).toBeGreaterThanOrEqual(s.left);
        expect(s.mid).toBeLessThanOrEqual(s.right);
      });
  });
  it("găsește primul și ultimul element", () => {
    const v = [1, 3, 5, 7, 9];
    expect(binarySearchSteps(v, 1).some((s) => s.found)).toBe(true);
    expect(binarySearchSteps(v, 9).some((s) => s.found)).toBe(true);
  });
});

// ── bfsSteps ──────────────────────────────────────────────
describe("bfsSteps", () => {
  it("vizitează toate nodurile accesibile din A", () => {
    const steps = bfsSteps(DEFAULT_GRAPH, "A");
    const last = steps.at(-1);
    expect(last.order).toContain("A");
    expect(last.order).toContain("B");
    expect(last.order).toContain("F");
  });
  it("primul pas are pseudoLine 0 și A în coadă", () => {
    const steps = bfsSteps(DEFAULT_GRAPH, "A");
    expect(steps[0].pseudoLine).toBe(0);
    expect(steps[0].queue).toContain("A");
  });
  it("pașii de vizitare au pseudoLine 3 și current definit", () => {
    const steps = bfsSteps(DEFAULT_GRAPH, "A");
    const visit = steps.find((s) => s.pseudoLine === 3);
    expect(visit).toBeDefined();
    expect(visit.current).not.toBeNull();
  });
  it("pașii de adăugare vecin au pseudoLine 5", () => {
    const steps = bfsSteps(DEFAULT_GRAPH, "A");
    const add = steps.find((s) => s.pseudoLine === 5);
    expect(add).toBeDefined();
    expect(add.next).not.toBeNull();
  });
  it("ultimul pas are coada goală și pseudoLine -1", () => {
    const steps = bfsSteps(DEFAULT_GRAPH, "A");
    const last = steps.at(-1);
    expect(last.queue).toHaveLength(0);
    expect(last.pseudoLine).toBe(-1);
  });
  it("nicio nod nu e vizitat de două ori", () => {
    const steps = bfsSteps(DEFAULT_GRAPH, "A");
    const last = steps.at(-1);
    expect(new Set(last.order).size).toBe(last.order.length);
  });
});

// ── dfsSteps ──────────────────────────────────────────────
describe("dfsSteps", () => {
  it("vizitează cel puțin nodul de start", () => {
    const steps = dfsSteps(DEFAULT_GRAPH, "A");
    expect(steps.at(-1).order).toContain("A");
  });
  it("ultimul pas are pseudoLine -1", () => {
    const steps = dfsSteps(DEFAULT_GRAPH, "A");
    expect(steps.at(-1).pseudoLine).toBe(-1);
  });
  it("niciun nod nu e vizitat de două ori", () => {
    const steps = dfsSteps(DEFAULT_GRAPH, "A");
    const last = steps.at(-1);
    expect(new Set(last.order).size).toBe(last.order.length);
  });
  it("există pași de vizitare cu pseudoLine 3", () => {
    const steps = dfsSteps(DEFAULT_GRAPH, "A");
    expect(steps.some((s) => s.pseudoLine === 3)).toBe(true);
  });
});

// ── insertionSortSteps ────────────────────────────────────
describe("insertionSortSteps", () => {
  it("ultimul pas conține vectorul sortat", () => {
    const steps = insertionSortSteps([5, 3, 1, 4, 2]);
    expect(steps.at(-1).array).toEqual([1, 2, 3, 4, 5]);
  });
  it("primul pas are vectorul inițial cu pseudoLine -1", () => {
    const steps = insertionSortSteps([3, 1, 2]);
    expect(steps[0].array).toEqual([3, 1, 2]);
    expect(steps[0].pseudoLine).toBe(-1);
  });
  it("există pași cu keyIdx definit (pseudoLine 1)", () => {
    const steps = insertionSortSteps([3, 1, 2]);
    const keyStep = steps.find((s) => s.pseudoLine === 1);
    expect(keyStep).toBeDefined();
    expect(keyStep.keyIdx).toBeDefined();
  });
  it("există pași de deplasare (pseudoLine 4) pe vector nesortat", () => {
    const steps = insertionSortSteps([3, 1, 2]);
    expect(steps.some((s) => s.pseudoLine === 4)).toBe(true);
  });
  it("există pași de inserare (pseudoLine 5)", () => {
    const steps = insertionSortSteps([3, 1, 2]);
    expect(steps.some((s) => s.pseudoLine === 5)).toBe(true);
  });
  it("sortedUpTo crește monoton", () => {
    const steps = insertionSortSteps([4, 3, 2, 1]);
    const vals = steps.filter((s) => s.sortedUpTo !== undefined).map((s) => s.sortedUpTo);
    for (let i = 1; i < vals.length; i++) {
      expect(vals[i]).toBeGreaterThanOrEqual(vals[i - 1]);
    }
  });
  it("vector deja sortat produce niciun pas de deplasare", () => {
    const steps = insertionSortSteps([1, 2, 3]);
    expect(steps.some((s) => s.pseudoLine === 4)).toBe(false);
  });
  it("sortează corect un vector cu duplicate", () => {
    const steps = insertionSortSteps([3, 1, 3, 2]);
    expect(steps.at(-1).array).toEqual([1, 2, 3, 3]);
  });
});

// ── linearSearchSteps ─────────────────────────────────────
describe("linearSearchSteps", () => {
  it("găsește un element existent", () => {
    const steps = linearSearchSteps([4, 7, 2, 9, 1], 9);
    const found = steps.find((s) => s.found === true);
    expect(found).toBeDefined();
    expect(found.active).toContain(3);
  });
  it("raportează not found pentru element lipsă", () => {
    const steps = linearSearchSteps([1, 2, 3], 99);
    expect(steps.some((s) => s.found === true)).toBe(false);
    expect(steps.at(-1).pseudoLine).toBe(3);
  });
  it("primul pas are active gol și pseudoLine 0", () => {
    const steps = linearSearchSteps([1, 2, 3], 2);
    expect(steps[0].active).toHaveLength(0);
    expect(steps[0].pseudoLine).toBe(0);
  });
  it("pașii de verificare au pseudoLine 1 și active cu un index", () => {
    const steps = linearSearchSteps([5, 3, 8], 3);
    const check = steps.find((s) => s.pseudoLine === 1);
    expect(check).toBeDefined();
    expect(check.active).toHaveLength(1);
  });
  it("se oprește imediat la primul element", () => {
    const steps = linearSearchSteps([7, 1, 2], 7);
    const found = steps.find((s) => s.found === true);
    expect(found).toBeDefined();
    expect(found.active[0]).toBe(0);
  });
  it("vectorul nu este modificat", () => {
    const vec = [3, 1, 4, 1, 5];
    const steps = linearSearchSteps(vec, 4);
    steps.forEach((s) => expect(s.array).toEqual([3, 1, 4, 1, 5]));
  });
});

// ── mergeSortSteps ────────────────────────────────────────
describe("mergeSortSteps", () => {
  it("ultimul pas conține vectorul sortat", () => {
    const steps = mergeSortSteps([5, 3, 1, 4, 2]);
    expect(steps.at(-1).array).toEqual([1, 2, 3, 4, 5]);
  });
  it("primul pas are vectorul inițial cu pseudoLine -1", () => {
    const steps = mergeSortSteps([3, 1, 2]);
    expect(steps[0].array).toEqual([3, 1, 2]);
    expect(steps[0].pseudoLine).toBe(-1);
  });
  it("există pași de împărțire (pseudoLine 1)", () => {
    const steps = mergeSortSteps([4, 2, 3, 1]);
    expect(steps.some((s) => s.pseudoLine === 1)).toBe(true);
  });
  it("există pași de interclasare (pseudoLine 4) cu mergeRange definit", () => {
    const steps = mergeSortSteps([4, 2, 3, 1]);
    const mergeStep = steps.find((s) => s.pseudoLine === 4 && s.mergeRange !== null);
    expect(mergeStep).toBeDefined();
    expect(mergeStep.mergeRange).toHaveLength(2);
  });
  it("sortează corect un vector de 6 elemente", () => {
    const steps = mergeSortSteps([8, 2, 6, 1, 4, 9]);
    expect(steps.at(-1).array).toEqual([1, 2, 4, 6, 8, 9]);
  });
  it("sortează corect un vector cu duplicate", () => {
    const steps = mergeSortSteps([3, 1, 3, 2]);
    expect(steps.at(-1).array).toEqual([1, 2, 3, 3]);
  });
  it("vector cu un element nu produce pași de interclasare", () => {
    const steps = mergeSortSteps([5]);
    expect(steps.every((s) => s.mergeRange === null)).toBe(true);
  });
});

// ── buildSteps ────────────────────────────────────────────
describe("buildSteps", () => {
  it("returnează pași pentru bubbleSort", () => {
    const steps = buildSteps("bubbleSort", { vector: [3, 1, 2] });
    expect(steps.length).toBeGreaterThan(0);
  });
  it("returnează pași pentru bfs", () => {
    const steps = buildSteps("bfs", { graph: DEFAULT_GRAPH, startNode: "A" });
    expect(steps.length).toBeGreaterThan(0);
  });
  it("returnează array gol pentru id necunoscut", () => {
    expect(buildSteps("unknown", {})).toEqual([]);
  });
  it("returnează pași pentru insertionSort", () => {
    expect(buildSteps("insertionSort", { vector: [3, 1, 2] }).length).toBeGreaterThan(0);
  });
  it("returnează pași pentru mergeSort", () => {
    expect(buildSteps("mergeSort", { vector: [3, 1, 2] }).length).toBeGreaterThan(0);
  });
  it("returnează pași pentru linearSearch", () => {
    expect(buildSteps("linearSearch", { vector: [3, 1, 2], target: 1 }).length).toBeGreaterThan(0);
  });
});
