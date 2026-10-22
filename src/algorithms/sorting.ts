/**
 * TuneFlow Sorting Algorithms: Merge Sort & Quick Sort
 * 
 * Implementations record actual operational steps, comparisons, and element
 * movements for both production data sorting and interactive DSA visualization.
 */

import { Song } from '../types';

export type SortField = 'title' | 'duration' | 'artist' | 'year';

export interface SortStep {
  stepIndex: number;
  arraySnapshot: { id: string; title: string; value: string | number }[];
  highlightIndices: number[]; // Indices currently compared or swapped
  pivotIndex?: number;
  description: string;
  comparisonsCount: number;
}

export interface SortResult {
  sortedSongs: Song[];
  steps: SortStep[];
  comparisons: number;
  timeMs: number;
  algorithm: 'Merge Sort' | 'Quick Sort';
}

function getCompareValue(song: Song, field: SortField): string | number {
  if (field === 'duration') return song.duration;
  if (field === 'year') return song.year || 2024;
  if (field === 'artist') return song.artist.toLowerCase();
  return song.title.toLowerCase();
}

/**
 * Merge Sort Implementation (Divide and Conquer) - O(n log n)
 * Stable sort ideal for deterministic music catalog ordering.
 */
export function runMergeSort(songs: Song[], field: SortField = 'title'): SortResult {
  const startTime = performance.now();
  let comparisons = 0;
  const steps: SortStep[] = [];
  let stepIndex = 0;

  function recordStep(arr: Song[], highlights: number[], desc: string) {
    steps.push({
      stepIndex: stepIndex++,
      arraySnapshot: arr.map(s => ({ id: s.id, title: s.title, value: getCompareValue(s, field) })),
      highlightIndices: [...highlights],
      description: desc,
      comparisonsCount: comparisons,
    });
  }

  const workingArray = [...songs];
  recordStep(workingArray, [], `Starting Merge Sort on ${songs.length} tracks by ${field}`);

  function merge(left: Song[], right: Song[], baseOffset: number): Song[] {
    const result: Song[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      comparisons++;
      const valL = getCompareValue(left[i], field);
      const valR = getCompareValue(right[j], field);

      recordStep(
        workingArray,
        [baseOffset + i, baseOffset + left.length + j],
        `Comparing "${left[i].title}" (${valL}) vs "${right[j].title}" (${valR})`
      );

      if (valL <= valR) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    while (i < left.length) {
      result.push(left[i]);
      i++;
    }
    while (j < right.length) {
      result.push(right[j]);
      j++;
    }

    // Reflect back into working array for visualization
    for (let k = 0; k < result.length; k++) {
      workingArray[baseOffset + k] = result[k];
    }

    recordStep(
      workingArray,
      Array.from({ length: result.length }, (_, idx) => baseOffset + idx),
      `Merged sub-array of length ${result.length}`
    );

    return result;
  }

  function mergeSortHelper(arr: Song[], baseOffset: number): Song[] {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    const sortedLeft = mergeSortHelper(left, baseOffset);
    const sortedRight = mergeSortHelper(right, baseOffset + mid);

    return merge(sortedLeft, sortedRight, baseOffset);
  }

  const sortedSongs = mergeSortHelper(workingArray, 0);
  const timeMs = Number((performance.now() - startTime).toFixed(2));

  recordStep(sortedSongs, [], `Merge Sort complete in ${timeMs}ms with ${comparisons} comparisons.`);

  return {
    sortedSongs,
    steps,
    comparisons,
    timeMs,
    algorithm: 'Merge Sort',
  };
}

/**
 * Quick Sort Implementation (Lomuto Partitioning) - O(n log n) average
 * In-place sorting algorithm with high cache locality.
 */
export function runQuickSort(songs: Song[], field: SortField = 'title'): SortResult {
  const startTime = performance.now();
  let comparisons = 0;
  const steps: SortStep[] = [];
  let stepIndex = 0;
  const arr = [...songs];

  function recordStep(highlights: number[], pivotIdx: number | undefined, desc: string) {
    steps.push({
      stepIndex: stepIndex++,
      arraySnapshot: arr.map(s => ({ id: s.id, title: s.title, value: getCompareValue(s, field) })),
      highlightIndices: [...highlights],
      pivotIndex: pivotIdx,
      description: desc,
      comparisonsCount: comparisons,
    });
  }

  recordStep([], undefined, `Starting Quick Sort on ${songs.length} tracks by ${field}`);

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    const pivotVal = getCompareValue(pivot, field);
    let i = low - 1;

    recordStep([high], high, `Chosen Pivot: "${pivot.title}" (${pivotVal}) at index ${high}`);

    for (let j = low; j < high; j++) {
      comparisons++;
      const currentVal = getCompareValue(arr[j], field);

      recordStep([j, high], high, `Comparing "${arr[j].title}" (${currentVal}) against pivot "${pivot.title}" (${pivotVal})`);

      if (currentVal <= pivotVal) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        if (i !== j) {
          recordStep([i, j], high, `Swapped "${arr[i].title}" with "${arr[j].title}"`);
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    recordStep([i + 1], i + 1, `Placed pivot "${pivot.title}" into its sorted position at index ${i + 1}`);
    return i + 1;
  }

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  if (arr.length > 1) {
    quickSortHelper(0, arr.length - 1);
  }

  const timeMs = Number((performance.now() - startTime).toFixed(2));
  recordStep([], undefined, `Quick Sort complete in ${timeMs}ms with ${comparisons} comparisons.`);

  return {
    sortedSongs: arr,
    steps,
    comparisons,
    timeMs,
    algorithm: 'Quick Sort',
  };
}
